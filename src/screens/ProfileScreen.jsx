import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, ChevronLeft, ChevronRight, CreditCard, 
  ShieldCheck, Bell, Globe, Headphones, LogOut, Plus, 
  QrCode, Landmark, CheckCircle2, MoreVertical, Trash2, 
  Smartphone, Share2, Download, AlertCircle, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const ProfileScreen = () => {
  const { user, linkedBanks, navigateTo, switchPrimaryBank, setLinkedBanks, setUser } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [showQR, setShowQR] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [activeTab, setActiveTab] = useState('banks'); // banks, settings

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' }
  ];

  return (
    <div className="flex flex-col h-screen bg-premium-white overflow-hidden">
      {/* Top Navigation */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between glass sticky top-0 z-30 border-b border-primary-100">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateTo('home')}
          className="p-3 bg-primary-50 rounded-2xl text-primary-600"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </motion.button>
        <h2 className="text-xl font-black tracking-tight text-primary-900">{t('user_profile')}</h2>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-primary-50 rounded-2xl text-primary-600"
        >
          <Share2 size={20} strokeWidth={2.5} />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        {/* Profile Header Section */}
        <div className="p-6 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-[3rem] p-1.5 blue-gradient shadow-2xl relative"
              >
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-[2.8rem] border-4 border-white"
                />
                <div className="absolute inset-0 bg-primary-900/10 rounded-[2.8rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border-2 border-primary-50"
              >
                <Camera size={20} strokeWidth={2.5} />
              </motion.button>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl font-black tracking-tight text-primary-900">{user.name}</h3>
                <CheckCircle2 size={18} className="text-blue-500" />
              </div>
              <p className="text-primary-900/40 text-xs font-bold uppercase tracking-widest">{user.phone} • {user.email}</p>
            </div>

            <div className="w-full max-w-xs p-4 glass rounded-3xl border border-primary-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <Sparkles size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-primary-900/40 uppercase tracking-widest">{t('profile_completion')}</p>
                  <p className="text-sm font-black text-primary-900">{user.completion}%</p>
                </div>
              </div>
              <div className="w-24 h-2 bg-primary-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${user.completion}%` }}
                  className="h-full blue-gradient"
                />
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1.5 bg-primary-50 rounded-[2rem] border border-primary-100">
            <TabButton 
              active={activeTab === 'banks'} 
              onClick={() => setActiveTab('banks')} 
              icon={<Landmark size={18} />} 
              label={t('history')} 
            />
            <TabButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
              icon={<ShieldCheck size={18} />} 
              label={t('settings')} 
            />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'banks' ? (
              <motion.div 
                key="banks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Linked Banks Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-xs font-black uppercase tracking-[0.15em] text-primary-900/40">{t('linked_banks')}</h4>
                    <motion.button 
                      onClick={() => setShowAddBank(true)}
                      whileTap={{ scale: 0.95 }}
                      className="text-[10px] font-black uppercase text-primary-600 flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 rounded-xl"
                    >
                      <Plus size={14} strokeWidth={3} /> {t('add_new')}
                    </motion.button>
                  </div>
                  
                  <div className="space-y-4">
                    {linkedBanks.map((bank) => (
                      <BankCard key={bank.id} bank={bank} onSwitch={() => switchPrimaryBank(bank.id)} />
                    ))}
                  </div>
                </div>

                {/* QR & UPI ID */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-primary-900/40">{t('scan')} & UPI ID</h4>
                  <div 
                    onClick={() => setShowQR(true)}
                    className="p-6 glass rounded-[2.5rem] border border-primary-50 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary-100 rounded-3xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                        <QrCode size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-primary-900/30 uppercase tracking-widest">{t('personal_upi_id')}</p>
                        <p className="text-lg font-black text-primary-900 tracking-tight">{linkedBanks.find(b => b.isPrimary)?.upiId || 'yash@janpay'}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-primary-200" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h4 className="text-xs font-black uppercase tracking-[0.15em] text-primary-900/40">Account & Security</h4>
                <div className="glass rounded-[2.5rem] border border-primary-50 overflow-hidden">
                  <SettingsItem icon={<ShieldCheck size={20} />} label={t('security_settings')} sub="Password, Fingerprint, PIN" />
                  <SettingsItem icon={<Bell size={20} />} label={t('notification_prefs')} sub="Alerts, SMS, Transaction History" />
                  <SettingsItem 
                    onClick={() => setShowLang(true)}
                    icon={<Globe size={20} />} 
                    label={t('language_selection')} 
                    sub={languages.find(l => l.code === language)?.native || 'English'} 
                  />
                  <SettingsItem icon={<Smartphone size={20} />} label={t('linked_devices')} sub="Samsung S23 Ultra" />
                </div>

                <h4 className="text-xs font-black uppercase tracking-[0.15em] text-primary-900/40 pt-4">Support & About</h4>
                <div className="glass rounded-[2.5rem] border border-primary-50 overflow-hidden">
                  <SettingsItem icon={<Headphones size={20} />} label={t('help_support')} sub="24/7 Priority Assistance" />
                  <SettingsItem icon={<AlertCircle size={20} />} label={t('about_janpay')} sub="v8.0.10 Professional Edition" />
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-5 bg-red-50 rounded-[2rem] flex items-center justify-center gap-3 text-red-600 font-black text-[12px] uppercase tracking-widest border border-red-100"
                >
                  <LogOut size={18} /> {t('logout')}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLang && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowLang(false)}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-md" 
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] p-10 pb-16 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-primary-100 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-black text-primary-900 mb-2 text-center">{t('language_selection')}</h3>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setLanguage(lang.code); setShowLang(false); }}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                      language === lang.code 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-primary-50 bg-white'
                    }`}
                  >
                    <span className="text-lg font-black text-primary-900">{lang.native}</span>
                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{lang.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-md" 
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 text-center shadow-2xl"
            >
              <div className="w-16 h-16 blue-gradient rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-xl">
                <QrCode size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary-900 mb-2">My UPI QR</h3>
              <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-widest mb-10">Scan to pay directly into your account</p>
              
              <div className="p-8 bg-primary-50 rounded-[2.5rem] border border-primary-100 mb-10 relative">
                <QrCode size={180} className="mx-auto text-primary-900" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-primary-100">
                  <Landmark className="text-primary-600" size={24} />
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button whileTap={{ scale: 0.95 }} className="flex-1 py-4 bg-primary-50 rounded-2xl text-primary-600 font-black text-[10px] uppercase flex items-center justify-center gap-2">
                  <Download size={16} /> Save
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} className="flex-1 py-4 bg-primary-50 rounded-2xl text-primary-600 font-black text-[10px] uppercase flex items-center justify-center gap-2">
                  <Share2 size={16} /> Share
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Bank Modal */}
      <AnimatePresence>
        {showAddBank && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBank(false)}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-md" 
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-[3rem] p-10 pb-16 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-primary-100 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-black text-primary-900 mb-2 text-center">Add Bank Account</h3>
              <p className="text-primary-900/40 text-[10px] font-black uppercase tracking-widest text-center mb-10">Link a new account via secure UPI handshake</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <BankOption name="HDFC" icon={<Landmark size={24} />} />
                  <BankOption name="SBI" icon={<Landmark size={24} />} />
                  <BankOption name="ICICI" icon={<Landmark size={24} />} />
                  <BankOption name="Axis" icon={<Landmark size={24} />} />
                </div>
                
                <div className="pt-4">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddBank(false)}
                    className="w-full py-5 blue-gradient rounded-[2rem] font-black text-white uppercase tracking-widest"
                  >
                    Search More Banks
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3.5 rounded-[1.8rem] flex items-center justify-center gap-2 transition-all duration-300 ${
      active ? 'bg-white text-primary-600 shadow-sm' : 'text-primary-900/30'
    }`}
  >
    {icon}
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const BankCard = ({ bank, onSwitch }) => (
  <div className={`p-6 rounded-[2.5rem] border transition-all relative overflow-hidden ${
    bank.isPrimary 
      ? 'bg-primary-50 border-primary-200' 
      : 'bg-white border-primary-100 opacity-60'
  }`}>
    <div className="flex justify-between items-start relative z-10">
      <div className="flex gap-4">
        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${
          bank.isPrimary ? 'blue-gradient' : 'bg-primary-100 text-primary-600'
        }`}>
          <Landmark size={28} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h5 className="font-black text-primary-900">{bank.name}</h5>
            {bank.isPrimary && (
              <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[7px] font-black uppercase rounded-lg border border-green-100">Primary</span>
            )}
          </div>
          <p className="text-[10px] font-black text-primary-900/40 uppercase tracking-widest">{bank.accountNumber}</p>
        </div>
      </div>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="p-2 text-primary-300 hover:text-primary-600 transition-colors"
      >
        <MoreVertical size={20} />
      </motion.button>
    </div>

    <div className="mt-6 flex justify-between items-center relative z-10">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-[8px] font-black text-primary-900/40 uppercase tracking-widest">{bank.verified ? 'Verified' : 'Unverified'}</span>
      </div>
      {!bank.isPrimary && (
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onSwitch}
          className="text-[10px] font-black uppercase text-primary-600 border-b border-primary-200"
        >
          Set Primary
        </motion.button>
      )}
    </div>

    {/* Background Pattern */}
    <div className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-12">
      <Landmark size={120} />
    </div>
  </div>
);

const SettingsItem = ({ icon, label, sub, onClick }) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-between p-6 hover:bg-primary-50/50 transition-colors border-b border-primary-900/5 last:border-0 group"
  >
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-left space-y-0.5">
        <p className="font-black text-[15px] text-primary-900 group-hover:text-primary-600 transition-colors">{label}</p>
        <p className="text-[9px] font-bold text-primary-900/30 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    <ChevronRight className="text-primary-100" />
  </motion.button>
);

const BankOption = ({ name, icon }) => (
  <motion.button 
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center gap-3 p-6 glass rounded-[2.5rem] border border-primary-900/5"
  >
    <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest text-primary-900">{name}</span>
  </motion.button>
);

export default ProfileScreen;
