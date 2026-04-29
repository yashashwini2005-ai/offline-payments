import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Phone, ChevronRight, User, Clock, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SearchScreen = () => {
  const { navigateTo } = useApp();
  const [query, setQuery] = useState('');

  const contacts = [
    { id: 1, name: 'Aarav Sharma', phone: '9876543210', initial: 'A', color: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Priya Patel', phone: '9123456789', initial: 'P', color: 'bg-purple-100 text-purple-600' },
    { id: 3, name: 'Ishan Gupta', phone: '9988776655', initial: 'I', color: 'bg-green-100 text-green-600' },
    { id: 4, name: 'Sanya Malhotra', phone: '9555666777', initial: 'S', color: 'bg-orange-100 text-orange-600' },
  ];

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.phone.includes(query)
  );

  return (
    <div className="w-full min-h-screen px-4 py-4 md:p-6 md:pt-12 flex flex-col bg-premium-white overflow-y-auto pb-32">
      {/* Search Header */}
      <div className="space-y-6 mb-8">
        <h2 className="text-2xl font-black tracking-tight text-primary-900">Search & Pay</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300" size={20} />
          <input 
            autoFocus
            type="text" 
            placeholder="Search name or mobile number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-primary-50 border border-primary-100 rounded-[1.8rem] py-5 pl-12 pr-6 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8 pb-24">
        {/* New Number Action */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigateTo('payment', { receiver: query || '' })}
          className="w-full p-6 glass rounded-[2.5rem] border border-primary-100 flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-primary-900">New Contact or Number</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enter mobile/UPI to pay</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-primary-100 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Recent Contacts */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Clock size={14} className="text-primary-300" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Recent Contacts</h3>
          </div>
          
          <div className="space-y-2">
            {filteredContacts.map((contact, i) => (
              <motion.button
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateTo('payment', { receiver: contact.phone })}
                className="w-full p-4 hover:bg-primary-50/50 rounded-3xl flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${contact.color}`}>
                    {contact.initial}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-primary-900 group-hover:text-primary-600 transition-colors">{contact.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star size={14} className="text-yellow-400 fill-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ChevronRight size={18} className="text-primary-100" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
