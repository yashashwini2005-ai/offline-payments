import React from 'react';
import { Plus, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const FAB = () => {
  const { navigateTo } = useApp();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigateTo('payment')}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full gold-gradient shadow-[0_8px_32px_rgba(212,175,55,0.3)] flex items-center justify-center text-premium-dark z-40 border border-white/20"
    >
      <ScanLine size={28} strokeWidth={2.5} />
    </motion.button>
  );
};

export default FAB;
