import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, History, Search, Download, ShieldCheck, 
  Wifi, Zap, Clock, CheckCircle2, AlertCircle, Landmark, 
  QrCode, User, CreditCard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const HistoryScreen = () => {
  const { history, navigateTo } = useApp();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  // Enhanced Filtering Logic
  const filteredHistory = useMemo(() => {
    return history.filter(tx => {
      const search = searchTerm.toLowerCase();
      return (
        tx.receiver?.toLowerCase().includes(search) ||
        tx.name?.toLowerCase().includes(search) ||
        tx.amount?.toString().includes(search) ||
        tx.id?.toLowerCase().includes(search)
      );
    }).slice().reverse();
  }, [history, searchTerm]);

  // Segregated Lists
  const pending = filteredHistory.filter(tx => tx.status === 'Pending');
  const completed = filteredHistory.filter(tx => tx.status === 'Success' || tx.status === 'Completed');
  const failed = filteredHistory.filter(tx => tx.status === 'Failed');

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
        <h2 className="text-xl font-black tracking-tight text-primary-900">Transaction History</h2>
        <motion.button whileTap={{ scale: 0.9 }} className="p-3 bg-primary-50 rounded-2xl text-primary-600">
          <Download size={20} />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Search Bar */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, amount, or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-primary-50 border border-primary-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-4 grid grid-cols-3 gap-3">
          <SummaryCard count={pending.length} label="Pending" color="bg-yellow-50 text-yellow-600" border="border-yellow-100" />
          <SummaryCard count={completed.length} label="Completed" color="bg-green-50 text-green-600" border="border-green-100" />
          <SummaryCard count={failed.length} label="Failed" color="bg-red-50 text-red-600" border="border-red-100" />
        </div>

        {/* Sections */}
        <div className="px-6 pb-32 space-y-8 mt-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-primary-50 rounded-[2.5rem] flex items-center justify-center text-primary-200">
                <History size={40} />
              </div>
              <p className="text-primary-900/20 text-[10px] font-black uppercase tracking-widest italic">No transactions yet</p>
            </div>
          ) : (
            <>
              <Section title="Pending Transactions" items={pending} t={t} onSelectTx={setSelectedTx} />
              <Section title="Completed Transactions" items={completed} t={t} onSelectTx={setSelectedTx} />
              <Section title="Failed Transactions" items={failed} t={t} onSelectTx={setSelectedTx} />
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedTx && (
          <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} t={t} />
        )}
      </AnimatePresence>
    </div>
  );
};

const SummaryCard = ({ count, label, color, border }) => (
  <div className={`${color} ${border} border p-4 rounded-3xl text-center space-y-0.5 shadow-sm`}>
    <p className="text-lg font-black">{count}</p>
    <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{label}</p>
  </div>
);

const Section = ({ title, items, t, onSelectTx }) => {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 ml-2">{title}</h3>
      <div className="space-y-3">
        {items.map((tx, i) => (
          <TransactionCard key={tx.id} tx={tx} index={i} t={t} onClick={() => onSelectTx(tx)} />
        ))}
      </div>
    </div>
  );
};

