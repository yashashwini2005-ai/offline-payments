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
      className="absolute bottom-8 right-6 w-16 h-16 rounded-full gold-gradient shadow-[0_8px_32px_rgba(212,175,55,0.4)] flex items-center justify-center text-premium-dark z-40 border-4 border-white"
    >
      <ScanLine size={28} strokeWidth={2.5} />
    </motion.button>
  );
};

export default FAB;
