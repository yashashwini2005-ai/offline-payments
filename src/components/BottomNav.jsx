import React from 'react';
import { Home, Search, Scan, History, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const BottomNav = () => {
  const { currentScreen, navigateTo } = useApp();

  const navItems = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'search', icon: <Search size={24} />, label: 'Search' },
    { id: 'scan', icon: <Scan size={24} />, label: 'Scan', isSpecial: true },
    { id: 'history', icon: <History size={24} />, label: 'History' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-primary-100 px-4 flex items-center justify-between z-50">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (item.id === 'scan') navigateTo('scan');
            else navigateTo(item.id);
          }}
          className={`flex flex-col items-center justify-center space-y-1 ${
            item.isSpecial 
              ? 'w-14 h-14 blue-gradient rounded-2xl text-white shadow-lg -translate-y-4' 
              : currentScreen === item.id ? 'text-primary-600' : 'text-primary-300'
          }`}
        >
          {item.icon}
          {!item.isSpecial && <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>}
        </motion.button>
      ))}
    </div>
  );
};

export default BottomNav;
