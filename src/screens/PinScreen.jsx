import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ChevronLeft, Delete, Fingerprint, Zap, AlertTriangle, ShieldOff, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_ATTEMPTS   = 3;
const COOLDOWN_SECS  = 300; // 5 minutes
const NOTIFY_API     = 'http://localhost:3001/notify';

// ─── Fraud alert — calls the /notify backend which forwards to Discord ────────
const triggerFraudAlert = async (attempts) => {
  try {
    const payload = {
      transactionId: `FRAUD-${Date.now()}`,
      amount:        0,
      merchant:      'PIN_BRUTE_FORCE_ATTEMPT',
      status:        'FRAUD_ALERT',
      timestamp:     new Date().toISOString(),
    };
    await fetch(NOTIFY_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
  } catch (_) {
    // Silent failure — never crash the UI
    console.error('[Security] Fraud alert delivery failed (non-critical)');
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PinScreen = () => {
  const { balance, offlineBalance, confirmTransaction, navigateTo, pendingTransaction, isOnline } = useApp();
  const { t } = useLanguage();

  // ── Existing state (untouched) ──────────────────────────────────────────────
  const [pin,          setPin]          = useState('');
  const [error,        setError]        = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');
  const [showBalance,  setShowBalance]  = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ── NEW: Security layer state ───────────────────────────────────────────────
  const [attempts,    setAttempts]    = useState(0);
  const [isBlocked,   setIsBlocked]   = useState(false);
  const [cooldown,    setCooldown]    = useState(0);
  const [showFraud,   setShowFraud]   = useState(false);
  const cooldownRef = useRef(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown(c => c - 1), 1000);
    } else if (cooldown === 0 && isBlocked) {
      // Cooldown expired — reset security state
      setIsBlocked(false);
      setAttempts(0);
      setShowFraud(false);
      setErrorMsg('');
    }
    return () => clearTimeout(cooldownRef.current);
  }, [cooldown, isBlocked]);

  // ── Core PIN handler — original logic preserved exactly ────────────────────
  const handleKeyPress = async (num) => {
    // Block input if locked out
    if (isBlocked || isProcessing) return;

    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin === '1234') {
          // ── CORRECT PIN ── (original logic, completely unchanged)
          setAttempts(0); // reset counter on success
          setErrorMsg('');

          if (pendingTransaction?.type === 'BANK_TRANSFER' && !isOnline) {
            setErrorMsg('Bank transfers require internet connection');
            setPin('');
            return;
          }
          if (pendingTransaction?.isBalanceCheck) {
            setShowBalance(true);
          } else {
            setIsProcessing(true);
            setErrorMsg('');
            setTimeout(() => {
              confirmTransaction();
              setIsProcessing(false);
            }, 2000);
          }
        } else {
          // ── INCORRECT PIN ── (security layer added here)
          const nextAttempts = attempts + 1;
          setAttempts(nextAttempts);
          setError(true);

          if (nextAttempts >= MAX_ATTEMPTS) {
            // 3rd wrong attempt — trigger lockout + fraud alert
            setIsBlocked(true);
            setCooldown(COOLDOWN_SECS);
            setShowFraud(true);
            setErrorMsg('');
            await triggerFraudAlert(nextAttempts);
          } else {
            const remaining = MAX_ATTEMPTS - nextAttempts;
            const isLastAttempt = remaining === 1;
            setErrorMsg(
              isLastAttempt
                ? `⚠️ Last attempt remaining`
                : `Incorrect PIN (${nextAttempts}/${MAX_ATTEMPTS} attempts)`
            );
            setTimeout(() => {
              setPin('');
              setError(false);
            }, 1500);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (!isBlocked && !isProcessing) setPin(pin.slice(0, -1));
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen px-4 py-4 md:p-8 flex flex-col bg-premium-white overflow-y-auto pb-32">
      {/* Header */}
      <div className="flex items-center mb-12">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateTo('home')}
          className="p-3 bg-primary-50 rounded-2xl text-primary-600"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col items-center">

        {/* Lock icon — turns red when blocked */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-colors ${
            isBlocked ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'
          }`}
        >
          {isBlocked ? <ShieldOff size={32} strokeWidth={2.5} /> : <Lock size={32} strokeWidth={2.5} />}
        </motion.div>

        <h2 className="text-3xl font-black tracking-tight text-primary-900 mb-2">
          {isBlocked ? 'Access Blocked' : t('enter_upi_pin')}
        </h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <ShieldCheck size={14} />
          {isBlocked ? 'Security Lockout Active' : t('secure_auth')}
        </p>

        {/* Error / warning message */}
        <AnimatePresence>
          {errorMsg && !isBlocked && (
            <motion.p
              key="errmsg"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`text-[10px] font-black uppercase tracking-widest mb-6 px-4 py-2 rounded-full ${
                attempts === MAX_ATTEMPTS - 1
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-red-500 bg-red-50'
              }`}
            >
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Cooldown timer shown when blocked */}
        <AnimatePresence>
          {isBlocked && (
            <motion.div
              key="cooldown"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="mb-8 px-6 py-4 bg-red-50 border border-red-100 rounded-3xl flex flex-col items-center gap-2 text-center w-full max-w-xs"
            >
              <div className="flex items-center gap-2 text-red-600">
                <Timer size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Cooldown Active</span>
              </div>
              <p className="text-red-500 font-black text-sm">
                Try again in{' '}
                <span className="text-2xl">
                  {cooldown >= 60
                    ? `${Math.ceil(cooldown / 60)}m ${cooldown % 60}s`
                    : `${cooldown}s`}
                </span>
              </p>
              <p className="text-[9px] text-red-400 uppercase tracking-widest font-bold">
                Access locked for 5 minutes
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN dots — hidden during lockout */}
        {!isBlocked && (
          <div className={`flex gap-6 mb-12 ${error ? 'animate-shake' : ''}`}>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={
                  pin.length > i
                    ? { scale: [1, 1.2, 1], backgroundColor: '#2563eb' }
                    : { scale: 1, backgroundColor: '#e2e8f0' }
                }
                className="w-5 h-5 rounded-full shadow-inner"
              />
            ))}
          </div>
        )}

        {/* Attempt progress bar (only after first wrong attempt) */}
        {attempts > 0 && !isBlocked && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full max-w-xs mb-6"
          >
            <div className="flex justify-between mb-1">
              {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full flex-1 mx-0.5 transition-colors ${
                    i < attempts ? 'bg-red-400' : 'bg-primary-100'
                  }`}
                />
              ))}
            </div>
            <p className="text-[9px] text-center font-black uppercase tracking-widest text-slate-500">
              {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining
            </p>
          </motion.div>
        )}

        {/* Numeric Keypad — disabled during lockout */}
        <div className={`grid grid-cols-3 gap-6 w-full max-w-xs ${isBlocked ? 'opacity-30 pointer-events-none' : ''}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <KeyButton key={num} onClick={() => handleKeyPress(num.toString())}>{num}</KeyButton>
          ))}
          <div className="flex items-center justify-center">
            <Fingerprint size={28} className="text-primary-200" />
          </div>
          <KeyButton onClick={() => handleKeyPress('0')}>0</KeyButton>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBackspace}
            className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-primary-900 hover:bg-primary-50 transition-all"
          >
            <Delete size={28} />
          </motion.button>
        </div>

        <button className="mt-12 text-primary-600 font-black text-[10px] uppercase tracking-widest hover:underline">
          {t('forgot_pin')}
        </button>
      </div>

      {/* ── Balance Modal (original, unchanged) ─────────────────────────── */}
      <AnimatePresence>
        {showBalance && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 shadow-2xl border border-primary-100 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-primary-900 mb-2">{t('user_profile')}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-8">Authorized Balance View</p>

              <div className="w-full space-y-4">
                {(!pendingTransaction?.balanceType || pendingTransaction.balanceType === 'online') && (
                  <div className="p-5 glass rounded-2xl border border-primary-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('online_wallet')}</span>
                    <span className="text-lg font-black text-primary-900">₹{balance.toLocaleString()}</span>
                  </div>
                )}
                {(!pendingTransaction?.balanceType || pendingTransaction.balanceType === 'offline') && (
                  <div className="p-5 glass rounded-2xl border border-primary-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('offline_reserve')}</span>
                    <span className="text-lg font-black text-primary-900">₹{offlineBalance}</span>
                  </div>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('home')}
                className="w-full mt-8 py-4 blue-gradient rounded-2xl font-black text-[10px] uppercase tracking-widest text-white"
              >
                {t('back_to_home')}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Processing overlay (original, unchanged) ────────────────────── */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Zap size={40} className="animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-primary-900">Processing Payment</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Establishing Secure Connection</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── NEW: Fraud Alert Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {showFraud && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-950/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl flex flex-col items-center text-center gap-4"
            >
              {/* Pulsing alert icon */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="w-20 h-20 bg-red-100 rounded-[2rem] flex items-center justify-center text-red-600"
              >
                <AlertTriangle size={40} strokeWidth={2} />
              </motion.div>

              <div>
                <h3 className="text-2xl font-black text-red-700 tracking-tight">Fraud Alert</h3>
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-1">Suspicious Activity Detected</p>
              </div>

              <div className="w-full space-y-2 text-left bg-red-50 rounded-3xl p-6 border border-red-100">
                <Row label="Reason"  value="Multiple incorrect PIN attempts" />
                <Row label="Attempts" value={`${MAX_ATTEMPTS} / ${MAX_ATTEMPTS}`} />
                <Row label="Action"  value="Access temporarily blocked" />
                <Row label="Alert"   value="Security team notified via Discord" />
              </div>

              <div className="flex items-center gap-2 text-red-500 font-black text-sm">
                <Timer size={16} />
                <span>Retry in{' '}
                  <span className="text-lg">
                    {cooldown >= 60
                      ? `${Math.floor(cooldown / 60)}m ${cooldown % 60}s`
                      : `${cooldown}s`}
                  </span>
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowFraud(false)}
                className="w-full mt-2 py-4 bg-red-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest"
              >
                Dismiss
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const KeyButton = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: '#eff6ff' }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="w-20 h-20 rounded-[2rem] bg-white border border-primary-50 text-2xl font-black text-primary-900 shadow-sm transition-all flex items-center justify-center"
  >
    {children}
  </motion.button>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between items-start gap-2 py-1 border-b border-red-100 last:border-0">
    <span className="text-[9px] font-black uppercase tracking-widest text-red-400 shrink-0">{label}</span>
    <span className="text-[10px] font-bold text-red-700 text-right">{value}</span>
  </div>
);

export default PinScreen;
