import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import PinScreen from './screens/PinScreen';
import SuccessScreen from './screens/SuccessScreen';
import PaymentScreen from './screens/PaymentScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatAssistant from './components/ChatAssistant';
import FAB from './components/FAB';

const App = () => {
  const { currentScreen } = useApp();

  return (
    <div className="max-w-md mx-auto h-screen bg-premium-white shadow-2xl relative overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen />
          </motion.div>
        )}
        {currentScreen === 'payment' && (
          <motion.div key="payment" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}>
            <PaymentScreen />
          </motion.div>
        )}
        {currentScreen === 'pin' && (
          <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PinScreen />
          </motion.div>
        )}
        {currentScreen === 'success' && (
          <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            <SuccessScreen />
          </motion.div>
        )}
        {currentScreen === 'profile' && (
          <motion.div key="profile" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
            <ProfileScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatAssistant />
      <FAB />
    </div>
  );
};

export default App;
