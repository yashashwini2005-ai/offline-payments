import React, { useState, useEffect } from 'react';
import { Send, Download, ScanLine, Wallet, Wifi, WifiOff, ArrowUpRight, ArrowDownLeft, Coins, Plus, History, QrCode, Search, Bell, User, AlertTriangle, RefreshCw, ShieldAlert, CreditCard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const HomeScreen = () => {
  const { balance, offlineBalance, history, networkState, tamperDetected, navigateTo, requestPreload, user } = useApp();
  const [showConvert, setShowConvert] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConvert = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (val > balance) {
      setError('Insufficient wallet balance');
      return;
    }
    if (offlineBalance + val > 1000) {
      setError('Offline limit: ₹1,000 max');
      return;
    }

    setError('');
    requestPreload(val);
    setShowConvert(false);
    setAmount('');
  };

  const simulateQRScan = () => {
    setShowQR(true);
    setTimeout(() => {
      setShowQR(false);
      navigateTo('payment', { receiver: 'Retail_Merchant_01@upi', amount: 0 });
    }, 2000);
  };

  if (tamperDetected) return <TamperScreen />;
  if (isLoading) return <HomeSkeleton />;

  return (
    <div className="p-6 pt-12 space-y-8 pb-32 overflow-y-auto max-h-screen scrollbar-hide bg-premium-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigateTo('profile')}
        >
          <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shadow-md group-hover:scale-110 transition-transform">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-primary-900/40 text-[10px] font-bold uppercase tracking-widest">Account Holder</p>
            <h1 className="text-xl font-black tracking-tight text-primary-900 group-hover:text-primary-600 transition-colors">{user.name}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div whileTap={{ scale: 0.9 }} className="p-2.5 glass rounded-xl relative">
            <Bell size={20} className="text-primary-600" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white" />
          </motion.div>
          <NetworkBadge state={networkState} />
        </div>
      </div>

      {/* Wallet Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="relative group overflow-hidden rounded-[2.5rem] blue-gradient p-8 shadow-2xl shadow-primary-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard size={140} />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Total Balance</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white/80 text-2xl font-black">₹</span>
                  <h2 className="text-4xl font-black tracking-tighter text-white">{balance.toLocaleString()}</h2>
                </div>
              </div>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30">
                <Wallet size={28} />
              </div>
            </div>

            <div className="h-px bg-white/20" />

            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">Offline Reserve</span>
                  <div className={`w-2 h-2 rounded-full ${offlineBalance >= 1000 ? 'bg-orange-400' : 'bg-white'} animate-pulse`} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-white/80 text-lg font-bold">₹</span>
                  <p className="text-2xl font-black text-white italic">{offlineBalance}</p>
                  <span className="text-[10px] text-white/40 font-bold ml-1">/ 1,000</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConvert(true)}
                className="px-6 py-3 bg-white text-primary-700 rounded-2xl text-[10px] uppercase font-black shadow-lg shadow-black/5 flex items-center gap-2"
              >
                <Plus size={14} strokeWidth={4} />
                Load Reserve
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <QuickAction icon={<Send size={22} />} label="Send" onClick={() => navigateTo('payment')} />
        <QuickAction icon={<Download size={22} />} label="Request" />
        <QuickAction icon={<ScanLine size={22} />} label="Scan" onClick={simulateQRScan} />
        <QuickAction icon={<History size={22} />} label="History" />
      </div>

      {/* Transaction History */}
      <div className="space-y-5 pt-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-primary-900/40">Transaction History</h3>
          <motion.button 
            whileHover={{ x: 2 }}
            className="text-[10px] font-black uppercase text-primary-600 flex items-center gap-1 group"
          >
            See All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
        
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 glass rounded-[2.5rem] border-dashed border-primary-900/10">
              <p className="text-primary-900/20 text-[10px] font-black uppercase tracking-widest">No Recent Activity</p>
            </div>
          ) : (
            history.slice().reverse().map((tx, i) => (
              <TransactionItem key={tx.id} index={i} tx={tx} />
            ))
          )}
        </div>
      </div>

      {/* Conversion Modal */}
      <AnimatePresence>
        {showConvert && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowConvert(false); setError(''); }}
              className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] p-10 pb-16 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-primary-100 rounded-full mx-auto mb-8" />
              
              <div className="text-center mb-10 space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-primary-900">Load Offline Reserve</h3>
                <p className="text-[10px] text-primary-900/40 uppercase font-black tracking-[0.2em]">Bank Authorized Token Minting</p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 text-2xl font-black">₹</span>
                    <input
                      autoFocus
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(''); }}
                      placeholder="0.00"
                      className="w-full bg-primary-50 border border-primary-100 rounded-[2rem] py-8 px-12 text-5xl font-black text-center focus:outline-none focus:border-primary-500 transition-all text-primary-900"
                    />
                  </div>
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex justify-between px-6 py-4 glass-dark rounded-2xl">
                    <div className="text-left">
                      <p className="text-[8px] text-primary-900/30 font-black uppercase">Online Wallet</p>
                      <p className="text-xs font-black text-primary-900/60">₹{balance.toLocaleString()}.00</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-primary-900/30 font-black uppercase">Reserve Capacity</p>
                      <p className="text-xs font-black text-primary-600">₹{(1000 - offlineBalance).toLocaleString()}.00</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConvert}
                  className="w-full py-6 blue-gradient rounded-[2rem] text-white font-black tracking-widest shadow-xl shadow-primary-500/30 text-lg uppercase"
                >
                  Confirm & Authorize
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQR && <ScannerOverlay />}
      </AnimatePresence>
    </div>
  );
};

