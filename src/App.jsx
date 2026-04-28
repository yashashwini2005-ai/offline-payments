import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import PinScreen from './screens/PinScreen';
import SuccessScreen from './screens/SuccessScreen';
import PaymentScreen from './screens/PaymentScreen';
import ProfileScreen from './screens/ProfileScreen';
import HistoryScreen from './screens/HistoryScreen';
import SearchScreen from './screens/SearchScreen';
import ScanScreen from './screens/ScanScreen';
import AuditScreen from './screens/AuditScreen';
import BankTransferScreen from './screens/BankTransferScreen';
import ChatAssistant from './components/ChatAssistant';
import BottomNav from './components/BottomNav';

const App = () => {
  const { currentScreen } = useApp();

  return (
    <div className="max-w-md mx-auto h-screen bg-premium-white shadow-2xl relative overflow-hidden font-sans border-[8px] border-primary-900 rounded-[3rem]">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <HomeScreen />
          </motion.div>
        )}
        {currentScreen === 'payment' && (
          <motion.div key="payment" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="h-full">
            <PaymentScreen />
          </motion.div>
        )}
        {currentScreen === 'pin' && (
          <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <PinScreen />
          </motion.div>
        )}
        {currentScreen === 'success' && (
          <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <SuccessScreen />
          </motion.div>
        )}
        {currentScreen === 'profile' && (
          <motion.div key="profile" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full">
            <ProfileScreen />
          </motion.div>
        )}
        {currentScreen === 'history' && (
          <motion.div key="history" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="h-full">
            <HistoryScreen />
          </motion.div>
        )}
        {currentScreen === 'search' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <SearchScreen />
          </motion.div>
        )}
        {currentScreen === 'scan' && (
          <motion.div key="scan" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="h-full">
            <ScanScreen />
          </motion.div>
        )}
        {currentScreen === 'audit' && (
          <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <AuditScreen />
          </motion.div>
        )}
        {currentScreen === 'bankTransfer' && (
          <motion.div key="bankTransfer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="h-full">
            <BankTransferScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatAssistant />
      <BottomNav />
    </div>
  );
};

export default App;
