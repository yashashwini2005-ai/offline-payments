import React, { useState, useEffect } from 'react';
import { Send, Download, ScanLine, Wallet, Wifi, WifiOff, ArrowUpRight, ArrowDownLeft, Coins, Plus, History, QrCode, Search, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

const HomeScreen = () => {
  const { balance, offlineBalance, offlineTokens, history, isOnline, navigateTo, convertToTokens } = useApp();
  const [showConvert, setShowConvert] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch for skeleton loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConvert = async () => {
    const val = parseFloat(amount);
    if (val > 0 && val <= balance) {
      const success = await convertToTokens(val);
      if (success) {
        setShowConvert(false);
        setAmount('');
      }
    }
  };

  const simulateQRScan = () => {
    setShowQR(true);
    setTimeout(() => {
      setShowQR(false);
      navigateTo('payment', { receiver: 'Retail_Merchant_01@upi', amount: 0 });
    }, 2000);
  };

  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="p-6 pt-12 space-y-8 pb-32 overflow-y-auto max-h-screen scrollbar-hide">
      {/* Premium Header */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Premium Account</p>
          <h1 className="text-2xl font-black tracking-tight font-display italic">JanPay</h1>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 glass rounded-2xl text-white/60"
          >
            <Bell size={18} />
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter border transition-all duration-700 ${
              isOnline 
                ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </motion.div>
        </div>
      </div>

      {/* Main Balance Card - Gold Build Version */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <GlassCard premium className="relative group p-8">
          <div className="absolute -top-12 -right-12 opacity-[0.05] group-hover:opacity-[0.12] transition-opacity duration-1000 rotate-12">
            <Wallet size={200} className="text-gold-500" />
          </div>
          
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-gold-500/60 uppercase tracking-widest">Main Balance</span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/20 to-transparent" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-gold-400 text-3xl font-black font-display italic">₹</span>
              <h2 className="text-5xl font-black tracking-tighter font-display">{balance.toLocaleString()}</h2>
            </div>
          </div>

          <div className="mt-10 flex justify-between items-end relative z-10">
            <div className="space-y-1">
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Offline Reserve</p>
              <div className="flex items-baseline gap-1">
                <span className="text-gold-300 text-sm font-bold">₹</span>
                <p className="text-2xl font-black text-gold-300/90 font-display italic">{offlineBalance}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConvert(true)}
              className="px-5 py-3 gold-gradient rounded-2xl text-[11px] uppercase font-black text-premium-dark flex items-center gap-2 border border-white/20"
            >
              <Plus size={16} strokeWidth={4} />
              Convert
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Grid Quick Actions */}
      <div className="grid grid-cols-3 gap-5">
        <ActionButton 
          delay={0.1}
          icon={<Send size={26} strokeWidth={2.5} />} 
          label="Transfer" 
          onClick={() => navigateTo('payment')} 
        />
        <ActionButton 
          delay={0.2}
          icon={<ArrowDownLeft size={26} strokeWidth={2.5} />} 
          label="Deposit" 
          onClick={() => {}} 
        />
        <ActionButton 
          delay={0.3}
          icon={<QrCode size={26} strokeWidth={2.5} />} 
          label="Scan QR" 
          onClick={simulateQRScan} 
        />
      </div>

      {/* Enhanced Tokens List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-5 pt-2"
      >
        <div className="flex justify-between items-end px-1">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white/50">Digital Assets</h3>
            <p className="text-[10px] text-gold-500/50 font-bold uppercase">Cryptographically Signed</p>
          </div>
          <span className="text-[10px] bg-gold-500/5 text-gold-400 px-3 py-1.5 rounded-full border border-gold-500/10 font-black uppercase tracking-tighter">
            {offlineTokens.length} Tokens
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
          {offlineTokens.length === 0 ? (
            <div className="w-full py-8 glass rounded-[2rem] border-dashed border-white/5 flex flex-col items-center gap-3 opacity-40">
              <Coins size={32} className="text-white/20" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Active Tokens</p>
            </div>
          ) : (
            offlineTokens.map((token, i) => (
              <TokenChip key={token.id} index={i} amount={token.amount} />
            ))
          )}
        </div>
      </motion.div>

      {/* Transaction History Section */}
      <div className="space-y-5 pt-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white/50">Activity Ledger</h3>
          <motion.button 
            whileHover={{ x: 3 }}
            className="text-[10px] font-black uppercase text-gold-500 flex items-center gap-1"
          >
            See All <Search size={12} strokeWidth={3} />
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-16 glass rounded-[2.5rem] border-dashed border-white/10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <History size={48} className="mx-auto text-white/10 mb-4" />
              </motion.div>
              <p className="text-white/20 text-xs font-black uppercase tracking-widest">System Clear</p>
            </div>
          ) : (
            history.map((tx, i) => (
              <TransactionItem key={tx.id} index={i} tx={tx} />
            ))
          )}
        </div>
      </div>

      {/* Modal & Overlays */}
      <AnimatePresence>
        {showConvert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConvert(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              className="relative w-full max-w-xs"
            >
              <GlassCard premium className="p-10 border-gold-500/30 shadow-[0_0_100px_rgba(212,175,55,0.15)]">
                <div className="absolute top-0 left-0 w-full h-1.5 gold-gradient" />
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-16 h-16 rounded-3xl gold-gradient flex items-center justify-center text-premium-dark mb-4 shadow-xl">
                    <Coins size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter">MINT TOKENS</h3>
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Convert digital fiat</p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-500 text-xl font-black">₹</span>
                    <input
                      autoFocus
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="000"
                      className="w-full bg-white/5 border-2 border-white/5 rounded-[2rem] py-6 px-12 text-4xl font-black text-center focus:outline-none focus:border-gold-500 focus:bg-gold-500/5 transition-all font-display italic"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConvert}
                    className="w-full py-5 gold-gradient rounded-[2rem] text-premium-dark font-black tracking-widest shadow-2xl shadow-gold-500/30 text-lg border-b-4 border-black/20"
                  >
                    CONFIRM
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-72 h-72 mb-16">
              <div className="absolute inset-0 border-[6px] border-gold-500/20 rounded-[3rem]" />
              <div className="absolute inset-[-4px] border-2 border-gold-500/40 rounded-[3.2rem]" />
              
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 w-full h-1.5 bg-gold-400 shadow-[0_0_30px_rgba(212,175,55,1)] z-10 rounded-full" 
              />
              
              <div className="absolute inset-8 flex items-center justify-center opacity-[0.05] filter blur-[1px]">
                <QrCode size={180} className="text-gold-500" />
              </div>

              {/* Corners */}
              <div className="absolute -top-1 -left-1 w-12 h-12 border-t-8 border-l-8 border-gold-500 rounded-tl-[3rem]" />
              <div className="absolute -top-1 -right-1 w-12 h-12 border-t-8 border-r-8 border-gold-500 rounded-tr-[3rem]" />
              <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-8 border-l-8 border-gold-500 rounded-bl-[3rem]" />
              <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-8 border-r-8 border-gold-500 rounded-br-[3rem]" />
            </div>

            <motion.h2 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-3xl font-black tracking-tighter mb-3 italic"
            >
              SCANNING...
            </motion.h2>
            <p className="text-gold-500/60 text-xs font-black uppercase tracking-[0.3em]">Encrypted Handshake</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HomeSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 pt-12 space-y-8"
  >
    <div className="flex justify-between">
      <div className="space-y-2">
        <div className="w-24 h-3 skeleton rounded-full" />
        <div className="w-32 h-6 skeleton rounded-xl" />
      </div>
      <div className="w-12 h-12 skeleton rounded-2xl" />
    </div>
    <div className="w-full h-56 skeleton rounded-[2.5rem]" />
    <div className="grid grid-cols-3 gap-5">
      {[1, 2, 3].map(i => <div key={i} className="h-28 skeleton rounded-[2rem]" />)}
    </div>
    <div className="space-y-4">
      <div className="w-40 h-4 skeleton rounded-full" />
      <div className="flex gap-4">
        {[1, 2, 3].map(i => <div key={i} className="w-28 h-16 skeleton rounded-2xl flex-shrink-0" />)}
      </div>
    </div>
  </motion.div>
);

const ActionButton = ({ icon, label, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.06)', scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-4 p-6 glass rounded-[2.5rem] group transition-all duration-500 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gold-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="text-gold-400 group-hover:text-gold-200 group-hover:scale-110 transition-all duration-500 relative z-10">
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white relative z-10">{label}</span>
  </motion.button>
);

const TokenChip = ({ amount, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index + 0.5 }}
    whileHover={{ scale: 1.05, borderLeftColor: 'rgba(212, 175, 55, 1)' }}
    className="flex-shrink-0 px-6 py-5 glass rounded-[1.8rem] border-l-4 border-l-gold-500/30 flex flex-col gap-1 min-w-[140px] relative overflow-hidden group btn-premium"
  >
    <div className="absolute top-0 right-0 w-8 h-8 bg-gold-500/[0.05] rounded-bl-[1.5rem] flex items-center justify-center">
      <Coins size={12} className="text-gold-500/40" />
    </div>
    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.1em]">Asset Value</span>
    <span className="text-2xl font-black text-gold-400 font-display italic tracking-tighter">₹{amount}</span>
  </motion.div>
);