const TransactionCard = ({ tx, index, t, onClick }) => {
  const isBank = tx.type === 'BANK_TRANSFER';
  const isPending = tx.status === 'Pending';
  const isFailed = tx.status === 'Failed';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white p-4 rounded-[2rem] border border-primary-50 shadow-sm flex items-center justify-between group hover:border-primary-200 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          isBank ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {isBank ? <Landmark size={20} /> : tx.receiver?.includes('@') ? <QrCode size={20} /> : <User size={20} />}
        </div>
        <div className="text-left space-y-0.5">
          <p className="text-xs font-black text-primary-900 group-hover:text-primary-600 transition-colors">
            {isBank ? tx.name : (tx.receiver || 'Self Transfer')}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{tx.date} • {tx.time}</p>
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-tighter ${
              tx.mode === 'Offline' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
            }`}>
              {tx.mode === 'Offline' ? <Zap size={8} /> : <Wifi size={8} />} {tx.mode || (tx.type === 'Offline' ? 'Offline' : 'Online')}
            </div>
          </div>
        </div>
      </div>

      <div className="text-right space-y-1">
        <p className={`text-sm font-black ${isFailed ? 'text-red-500' : 'text-primary-900'}`}>₹{tx.amount}</p>
        <div className={`flex items-center justify-end gap-1 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest ${
          isPending ? 'bg-yellow-50 text-yellow-600 animate-pulse' : 
          isFailed ? 'bg-red-50 text-red-600' : 
          'bg-green-50 text-green-600'
        }`}>
          {isPending ? <Clock size={8} /> : isFailed ? <AlertCircle size={8} /> : <CheckCircle2 size={8} />}
          {isPending ? 'Pending' : isFailed ? 'Failed' : 'Success'}
        </div>
      </div>
    </motion.div>
  );
};

const TransactionDetailModal = ({ tx, onClose, t }) => {
  const isBank = tx.type === 'BANK_TRANSFER';
  const isOffline = tx.mode === 'Offline' || tx.type === 'Offline';
  const isPending = tx.status === 'Pending';
  const isFailed = tx.status === 'Failed';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary-900/60 backdrop-blur-md" 
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        className="relative w-full max-w-md bg-white rounded-[3rem] p-8 shadow-2xl flex flex-col items-center max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <div className="w-12 h-1.5 bg-primary-100 rounded-full mb-8 shrink-0" />

        {/* Status Header */}
        <div className="flex flex-col items-center mb-8 relative w-full">
          {isOffline && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm border border-orange-200">
              <Zap size={12} fill="currentColor" /> OFFLINE
            </div>
          )}
          
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg mb-4 ${
            isPending ? 'bg-yellow-50 text-yellow-600' :
            isFailed ? 'bg-red-50 text-red-600' :
            'bg-green-50 text-green-600'
          }`}>
            {isPending ? <Clock size={36} /> : 
             isFailed ? <AlertCircle size={36} /> : 
             <CheckCircle2 size={36} />}
          </div>
          
          <h2 className={`text-4xl font-black italic tracking-tight mb-2 ${
            isFailed ? 'text-red-500' : 'text-green-600'
          }`}>₹{tx.amount}</h2>
          
          <h3 className={`text-sm font-black uppercase tracking-widest ${
            isPending ? 'text-yellow-600' :
            isFailed ? 'text-red-600' :
            'text-green-600'
          }`}>
            {isBank ? 'Transfer' : 'Payment'} {tx.status}
          </h3>
        </div>

        {/* Details Card */}
        <div className="w-full glass rounded-[2rem] p-6 border border-primary-50 space-y-4 mb-6">
          <DetailRow icon={<User size={14} />} label="Recipient" value={isBank ? tx.name : (tx.receiver || 'Self')} />
          <DetailRow icon={<Clock size={14} />} label="Timestamp" value={`${tx.date}, ${tx.time}`} />
          <DetailRow icon={<QrCode size={14} />} label="Transaction ID" value={`JAN${tx.id?.slice(0, 12).toUpperCase()}`} />
        </div>

        {/* Transaction Lifecycle */}
        <div className="w-full mb-6">
          <h4 className="text-xs font-black text-primary-900 mb-4 px-2">Transaction Lifecycle</h4>
          <div className="glass rounded-[2rem] p-6 border border-primary-50">
            <div className="relative border-l-2 border-primary-100 ml-3 space-y-6">
              
              <TimelineItem active={true} label="Created" time={`${tx.date}, ${tx.time}`} isLast={false} />
              
              <TimelineItem 
                active={!isFailed} 
                label={isFailed ? "Failed" : "Pending"} 
                time={isFailed ? `${tx.date}, ${tx.time}` : `${tx.date}, ${tx.time}`} 
                isLast={isFailed} 
                isError={isFailed}
              />
              
              {!isFailed && (
                <>
                  <TimelineItem 
                    active={!isPending} 
                    label="Synced" 
                    time={!isPending ? `${tx.date}, ${tx.time}` : 'Waiting...'} 
                    isLast={false} 
                  />
                  <TimelineItem 
                    active={!isPending} 
                    label="Completed" 
                    time={!isPending ? `${tx.date}, ${tx.time}` : 'Waiting...'} 
                    isLast={true} 
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Token Backed Info Box */}
        {isOffline && !isFailed && (
          <div className="w-full p-6 bg-purple-50 rounded-[2rem] border border-purple-100 text-left">
            <h5 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck size={14} /> Token Backed Settlement
            </h5>
            <p className="text-xs font-bold text-purple-700 leading-relaxed mb-4">
              This payment was authorized using valid, pre-signed offline tokens stored on this device. The merchant safe-settlement is guaranteed.
            </p>
            <span className="px-2 py-1 bg-white text-purple-500 text-[8px] font-black uppercase rounded-lg border border-purple-100">
              #{tx.id?.slice(-5) || 'TKNX9'}
            </span>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-6 py-4 bg-primary-50 rounded-[1.5rem] text-primary-600 font-black text-[10px] uppercase tracking-widest"
        >
          Close Details
        </motion.button>
      </motion.div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xs font-black text-primary-900 truncate max-w-[150px]">{value}</span>
  </div>
);

const TimelineItem = ({ active, label, time, isLast, isError }) => (
  <div className="relative pl-6">
    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
      isError ? 'bg-red-500' : active ? 'bg-green-500' : 'bg-primary-200'
    }`} />
    <div className="flex flex-col">
      <span className={`text-sm font-black ${isError ? 'text-red-500' : active ? 'text-primary-900' : 'text-slate-400'}`}>{label}</span>
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{time}</span>
    </div>
  </div>
);

export default HistoryScreen;
