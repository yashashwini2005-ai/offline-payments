import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm JanPay AI. How can I help you with your offline payments today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: "I'm a simulation of JanPay's smart assistant. I can help you understand token minting, daily limits (₹1000), and how to sync your offline transactions!" }]);
    }, 1000);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 blue-gradient rounded-full flex items-center justify-center shadow-2xl z-40 border-4 border-white"
      >
        <Bot size={30} className="text-white" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary-900/20 backdrop-blur-sm"
          >
            <div className="w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[70vh] border border-primary-100">
              {/* Header */}
              <div className="blue-gradient p-8 flex justify-between items-center relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg tracking-tight">JanPay AI</h3>
                    <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Smart Assistant</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-primary-50/30">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'bot' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${
                      msg.role === 'bot' 
                        ? 'bg-white text-primary-900 rounded-tl-none border border-primary-100' 
                        : 'blue-gradient rounded-br-none'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="p-6 bg-white border-t border-primary-100">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about offline limits..."
                    className="flex-1 bg-primary-50 border border-primary-100 rounded-2xl px-6 py-4 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 transition-all"
                  />
                  <button
                    onClick={handleSend}
                    className="w-14 h-14 blue-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
                  >
                    <Send size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
