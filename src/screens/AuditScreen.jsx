import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Zap, Wifi, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const AuditScreen = () => {
  const { tokenActivities, navigateTo } = useApp();
  const { t } = useLanguage();

  const summary = {
    created: tokenActivities.filter(a => a.action === 'Created').reduce((sum, a) => sum + a.amount, 0),
    used: tokenActivities.filter(a => a.action === 'Used').reduce((sum, a) => sum + a.amount, 0),
    failed: tokenActivities.filter(a => a.status === 'Failed').length
  };

  return (
    <div className="flex flex-col h-screen bg-premium-white overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between glass sticky top-0 z-30 border-b border-primary-100">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateTo('home')}
          className="p-3 bg-primary-50 rounded-2xl text-primary-600"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </motion.button>
        <h2 className="text-xl font-black tracking-tight text-primary-900">Token Audit Trail</h2>
        <div className="w-12" />
      </div>

      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-3 gap-3">
        <SummaryCard label="Created" value={`₹${summary.created}`} color="text-blue-600" bg="bg-blue-50" />
        <SummaryCard label="Used" value={`₹${summary.used}`} color="text-green-600" bg="bg-green-50" />
        <SummaryCard label="Failed" value={summary.failed} color="text-red-600" bg="bg-red-50" />
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
        <div className="space-y-4">
          {tokenActivities.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-primary-50 rounded-[2.5rem] flex items-center justify-center text-primary-200">
                <ShieldCheck size={40} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">No token activity yet</p>
            </div>
          ) : (
            tokenActivities.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color, bg }) => (
  <div className={`${bg} p-4 rounded-3xl border border-primary-100/10 text-center space-y-1`}>
    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{label}</p>
    <p className={`text-sm font-black ${color}`}>{value}</p>
  </div>
);

const ActivityCard = ({ activity, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white p-5 rounded-[2rem] border border-primary-50 shadow-sm space-y-4"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          activity.action === 'Created' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
        }`}>
          {activity.action === 'Created' ? <Zap size={18} /> : <History size={18} />}
        </div>
        <div>
          <h4 className="text-sm font-black text-primary-900">{activity.action}</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activity.time} • {activity.mode}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-primary-900">₹{activity.amount}</p>
        <div className={`flex items-center justify-end gap-1 text-[8px] font-black uppercase tracking-widest ${
          activity.status === 'Success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {activity.status === 'Success' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
          {activity.status}
        </div>
      </div>
    </div>

    <div className="pt-3 border-t border-primary-50 grid grid-cols-2 gap-4">
      <div className="space-y-0.5">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Token ID</p>
        <p className="text-[10px] font-mono font-bold text-primary-900">{activity.tokenId.slice(0, 10)}***</p>
      </div>
      <div className="space-y-0.5 text-right">
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Remarks</p>
        <p className="text-[10px] font-bold text-primary-900 truncate">***{activity.remarks.slice(-8)}</p>
      </div>
    </div>
  </motion.div>
);

export default AuditScreen;