const QuickAction = ({ icon, label, onClick }) => (
  <motion.button
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3"
  >
    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all border border-primary-900/5">
      {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-primary-900/30">{label}</span>
  </motion.button>
);

const TransactionItem = ({ tx, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-center justify-between p-4 bg-white hover:bg-primary-50/50 rounded-[1.8rem] border border-primary-900/5 transition-all group shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
        tx?.status === 'Pending' 
          ? 'bg-primary-50 text-primary-300' 
          : 'bg-primary-100 text-primary-600'
      }`}>
        {tx?.receiver?.includes('@') ? <QrCode size={20} /> : <User size={20} />}
      </div>
      <div className="space-y-0.5">
        <p className="font-bold text-[14px] tracking-tight text-primary-900 group-hover:text-primary-600 transition-colors">{tx?.receiver || 'Merchant Payment'}</p>
        <p className="text-[9px] font-bold text-primary-900/20 uppercase tracking-widest">{tx?.date} • {tx?.time}</p>
      </div>
    </div>
    <div className="text-right flex flex-col items-end gap-1">
      <span className={`text-lg font-black tracking-tighter ${tx?.status === 'Pending' ? 'text-primary-900/20' : 'text-primary-900'}`}>
        -₹{tx?.amount || 0}
      </span>
      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest ${
        tx?.status === 'Pending' ? 'bg-primary-50 text-primary-300' : 'bg-primary-50 text-primary-600'
      }`}>
        {tx?.status === 'Pending' ? 'SYNCING' : (tx?.type || 'Online')}
      </div>
    </div>
  </motion.div>
);

const ScannerOverlay = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-primary-900/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
  >
    <div className="relative w-64 h-64 mb-16">
      <div className="absolute inset-0 border-2 border-white/10 rounded-[3rem]" />
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute left-0 w-full h-0.5 bg-primary-400 shadow-[0_0_20px_rgba(96,165,250,1)] z-10" 
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <QrCode size={180} className="text-white" />
      </div>
      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary-400 rounded-tl-3xl" />
      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary-400 rounded-tr-3xl" />
      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary-400 rounded-bl-3xl" />
      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary-400 rounded-br-3xl" />
    </div>
    <h2 className="text-2xl font-black tracking-tight mb-2 text-white italic">Scanning QR Code</h2>
    <p className="text-primary-400/60 text-[9px] font-black uppercase tracking-[0.3em]">Position QR within frame</p>
  </motion.div>
);

const NetworkBadge = ({ state }) => {
  const configs = {
    ONLINE: { color: 'text-green-600', bg: 'bg-green-50', icon: <Wifi size={14} />, label: 'Online' },
    OFFLINE: { color: 'text-red-600', bg: 'bg-red-50', icon: <WifiOff size={14} />, label: 'Offline' },
    UNSTABLE: { color: 'text-orange-600', bg: 'bg-orange-50', icon: <AlertTriangle size={14} />, label: 'Unstable' },
    SYNCING: { color: 'text-primary-600', bg: 'bg-primary-50', icon: <RefreshCw size={14} className="animate-spin" />, label: 'Syncing' },
    RECONNECTED: { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Wifi size={14} />, label: 'Restored' }
  };
  const config = configs[state] || configs.ONLINE;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight border ${config.bg} ${config.color} border-current/10 shadow-sm transition-all duration-700`}>
      {config.icon}
      {config.label}
    </div>
  );
};

const TamperScreen = () => (
  <div className="fixed inset-0 z-[1000] bg-red-600 flex flex-col items-center justify-center p-10 text-center">
    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-red-600 mb-8 shadow-2xl">
      <ShieldAlert size={48} />
    </div>
    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter italic">SECURITY_BREACH</h2>
    <p className="text-white text-xs font-bold uppercase tracking-widest">
      Tampering detected. Access locked.
    </p>
  </div>
);

const HomeSkeleton = () => (
  <div className="p-6 pt-12 space-y-8 bg-premium-white">
    <div className="flex justify-between items-center">
      <div className="w-32 h-6 skeleton rounded-full" />
      <div className="w-10 h-10 skeleton rounded-full" />
    </div>
    <div className="w-full h-56 skeleton rounded-[2.5rem]" />
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-20 skeleton rounded-2xl" />)}
    </div>
    <div className="w-full h-80 skeleton rounded-[2.5rem]" />
  </div>
);

export default HomeScreen;
