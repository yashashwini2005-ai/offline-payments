import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, IndianRupee, ArrowRight, AtSign, Smartphone, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

const PaymentScreen = () => {
  const { navigateTo, balance, offlineBalance, isOnline } = useApp();
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const val = parseFloat(amount);
    const maxBalance = isOnline ? balance : offlineBalance;

    if (!receiver.trim()) {
      setError('RECIPIENT_REQUIRED');
      return;
    }
    if (!val || val <= 0) {
      setError('INVALID_AMOUNT');
      return;
    }
    if (val > maxBalance) {
      setError('INSUFFICIENT_FUNDS');
      return;
    }

    setError('');
    navigateTo('pin', { amount: val, receiver });
  };

  return (
    <div className="p-6 pt-12 flex flex-col min-h-screen bg-premium-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/[0.03] blur-[120px] rounded-full -mr-48 -mt-48" />
      
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigateTo('home')}
        className="mb-10 p-3 w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </motion.button>

      <div className="space-y-2 mb-12 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 gold-gradient rounded-full" />
          <span className="text-[10px] font-black text-gold-500 uppercase tracking-[0.3em]">Direct Pay</span>
        </div>
        <h2 className="text-4xl font-black font-display tracking-tighter italic">Outbound Transfer</h2>
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Network Secure Protocol Active</p>
      </div>

      <div className="space-y-8 flex-1 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Recipient Gateway</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-500/40 group-focus-within:text-gold-500 transition-colors">
              {receiver.includes('@') ? <AtSign size={20} /> : <Smartphone size={20} />}
            </div>
            <input
              autoFocus
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="VPA ID or Mobile"
              className="w-full bg-white/[0.03] border-2 border-white/[0.05] rounded-[2rem] py-5 pl-14 pr-8 text-white placeholder:text-white/10 focus:outline-none focus:border-gold-500/50 focus:bg-white/[0.06] transition-all duration-300 font-bold"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Transaction Amount</label>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-500 group-focus-within:scale-110 transition-transform">
              <IndianRupee size={28} strokeWidth={3} />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/[0.03] border-2 border-white/[0.05] rounded-[2.5rem] py-8 pl-16 pr-8 text-5xl font-black font-display italic text-white placeholder:text-white/5 focus:outline-none focus:border-gold-500/50 focus:bg-white/[0.06] transition-all duration-300"
            />
          </div>
          
          <div className="flex justify-between items-center px-4 pt-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/20 uppercase">Available Liquidity</span>
              <span className="text-xs font-black text-white/60 font-display">₹{isOnline ? balance : offlineBalance}</span>
            </div>
            <div className="text-right">
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                isOnline ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
              }`}>
                {isOnline ? 'Network Live' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
            >
              <Zap size={18} className="text-red-500" />
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">
                {error.replace(/_/g, ' ')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-auto pb-10"
      >
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          className="w-full py-6 gold-gradient rounded-[2.5rem] text-premium-dark font-black text-xl flex items-center justify-center gap-3 shadow-2xl border-b-4 border-black/20"
        >
          AUTHENTICATE
          <ArrowRight size={24} strokeWidth={3} />
        </motion.button>
        <p className="text-center text-white/20 text-[8px] font-black uppercase tracking-[0.4em] mt-6">
          Encrypted P2P Payment Gateway
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentScreen;
