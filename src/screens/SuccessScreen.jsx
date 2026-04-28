import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Share2, Download, Home, ArrowLeft, ShieldCheck, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const SuccessScreen = () => {
  const { lastTransaction, navigateTo } = useApp();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!lastTransaction) navigateTo('home');
  }, [lastTransaction, navigateTo]);

  if (!lastTransaction) return null;

  const isBank = lastTransaction.type === 'BANK_TRANSFER';

  return (
    <div className="p-6 pt-12 flex flex-col items-center min-h-screen bg-premium-white relative overflow-hidden">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="absolute top-20 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] -z-10"
      />
      
      <div className="flex-1 w-full flex flex-col items-center justify-center space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
            <CheckCircle2 size={56} className="text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-primary-900">
            {isBank ? 'Transfer Successful' : t('payment_successful')}
          </h2>
          <p className="text-green-600 font-black text-[10px] uppercase tracking-widest">
            {isBank ? `Sent to ${lastTransaction.name}` : `${t('sent_to')} ${lastTransaction.receiver}`}
          </p>
        </div>

        {/* Digital Receipt */}
        <motion.div
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-xs glass rounded-[2.5rem] p-8 shadow-xl border border-primary-100 relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 blue-gradient rounded-full text-[8px] font-black uppercase tracking-widest text-white">
            {t('digital_receipt')}
          </div>
          
          <div className="space-y-6">
            <div className="text-center py-4">
              <span className="text-4xl font-black text-primary-900 italic">₹{lastTransaction.amount}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-dashed border-primary-100">
              {isBank && (
                <>
                  <DetailRow label="Recipient" value={lastTransaction.name} />
                  <DetailRow label="Account" value={`****${lastTransaction.accountNumber?.slice(-4)}`} />
                  <DetailRow label="IFSC" value={lastTransaction.ifsc} />
                </>
              )}
              {!isBank && <DetailRow label={t('to')} value={lastTransaction.receiver} />}
              <DetailRow label={t('date')} value={`${lastTransaction.date}, ${lastTransaction.time}`} />
              <DetailRow label="Txn ID" value={`JAN${lastTransaction.id.slice(0, 8).toUpperCase()}`} />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">Status</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase rounded-lg">Verified</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigateTo('home')}
        className="mb-12 w-full max-w-xs py-5 blue-gradient rounded-[2rem] flex items-center justify-center gap-3 font-black text-[12px] uppercase tracking-widest shadow-xl text-white"
      >
        <Home size={18} /> {t('back_to_home')}
      </motion.button>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center gap-4">
    <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest shrink-0">{label}</span>
    <span className="text-[11px] font-black text-primary-900 truncate">{value}</span>
  </div>
);

export default SuccessScreen;
