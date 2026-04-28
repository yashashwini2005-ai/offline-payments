import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ChevronLeft, Delete, Fingerprint, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const PinScreen = () => {
  const { balance, offlineBalance, confirmTransaction, navigateTo, pendingTransaction, isOnline } = useApp();
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleKeyPress = async (num) => {
    if (pin.length < 4 && !isProcessing) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '1234') {
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
            // Simulate processing for 2 seconds
            setTimeout(() => {
              confirmTransaction();
              setIsProcessing(false);
            }, 2000);
          }
        } else {
          setError(true);
          setErrorMsg('Invalid UPI PIN');
          setTimeout(() => {
            setPin('');
            setError(false);
            setErrorMsg('');
          }, 1500);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="flex flex-col h-screen bg-premium-white p-8">
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
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-primary-100 rounded-[2rem] flex items-center justify-center text-primary-600 mb-8"
        >
          <Lock size={32} strokeWidth={2.5} />
        </motion.div>

        <h2 className="text-3xl font-black tracking-tight text-primary-900 mb-2">{t('enter_upi_pin')}</h2>
        <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <ShieldCheck size={14} /> {t('secure_auth')}
        </p>

        {errorMsg && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-6 bg-red-50 px-4 py-2 rounded-full"
          >
            {errorMsg}
          </motion.p>
        )}

        {/* PIN Dots */}
        <div className={`flex gap-6 mb-12 ${error ? 'animate-shake' : ''}`}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={pin.length > i ? { scale: [1, 1.2, 1], backgroundColor: '#2563eb' } : { scale: 1, backgroundColor: '#e2e8f0' }}
              className="w-5 h-5 rounded-full shadow-inner"
            />
          ))}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
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
              <p className="text-[10px] font-black text-primary-900/40 uppercase tracking-widest mb-8">Authorized Balance View</p>
              
              <div className="w-full space-y-4">
                {(!pendingTransaction?.balanceType || pendingTransaction.balanceType === 'online') && (
                  <div className="p-5 glass rounded-2xl border border-primary-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">{t('online_wallet')}</span>
                    <span className="text-lg font-black text-primary-900">₹{balance.toLocaleString()}</span>
                  </div>
                )}
                {(!pendingTransaction?.balanceType || pendingTransaction.balanceType === 'offline') && (
                  <div className="p-5 glass rounded-2xl border border-primary-100 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">{t('offline_reserve')}</span>
                    <span className="text-lg font-black text-primary-900">₹{offlineBalance}</span>
                  </div>
                )}
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('home')}
                className="w-full mt-8 py-4 blue-gradient rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                {t('back_to_home')}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
                <p className="text-[10px] text-primary-900/40 font-black uppercase tracking-widest mt-1">Establishing Secure Connection</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

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

export default PinScreen;
