import React, { useState, useEffect } from 'react';
import { 
  Send, Download, ScanLine, Wallet, Wifi, WifiOff, ArrowUpRight, ArrowDownLeft, 
  Coins, Plus, History, QrCode, Search, Bell, User, AlertTriangle, RefreshCw, 
  ShieldAlert, CreditCard, ChevronRight, Info, ShieldCheck, Lock, Landmark, Sparkles, Zap, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const HomeScreen = () => {
  const { 
    balance, offlineBalance, offlineTokens, history, networkState, 
    tamperDetected, navigateTo, requestPreload, user 
  } = useApp();
  const { t } = useLanguage();
  const [showConvert, setShowConvert] = useState(false);
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
      setError('Enter valid amount');
      return;
    }
    if (offlineBalance + val > 1000) {
      setError('Limit: ₹1,000 max');
      return;
    }

    setError('');
    requestPreload(val);
    setShowConvert(false);
    setAmount('');
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
          <div className="w-10 h-10 rounded-full blue-gradient p-0.5 shadow-md group-hover:scale-110 transition-transform text-primary-600">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-widest">{t('account_holder')}</p>
            <h1 className="text-xl font-black tracking-tight text-primary-900 group-hover:text-primary-600 transition-colors">{user.name}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <NetworkBadge state={networkState} t={t} />
        </div>
      </div>

      {/* Top Grid Actions */}
      <div className="grid grid-cols-2 gap-4">
        <TopAction 
          icon={<Send size={24} />} 
          label={t('send')} 
          onClick={() => navigateTo('payment')} 
          color="bg-blue-50 text-blue-600"
        />
        <TopAction 
          icon={<Landmark size={24} />} 
          label="To Bank" 
          onClick={() => navigateTo('bankTransfer')} 
          color="bg-purple-50 text-purple-600"
        />
        <TopAction 
          icon={<Zap size={24} />} 
          label="Check Offline" 
          onClick={() => navigateTo('pin', { isBalanceCheck: true, balanceType: 'offline' })} 
          color="bg-orange-50 text-orange-600"
        />
        <TopAction 
          icon={<Wallet size={24} />} 
          label="Online Balance" 
          onClick={() => navigateTo('pin', { isBalanceCheck: true, balanceType: 'online' })} 
          color="bg-green-50 text-green-600"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-primary-100 rounded-[2.5rem] p-8 shadow-xl shadow-primary-900/5 space-y-6 relative overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                <Zap size={10} className="text-orange-500 fill-orange-500" />
                <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Reserve Capacity</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[7px] font-black text-primary-900/30 uppercase tracking-widest">Live Secure Sync</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-primary-900 italic">{Math.round((offlineBalance / 1000) * 100)}%</h2>
              <span className="text-[10px] font-black text-primary-900/30 uppercase tracking-widest">Utilization</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConvert(true)}
            className="px-5 py-3 blue-gradient rounded-2xl flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-500/20"
          >
            <Plus size={14} strokeWidth={4} />
            Load Tokens
          </motion.button>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary-900/40">
            <span>Utilization: {Math.round((offlineBalance / 1000) * 100)}%</span>
            <span>Limit: ₹1,000</span>
          </div>
          <div className="h-2 w-full bg-primary-50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(offlineBalance / 1000) * 100}%` }}
              className="h-full bg-orange-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Pay Merchants (From Photo) */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black text-primary-900">Quick Pay Merchants</h3>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo('search')}
            className="text-[10px] font-black uppercase text-primary-600 tracking-widest"
          >
            See All
          </motion.button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <MerchantIcon icon="☕" name="Cafe Coffee" onClick={() => navigateTo('payment', { receiver: 'Cafe Coffee', vpa: 'cafe@upi' })} />
          <MerchantIcon icon="💊" name="Pharma Plus" onClick={() => navigateTo('payment', { receiver: 'Pharma Plus', vpa: 'pharma@upi' })} />
          <MerchantIcon icon="🛒" name="Big Bazaar" onClick={() => navigateTo('payment', { receiver: 'Big Bazaar', vpa: 'bigbazaar@upi' })} />
          <MerchantIcon icon="⛽" name="Shell" onClick={() => navigateTo('payment', { receiver: 'Shell', vpa: 'shell@upi' })} />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigateTo('audit')}
        className="w-full py-5 glass border border-primary-100 rounded-3xl flex items-center justify-between px-6 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shadow-blue-500/10">
            <Bot size={24} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Token Audit Trail</p>
              <span className="text-[7px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">(Offline Only)</span>
            </div>
            <p className="text-[8px] text-primary-900/30 font-bold uppercase tracking-widest">Verify Offline Signatures</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-primary-200 group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Conversion Modal */}
      <AnimatePresence>
        {showConvert && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowConvert(false); setError(''); }}
              className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] p-10 pb-16 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-primary-100 rounded-full mx-auto mb-8" />
              <div className="text-center mb-10 space-y-2">
                <h3 className="text-2xl font-black text-primary-900">Authorize Reserve</h3>
                <p className="text-[10px] text-primary-900/40 uppercase font-black tracking-widest">Bank Signed Token Minting</p>
              </div>
              <div className="space-y-8">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 text-2xl font-black">₹</span>
                  <input
                    autoFocus type="number" value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError(''); }}
                    placeholder="0.00"
                    className="w-full bg-primary-50 border border-primary-100 rounded-[2rem] py-8 px-12 text-5xl font-black text-center focus:outline-none focus:border-primary-500 text-primary-900"
                  />
                </div>
                {error && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConvert}
                  className="w-full py-6 blue-gradient rounded-[2rem] text-white font-black tracking-widest shadow-xl text-lg uppercase"
                >
                  Confirm & Authorize
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TopAction = ({ icon, label, onClick, color }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-6 rounded-[2.5rem] flex flex-col items-center gap-3 border border-transparent hover:border-primary-100 transition-all ${color}`}
  >
    <div className="shrink-0">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </motion.button>
);

const MerchantIcon = ({ icon, name, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3"
  >
    <div className="w-16 h-16 bg-white border border-primary-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
      {icon}
    </div>
    <span className="text-[8px] font-black uppercase text-primary-900/40 text-center tracking-tighter leading-tight">{name}</span>
  </motion.button>
);

const NetworkBadge = ({ state, t }) => {
  const configs = {
    ONLINE: { color: 'text-green-600', bg: 'bg-green-50', icon: <Wifi size={14} />, label: t('online') },
    OFFLINE: { color: 'text-red-600', bg: 'bg-red-50', icon: <WifiOff size={14} />, label: t('offline') },
    UNSTABLE: { color: 'text-orange-600', bg: 'bg-orange-50', icon: <AlertTriangle size={14} />, label: t('unstable') },
    SYNCING: { color: 'text-primary-600', bg: 'bg-primary-50', icon: <RefreshCw size={14} className="animate-spin" />, label: t('syncing') },
    RECONNECTED: { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Wifi size={14} />, label: t('restored') }
  };
  const config = configs[state] || configs.ONLINE;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight border ${config.bg} ${config.color} border-current/10 shadow-sm`}>
      {config.icon} {config.label}
    </div>
  );
};

const TamperScreen = () => (
  <div className="fixed inset-0 z-[1000] bg-red-600 flex flex-col items-center justify-center p-10 text-center">
    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-red-600 mb-8 shadow-2xl"><ShieldAlert size={48} /></div>
    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter italic">SECURITY_BREACH</h2>
    <p className="text-white text-xs font-bold uppercase tracking-widest">Tampering detected. Access locked.</p>
  </div>
);

const HomeSkeleton = () => (
  <div className="p-6 pt-12 space-y-8 bg-premium-white">
    <div className="flex justify-between items-center"><div className="w-32 h-6 skeleton rounded-full" /><div className="w-10 h-10 skeleton rounded-full" /></div>
    <div className="grid grid-cols-2 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-32 skeleton rounded-[2.5rem]" />)}</div>
    <div className="w-full h-56 skeleton rounded-[2.5rem]" />
  </div>
);

export default HomeScreen;
