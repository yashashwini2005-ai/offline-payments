import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="p-6 pt-12 flex flex-col h-screen bg-premium-white relative overflow-hidden">
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigateTo('home')}
        className="mb-8 p-3 w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary-600 hover:bg-primary-50 transition-all shadow-sm"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </motion.button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 glass rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl relative">
            <motion.div
              animate={isProcessing ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`absolute inset-0 rounded-[2rem] border-2 border-dashed ${isProcessing ? 'border-primary-500/40 opacity-100' : 'border-transparent opacity-0'} transition-opacity duration-500`}
            />
            {isProcessing ? (
              <Fingerprint size={36} className="text-primary-500" />
            ) : (
              <Lock size={32} className="text-primary-600" />
            )}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-primary-900 italic">SECURE_AUTH</h2>
          <div className="bg-primary-50 px-6 py-2 rounded-full border border-primary-100">
            <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-widest">
              Authorizing <span className="text-primary-600">₹{pendingTransaction?.amount || 0}</span> to {pendingTransaction?.receiver || 'Target'}
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={isError ? { x: [-10, 10, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin.length >= i 
                  ? 'bg-primary-500 border-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' 
                  : 'bg-primary-50 border-primary-200'
              } ${isError ? 'border-red-500 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-12 gap-y-8 max-w-[320px] w-full px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <KeyButton key={num} onClick={() => handleKeyPress(num.toString())}>{num}</KeyButton>
          ))}
          <div />
          <KeyButton onClick={() => handleKeyPress('0')}>0</KeyButton>
          <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={handleDelete} 
            className="w-16 h-16 flex items-center justify-center text-primary-300 hover:text-primary-600 transition-colors"
          >
            <Delete size={28} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2 mb-12 relative z-10">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full border border-green-100">
          <ShieldCheck size={14} className="text-green-600" />
          <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

const KeyButton = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1, backgroundColor: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}
    whileTap={{ scale: 0.9, backgroundColor: 'rgba(59,130,246,0.1)' }}
    onClick={onClick}
    className="w-16 h-16 rounded-2xl border border-primary-900/5 bg-white flex items-center justify-center text-2xl font-black text-primary-900 transition-all duration-300 shadow-sm"
  >
    {children}
  </motion.button>
);

export default PinScreen;
