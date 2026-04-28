import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Share2, Download, Home, ArrowLeft, ShieldCheck, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const SuccessScreen = () => {
  const { lastTransaction, navigateTo } = useApp();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!lastTransaction) {
      navigateTo('home');
    }
  }, [lastTransaction, navigateTo]);

  if (!lastTransaction) return null;

  return (
    <div className="p-6 pt-12 flex flex-col items-center min-h-screen bg-premium-white relative overflow-hidden">
      {/* Success Animation Background */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-20 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] -z-10"
      />
      
      <div className="flex-1 w-full flex flex-col items-center justify-center space-y-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="relative"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <CheckCircle2 size={56} className="text-white" strokeWidth={2.5} />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-green-500 rounded-full -z-10"
          />
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-primary-900">{t('payment_successful')}</h2>
          <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-[0.2em]">{t('transaction_id')}: {lastTransaction.id.split('-')[0]}</p>
        </div>

        {/* Merchant Notification Simulation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-xs bg-primary-50 rounded-[2.5rem] p-6 border border-primary-100 relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-left space-y-1">
              <p className="text-[10px] font-black text-primary-900/40 uppercase tracking-widest">{t('merchant_alert')}</p>
              <p className="text-[13px] font-bold text-primary-900 leading-relaxed">
                {t('merchant_received', { amount: lastTransaction?.amount })}
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-3">
            <div className="flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1 rounded-lg">
              <ShieldCheck size={10} className="text-blue-500" />
              <span className="text-[6px] font-black uppercase text-blue-500 tracking-tighter">Verified</span>
            </div>
          </div>
        </motion.div>

        {/* Digital Receipt */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-xs glass rounded-[2.5rem] p-8 shadow-xl border border-primary-100 relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 blue-gradient rounded-full text-[8px] font-black uppercase tracking-widest">
            {t('digital_receipt')}
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">{t('to')}</span>
              <span className="text-sm font-black text-primary-900">{lastTransaction.receiver}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">{t('date')}</span>
              <span className="text-sm font-black text-primary-900">{lastTransaction.date} • {lastTransaction.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">{t('mode')}</span>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${lastTransaction.type === 'Online' ? 'bg-green-50 text-green-600' : 'bg-primary-50 text-primary-600'}`}>
                {lastTransaction.type === 'Online' ? t('online') : t('offline')}
              </span>
            </div>
            
            <div className="pt-6 border-t border-dashed border-primary-100 flex flex-col items-center">
              <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest mb-1">{t('amount_paid')}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-primary-600 text-xl font-black italic">₹</span>
                <span className="text-4xl font-black tracking-tighter text-primary-900">{lastTransaction.amount}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4 w-full max-w-xs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-4 glass rounded-2xl flex items-center justify-center gap-2 text-primary-600 font-black text-[10px] uppercase border border-primary-100"
          >
            <Share2 size={16} /> {t('send')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-4 glass rounded-2xl flex items-center justify-center gap-2 text-primary-600 font-black text-[10px] uppercase border border-primary-100"
          >
            <Download size={16} /> {t('request')}
          </motion.button>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigateTo('home')}
        className="mb-12 w-full max-w-xs py-5 blue-gradient rounded-[2rem] flex items-center justify-center gap-3 font-black text-[12px] uppercase tracking-widest shadow-xl shadow-primary-500/20"
      >
        <Home size={18} /> {t('back_to_home')}
      </motion.button>
    </div>
  );
};

export default SuccessScreen;
