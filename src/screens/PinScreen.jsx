import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, ChevronLeft, ShieldCheck, Lock, Fingerprint } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PinScreen = () => {
  const { pendingTransaction, confirmTransaction, navigateTo } = useApp();
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleKeyPress = (val) => {
    if (isProcessing) return;
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      
      if (newPin.length === 4) {
        setIsProcessing(true);
        // Mock delay for "authenticating"
        setTimeout(async () => {
          if (newPin === '1234') {
            try {
              await confirmTransaction();
            } catch (err) {
              setIsError(true);
              setPin('');
              setIsProcessing(false);
            }
          } else {
            setIsError(true);
            setTimeout(() => {
              setPin('');
              setIsError(false);
              setIsProcessing(false);
            }, 800);
          }
        }, 1200);
      }
    }
  };

  const handleDelete = () => {
    if (isProcessing) return;
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="p-6 pt-12 flex flex-col h-screen bg-premium-dark relative overflow-hidden">
      {/* Security Overlay */}
      <div className="absolute inset-0 bg-gold-500/[0.01] pointer-events-none" />
      
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigateTo('home')}
        className="mb-8 p-3 w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </motion.button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 glass rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
            <motion.div
              animate={isProcessing ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-0 rounded-[2rem] border-2 border-dashed ${isProcessing ? 'border-gold-500/40 opacity-100' : 'border-transparent opacity-0'} transition-opacity duration-500`}
            />
            {isProcessing ? (
              <Fingerprint size={36} className="text-gold-500" />
            ) : (
              <Lock size={32} className="text-gold-400" />
            )}
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight italic">SECURITY_CHECK</h2>
          <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
              Authorizing <span className="text-gold-400">₹{pendingTransaction?.amount || 0}</span> to {pendingTransaction?.receiver || 'Target'}
            </p>
          </div>
        </div>

        {/* PIN Indicators - Gold Version */}
        <div className="flex gap-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={isError ? { x: [-10, 10, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 transform rotate-45 ${
                pin.length >= i 
                  ? 'bg-gold-500 border-gold-500 shadow-[0_0_25px_rgba(212,175,55,0.8)] scale-110' 
                  : 'bg-white/5 border-white/10'
              } ${isError ? 'border-red-500 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : ''}`}
            />
          ))}
        </div>

        {/* Premium Keypad */}
        <div className="grid grid-cols-3 gap-x-10 gap-y-8 max-w-[320px] w-full px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <KeyButton key={num} onClick={() => handleKeyPress(num.toString())}>{num}</KeyButton>
          ))}
          <div />
          <KeyButton onClick={() => handleKeyPress('0')}>0</KeyButton>
          <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleDelete} 
            className="w-16 h-16 flex items-center justify-center text-white/30 hover:text-white transition-colors"
          >
            <Delete size={28} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2 mb-12 relative z-10">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">
          <ShieldCheck size={12} className="text-green-500" />
          <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

const KeyButton = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(212,175,55,0.3)' }}
    whileTap={{ scale: 0.9, backgroundColor: 'rgba(212,175,55,0.1)' }}
    onClick={onClick}
    className="w-16 h-16 rounded-[1.5rem] border-2 border-white/[0.05] bg-white/[0.03] flex items-center justify-center text-2xl font-black font-display italic transition-all duration-300 shadow-lg"
  >
    {children}
  </motion.button>
);

export default PinScreen;
