import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import PinScreen from './screens/PinScreen';
import SuccessScreen from './screens/SuccessScreen';
import PaymentScreen from './screens/PaymentScreen';
import ChatAssistant from './components/ChatAssistant';
import FAB from './components/FAB';

const App = () => {
  const { currentScreen } = useApp();

  return (
    <div className="relative min-h-screen max-w-md mx-auto overflow-hidden bg-premium-dark shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'payment' && <PaymentScreen />}
          {currentScreen === 'pin' && <PinScreen />}
          {currentScreen === 'success' && <SuccessScreen />}
        </motion.div>
      </AnimatePresence>

      <ChatAssistant />
      <FAB />
    </div>
  );
};

export default App;
