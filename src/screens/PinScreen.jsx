import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ChevronLeft, Delete, Fingerprint } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const PinScreen = () => {
  const { confirmTransaction, navigateTo, pendingTransaction } = useApp();
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '1234') {
          confirmTransaction();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
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
        <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-[0.2em] mb-12 flex items-center gap-2">
          <ShieldCheck size={14} /> {t('secure_auth')}
        </p>

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
