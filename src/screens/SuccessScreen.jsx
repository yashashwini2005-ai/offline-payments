import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Share2, Download, Home, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

const SuccessScreen = () => {
  const { lastTransaction, navigateTo } = useApp();

  React.useEffect(() => {
    if (!lastTransaction) {
      navigateTo('home');
    }
  }, [lastTransaction, navigateTo]);

  if (!lastTransaction) return null;

  return (
    <div className="p-6 pt-12 flex flex-col items-center h-screen bg-premium-dark relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full -mt-40" 
      />
      
      <motion.div
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="relative z-10 w-28 h-28 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-premium-dark mb-10 shadow-[0_25px_60px_rgba(34,197,94,0.4)] group"
      >
        <CheckCircle2 size={64} strokeWidth={3} className="group-hover:scale-110 transition-transform duration-500" />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-400 rounded-[2.5rem]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap size={14} className="text-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em]">Transaction Verified</span>
        </div>
        <h2 className="text-4xl font-black mb-2 tracking-tighter italic font-display">PAYMENT SUCCESS</h2>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 glass rounded-full inline-block border-white/5">
          NODE_ID: {lastTransaction.id.split('-')[0].toUpperCase()} • {lastTransaction.type.toUpperCase()}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full relative z-10"
      >
        <GlassCard premium className="w-full space-y-8 mb-12 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] relative group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500 opacity-50" />
          
          <div className="flex flex-col items-center py-6 border-b border-white/5 bg-white/[0.02]">
            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Settlement Value</span>
            <div className="flex items-baseline gap-1">
              <span className="text-gold-500 text-2xl font-black italic">₹</span>
              <span className="text-6xl font-black text-white font-display tracking-tighter italic group-hover:scale-105 transition-transform duration-700">{lastTransaction.amount}</span>
            </div>
          </div>

          <div className="space-y-5 pt-2 px-2 pb-2">
            <ReceiptRow label="Recipient Entity" value={lastTransaction.receiver} icon={<ArrowRight size={12} className="text-white/20" />} />
            <ReceiptRow label="Auth Status" value="AUTHENTICATED" highlight="text-green-500" icon={<ShieldCheck size={12} className="text-green-500/50" />} />
            <ReceiptRow label="Settlement Mode" value={lastTransaction.type} highlight="text-gold-400" />
            <ReceiptRow label="Time Genesis" value={`${lastTransaction.date} @ ${lastTransaction.time}`} />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full space-y-4 mt-auto pb-10 relative z-10"
      >
        <div className="grid grid-cols-2 gap-5">
          <ActionButton icon={<Share2 size={20} />} label="Voucher" />
          <ActionButton icon={<Download size={20} />} label="Manifest" />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigateTo('home')}
          className="w-full py-6 gold-gradient rounded-[2.5rem] text-premium-dark font-black tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl border-b-4 border-black/20 text-lg"
        >
          DISMISS
          <ArrowRight size={24} strokeWidth={3} />
        </motion.button>
      </motion.div>
    </div>
  );
};

const ReceiptRow = ({ label, value, highlight = "text-white/80", icon }) => (
  <div className="flex justify-between items-center group/row">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-[11px] font-black tracking-tight uppercase ${highlight} group-hover/row:text-white transition-colors`}>{value}</span>
  </div>
);

const ActionButton = ({ icon, label }) => (
  <motion.button 
    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center gap-3 py-5 glass rounded-[2rem] text-white/40 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] border border-white/5 shadow-xl"
  >
    {icon}
    {label}
  </motion.button>
);

export default SuccessScreen;
