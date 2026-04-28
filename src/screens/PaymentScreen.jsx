import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, User, QrCode, Info, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PaymentScreen = () => {
  const { navigateTo, pendingTransaction, balance, offlineBalance, isOnline } = useApp();
  const [amount, setAmount] = useState(pendingTransaction?.amount || '');
  const [receiver, setReceiver] = useState(pendingTransaction?.receiver || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    const val = parseFloat(amount);
    if (!receiver.includes('@') && receiver.length < 10) {
      setError('Invalid UPI ID or Mobile Number');
      return;
    }
    if (!val || val <= 0) {
      setError('Enter a valid amount');
      return;
    }

    const available = isOnline ? balance : offlineBalance;
    if (val > available) {
      setError(`Insufficient ${isOnline ? 'Wallet' : 'Offline'} Balance`);
      return;
    }

    setError('');
    navigateTo('pin', { amount: val, receiver });
  };

  return (
    <div className="p-6 pt-12 flex flex-col h-screen bg-premium-white">
      <motion.button 
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateTo('home')}
        className="mb-8 p-3 w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary-600 shadow-sm"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </motion.button>

      <div className="flex-1 space-y-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-primary-900">Send Money</h2>
          <p className="text-primary-900/40 text-xs font-bold uppercase tracking-widest">Instant {isOnline ? 'Online' : 'Offline'} Transfer</p>
        </div>

        <div className="space-y-6">
          {/* Receiver Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary-900/30 uppercase tracking-[0.2em] ml-2">Recipient</label>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-primary-600 transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="UPI ID or Mobile Number"
                className="w-full bg-white border border-primary-100 rounded-3xl py-5 px-14 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all placeholder:text-primary-900/20"
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors">
                <QrCode size={20} />
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary-900/30 uppercase tracking-[0.2em] ml-2">Amount</label>
            <div className="relative">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary-600 text-3xl font-black italic">₹</span>
              <input
                autoFocus
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-primary-50/50 border border-primary-100 rounded-[2.5rem] py-10 px-16 text-5xl font-black text-center text-primary-900 focus:outline-none focus:border-primary-500 transition-all font-display italic"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 bg-red-50 rounded-2xl border border-red-100"
            >
              <Info size={16} className="text-red-500" />
              <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          <div className="p-5 glass-dark rounded-3xl space-y-3 border border-primary-100/50">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-primary-900/40">
              <span>Payment Mode</span>
              <span className={isOnline ? 'text-green-600' : 'text-primary-600'}>
                {isOnline ? 'Online Wallet' : 'Offline Reserve'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-primary-900/40">
              <span>Available</span>
              <span className="text-primary-900">₹{isOnline ? balance.toLocaleString() : offlineBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <div className="flex items-center justify-center gap-2 text-primary-900/30">
          <ShieldCheck size={14} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Cryptographic Settlement</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full py-6 blue-gradient rounded-[2rem] text-white font-black tracking-widest shadow-xl shadow-primary-500/30 text-lg uppercase flex items-center justify-center gap-3"
        >
          Proceed to Pay <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default PaymentScreen;