const TransactionItem = ({ tx, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index + 0.6 }}
    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.04)' }}
    className="flex items-center justify-between p-5 glass rounded-[2.2rem] border border-white/[0.03] group transition-all duration-300"
  >
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-lg ${
        tx?.status === 'Pending' 
          ? 'bg-white/5 text-white/10' 
          : (tx?.receiver?.includes('@') ? 'bg-gold-500/10 text-gold-400 group-hover:bg-gold-500/20' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20')
      }`}>
        {tx?.receiver?.includes('@') ? <QrCode size={24} /> : <User size={24} />}
      </div>
      <div className="space-y-1">
        <p className="font-black text-[15px] tracking-tight group-hover:text-gold-400 transition-colors">{tx?.receiver || 'Unknown'}</p>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{tx?.date} • {tx?.time}</span>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all duration-700 ${
            tx?.status === 'Pending' 
              ? 'bg-white/5 text-white/30 animate-pulse' 
              : (tx?.type === 'Online' ? 'bg-green-500/10 text-green-500' : 'bg-gold-500/10 text-gold-400')
          }`}>
            <div className={`w-1 h-1 rounded-full ${tx?.status === 'Pending' ? 'bg-white/20' : (tx?.type === 'Online' ? 'bg-green-500' : 'bg-gold-500')}`} />
            {tx?.status === 'Pending' ? 'SYNCING' : (tx?.type || 'Online')}
          </div>
        </div>
      </div>
    </div>
    <div className="text-right">
      <span className={`text-xl font-black font-display italic tracking-tighter transition-colors duration-700 ${tx?.status === 'Pending' ? 'text-white/10' : 'text-white'}`}>
        -₹{tx?.amount || 0}
      </span>
    </div>
  </motion.div>
);

export default HomeScreen;
