import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, ChevronLeft, ChevronRight, CreditCard, 
  ShieldCheck, Bell, Globe, Headphones, LogOut, Plus, 
  QrCode, Landmark, CheckCircle2, MoreVertical, Trash2, 
  Smartphone, Share2, Download, AlertCircle, Sparkles, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const ProfileScreen = () => {
  const { user, linkedBanks, navigateTo, switchPrimaryBank, offlineTokens } = useApp();
  const { language, setLanguage, t } = useLanguage();
  
  const [showQR, setShowQR] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  
  const [newPin, setNewPin] = useState('');
  const [activeTab, setActiveTab] = useState('wallet'); // wallet, settings

  const [securityPrefs, setSecurityPrefs] = useState({ biometric: true, pinLock: true, screenLock: true });
  const [notifPrefs, setNotifPrefs] = useState({ transactions: true, sms: false, push: true });

  const toggleSecurity = (key) => setSecurityPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleNotif = (key) => setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', native: 'ತೆಲುಗು' }
  ];

  const settingsItems = [
    { 
      icon: <ShieldCheck size={20} />, 
      label: t('security_settings'), 
      sub: "Biometric & PIN",
      onClick: () => setShowSecurity(true)
    },
    { 
      icon: <Bell size={20} />, 
      label: t('notification_prefs'), 
      sub: "Alerts & SMS",
      onClick: () => setShowNotifications(true)
    },
    { 
      icon: <Globe size={20} />, 
      label: t('language_selection'), 
      sub: languages.find(l => l.code === language)?.native || 'English',
      onClick: () => setShowLang(true)
    },
    { 
      icon: <Smartphone size={20} />, 
      label: t('linked_devices'), 
      sub: "Galaxy S23 Ultra",
      onClick: () => setShowDevices(true)
    },
    { 
      icon: <Lock size={20} />, 
      label: "Change UPI PIN", 
      sub: "Secure your transactions",
      onClick: () => setShowChangePin(true)
    },
  ];

  return (
    <div className="w-full min-h-screen px-4 py-4 flex flex-col bg-premium-white overflow-y-auto pb-32">
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
        <div className="p-6 space-y-8">
          {/* Profile Header */}
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
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{user.phone} • {user.email}</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="p-1.5 bg-primary-50 rounded-[2rem] flex items-center shadow-inner">
            <TabButton active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} label="My Wallet" />
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} label="Settings" />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'wallet' ? (
              <motion.div 
                key="wallet"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Bank Accounts */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">Linked Bank Accounts</h4>
                    <button onClick={() => setShowAddBank(true)} className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1">
                      <Plus size={14} /> Add Bank
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {linkedBanks.map((bank) => (
                      <BankCard key={bank.id} bank={bank} onSwitch={() => switchPrimaryBank(bank.id)} />
                    ))}
                  </div>
                </div>

                {/* QR & UPI ID */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">{t('scan')} & UPI ID</h4>
                  <div 
                    onClick={() => setShowQR(true)}
                    className="p-6 glass rounded-[2.5rem] border border-primary-50 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary-100 rounded-3xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                        <QrCode size={28} />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('personal_upi_id')}</p>
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
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">Account & Security</h4>
                  <div className="glass rounded-[2.5rem] border border-primary-50 overflow-hidden">
                    {settingsItems.map((item, idx) => (
                      <SettingsItem 
                        key={idx}
                        icon={item.icon} 
                        label={item.label} 
                        sub={item.sub}
                        onClick={item.onClick}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.15em] text-blue-600">Support & About</h4>
                  <div className="glass rounded-[2.5rem] border border-primary-50 overflow-hidden">
                    <SettingsItem icon={<Headphones size={20} />} label={t('help_support')} sub="24/7 Priority Assistance" />
                    <SettingsItem icon={<AlertCircle size={20} />} label={t('about_janpay')} sub="v8.0.10 Professional Edition" />
                  </div>
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

      {/* Modals */}
      <AnimatePresence>
        {showLang && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLang(false)} className="absolute inset-0 bg-primary-900/60 backdrop-blur-md" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative w-full max-w-md bg-white rounded-t-[3rem] p-10 pb-16 shadow-2xl">
              <div className="w-12 h-1.5 bg-primary-100 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-black text-primary-900 mb-8 text-center">{t('language_selection')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setLanguage(lang.code); setShowLang(false); }}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${
                      language === lang.code ? 'border-primary-500 bg-primary-50' : 'border-primary-50 bg-white'
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

        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQR(false)} className="absolute inset-0 bg-primary-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 text-center shadow-2xl">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl mx-auto mb-6 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                <QrCode size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary-900 mb-2">My UPI QR</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10">Scan to pay directly into your account</p>
              <div className="p-8 bg-primary-50 rounded-[2.5rem] border border-primary-100 mb-10">
                <QrCode size={180} className="mx-auto text-primary-900" />
              </div>
              <div className="flex gap-4">
                <motion.button whileTap={{ scale: 0.95 }} className="flex-1 py-4 bg-primary-50 rounded-2xl text-primary-600 font-black text-[10px] uppercase flex items-center justify-center gap-2"><Download size={16} /> Save</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} className="flex-1 py-4 bg-primary-50 rounded-2xl text-primary-600 font-black text-[10px] uppercase flex items-center justify-center gap-2"><Share2 size={16} /> Share</motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {showSecurity && (
          <SettingsModal title="Security Settings" onClose={() => setShowSecurity(false)} icon={<ShieldCheck size={32} />}>
            <div className="space-y-4">
              <ToggleItem label="Biometric Unlock" sub="Fingerprint / Face ID" active={securityPrefs.biometric} onToggle={() => toggleSecurity('biometric')} />
              <ToggleItem label="App PIN Lock" sub="Require PIN on startup" active={securityPrefs.pinLock} onToggle={() => toggleSecurity('pinLock')} />
              <ToggleItem label="Screen Lock" sub="Secure checkout screen" active={securityPrefs.screenLock} onToggle={() => toggleSecurity('screenLock')} />
            </div>
          </SettingsModal>
        )}

        {showNotifications && (
          <SettingsModal title="Notification Prefs" onClose={() => setShowNotifications(false)} icon={<Bell size={32} />}>
            <div className="space-y-4">
              <ToggleItem label="Transaction Alerts" sub="Real-time payment proof" active={notifPrefs.transactions} onToggle={() => toggleNotif('transactions')} />
              <ToggleItem label="SMS Notifications" sub="Carrier network alerts" active={notifPrefs.sms} onToggle={() => toggleNotif('sms')} />
              <ToggleItem label="Push Notifications" sub="App updates & offers" active={notifPrefs.push} onToggle={() => toggleNotif('push')} />
            </div>
          </SettingsModal>
        )}

        {showDevices && (
          <SettingsModal title="Linked Devices" onClose={() => setShowDevices(false)} icon={<Smartphone size={32} />}>
            <div className="space-y-6">
              <div className="p-6 bg-primary-50 rounded-[2.5rem] border border-primary-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm"><Smartphone size={24} /></div>
                <div className="text-left">
                  <p className="text-sm font-black text-primary-900">Galaxy S23 Ultra</p>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">This Device (Active)</p>
                </div>
              </div>
            </div>
          </SettingsModal>
        )}

        {showChangePin && (
          <SettingsModal title="Change UPI PIN" onClose={() => { setShowChangePin(false); setNewPin(''); }} icon={<Lock size={32} />}>
            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-primary-50 border border-primary-100 rounded-[2rem] py-5 px-8 text-3xl font-black text-center tracking-[1em] text-primary-900 focus:outline-none focus:border-primary-500"
                />
              </div>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowChangePin(false)} className="w-full py-5 blue-gradient rounded-[2rem] font-black text-white uppercase tracking-widest shadow-lg">Update PIN</motion.button>
            </div>
          </SettingsModal>
        )}

        {showAddBank && (
          <SettingsModal title="Add Bank Account" onClose={() => setShowAddBank(false)} icon={<Landmark size={32} />}>
            <div className="grid grid-cols-2 gap-4">
              <BankOption name="HDFC" icon={<Landmark size={24} />} onClick={() => setShowAddBank(false)} />
              <BankOption name="SBI" icon={<Landmark size={24} />} onClick={() => setShowAddBank(false)} />
              <BankOption name="ICICI" icon={<Landmark size={24} />} onClick={() => setShowAddBank(false)} />
              <BankOption name="Axis" icon={<Landmark size={24} />} onClick={() => setShowAddBank(false)} />
            </div>
          </SettingsModal>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsModal = ({ title, onClose, icon, children }) => (
  <div className="fixed inset-0 z-[120] flex items-end justify-center">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-primary-900/60 backdrop-blur-md" />
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative w-full max-w-md bg-white rounded-t-[3rem] p-10 pb-16 shadow-2xl">
      <div className="w-12 h-1.5 bg-primary-100 rounded-full mx-auto mb-10" />
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 bg-blue-50 rounded-[1.8rem] flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 mb-4">{icon}</div>
        <h3 className="text-2xl font-black text-primary-900">{title}</h3>
      </div>
      {children}
      <motion.button whileTap={{ scale: 0.95 }} onClick={onClose} className="w-full mt-10 py-5 bg-primary-900 rounded-[2rem] text-white font-black text-[12px] uppercase tracking-widest">Done</motion.button>
    </motion.div>
  </div>
);

const ToggleItem = ({ label, sub, active, onToggle }) => (
  <div className="p-6 glass rounded-[2rem] border border-primary-50 flex items-center justify-between">
    <div className="text-left">
      <p className="text-sm font-black text-primary-900">{label}</p>
      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">{sub}</p>
    </div>
    <motion.button whileTap={{ scale: 0.9 }} onClick={onToggle} className={`w-14 h-8 rounded-full p-1.5 transition-colors ${active ? 'bg-primary-600' : 'bg-primary-100'}`}>
      <motion.div animate={{ x: active ? 24 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-md" />
    </motion.button>
  </div>
);

const SettingsItem = ({ icon, label, sub, onClick }) => (
  <motion.button whileTap={{ scale: 0.98 }} onClick={onClick} className="w-full p-6 flex items-center justify-between hover:bg-primary-50/50 transition-all border-b border-primary-900/5 last:border-0 text-left">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-sm font-black text-primary-900 tracking-tight">{label}</p>
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    <ChevronRight className="text-primary-200" size={18} />
  </motion.button>
);

const BankCard = ({ bank, onSwitch }) => {
  const getBankIconStyle = (name) => {
    if (name.includes('HDFC')) return 'bg-blue-50 text-blue-600 border border-blue-100';
    if (name.includes('ICICI')) return 'bg-orange-50 text-orange-600 border border-orange-100';
    return 'bg-primary-50 text-primary-600 border border-primary-100';
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }} onClick={onSwitch} className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden group ${bank.isPrimary ? 'border-primary-500 bg-white shadow-xl' : 'border-primary-50 bg-primary-50/50'}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-sm ${getBankIconStyle(bank.name)}`}><Landmark size={28} /></div>
          <div className="text-left">
            <p className="text-lg font-black text-primary-900 tracking-tight">{bank.name}</p>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">A/C: {bank.accountNumber || bank.account}</p>
          </div>
        </div>
        {bank.isPrimary && <div className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Primary</div>}
      </div>
    </motion.div>
  );
};

const BankOption = ({ name, icon, onClick }) => (
  <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} className="p-6 bg-primary-50 rounded-3xl border border-primary-100 flex flex-col items-center gap-2">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest text-primary-900">{name}</span>
  </motion.button>
);

const TabButton = ({ active, onClick, label }) => (
  <motion.button whileTap={{ scale: 0.95 }} onClick={onClick} className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-primary-600 shadow-lg' : 'text-blue-500/70'}`}>{label}</motion.button>
);

export default ProfileScreen;
