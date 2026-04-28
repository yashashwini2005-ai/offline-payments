import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Landmark, Send, User, Info, ShieldCheck, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BankTransferScreen = () => {
  const { navigateTo, balance, isOnline } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    ifsc: '',
    amount: ''
  });
  const [error, setError] = useState('');

  const handleNext = () => {
    const { name, accountNumber, ifsc, amount } = formData;
    const val = parseFloat(amount);

    if (!name || !accountNumber || !ifsc || !amount) {
      setError('All fields are required');
      return;
    }

    if (isNaN(accountNumber)) {
      setError('Account number must be numeric');
      return;
    }

    if (ifsc.length < 11) {
      setError('Enter a valid 11-digit IFSC code');
      return;
    }

    if (isNaN(val) || val <= 0) {
      setError('Enter a valid amount');
      return;
    }

    if (!isOnline) {
      setError('Bank transfers require internet connection');
      return;
    }

    if (val > balance) {
      setError('Insufficient Wallet Balance');
      return;
    }

    setError('');
    navigateTo('pin', { 
      type: 'BANK_TRANSFER',
      name, 
      accountNumber, 
      ifsc, 
      amount: val,
      receiver: name // For history/display
    });
  };

  return (
    <div className="p-6 pt-12 flex flex-col h-screen bg-premium-white">
      {/* Header */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => navigateTo('home')}
        className="mb-8 p-3 w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary-600 shadow-sm"
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </motion.button>

      <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide pb-20">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-primary-900 text-left">Bank Transfer</h2>
          <p className="text-primary-900/40 text-xs font-bold uppercase tracking-widest text-left">Transfer to any bank account</p>
        </div>

        <div className="space-y-5">
          {/* Recipient Name */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-primary-900/30 uppercase tracking-widest ml-2">Recipient Name</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-primary-100 rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-primary-900/30 uppercase tracking-widest ml-2">Account Number</label>
            <div className="relative group">
              <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input
                type="number"
                placeholder="12 digit account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                className="w-full bg-white border border-primary-100 rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* IFSC Code */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-primary-900/30 uppercase tracking-widest ml-2">IFSC Code</label>
            <div className="relative group">
              <Landmark className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="SBIN0001234"
                value={formData.ifsc}
                onChange={(e) => setFormData({...formData, ifsc: e.target.value.toUpperCase()})}
                className="w-full bg-white border border-primary-100 rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 transition-all uppercase"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-primary-900/30 uppercase tracking-widest ml-2">Amount</label>
            <div className="relative group">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary-600 text-2xl font-black">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-primary-50/50 border border-primary-100 rounded-[2.5rem] py-8 pl-16 pr-8 text-4xl font-black text-primary-900 focus:outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 bg-red-50 rounded-2xl border border-red-100"
            >
              <Info size={16} className="text-red-500" />
              <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
            </motion.div>
          )}
        </div>
      </div>

      <div className="space-y-6 mb-10">
        <div className="flex items-center justify-center gap-2 text-primary-900/30">
          <ShieldCheck size={14} />
          <span className="text-[8px] font-black uppercase tracking-widest">Secure IMPS Settlement</span>
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

export default BankTransferScreen;
