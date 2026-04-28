import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your JanPay AI Assistant. I can help you with transfers, checking tokens, or explaining offline payments.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { text: input, sender: 'user' };
    setMessages([...messages, userMsg]);
    setInput('');
    
    // Simulate AI response with typing effect
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Analyzing your request...", sender: 'ai', isTyping: true }]);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev.filter(m => !m.isTyping),
          { text: "This is a Gold Build demonstration. My logic circuits are processing your request with premium precision.", sender: 'ai' }
        ]);
      }, 1500);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
            className="absolute bottom-20 right-0 w-[320px] h-[480px] mb-4"
          >
            <GlassCard premium className="h-full flex flex-col p-0 shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-gold-500/20 overflow-hidden rounded-[2.5rem]">
              {/* Chat Header */}
              <div className="p-6 gold-gradient flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight text-premium-dark uppercase">JanPay AI</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-premium-dark/60 uppercase">Protocol Active</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-8 h-8 bg-black/10 rounded-xl flex items-center justify-center text-premium-dark/60 hover:bg-black/20 transition-all"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
              
              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-black/20">
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-[13px] font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-gold-500 text-premium-dark rounded-tr-none font-bold italic' 
                        : 'bg-white/[0.06] text-white/90 rounded-tl-none border border-white/[0.05] backdrop-blur-md'
                    }`}>
                      {msg.text}
                      {msg.isTyping && (
                        <div className="flex gap-1 mt-2">
                          <div className="w-1 h-1 bg-gold-400 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-gold-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1 h-1 bg-gold-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-5 bg-black/40 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask JanPay..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-5 pr-10 text-[13px] text-white focus:outline-none focus:border-gold-500/50 focus:bg-white/[0.08] transition-all"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-gold-400 transition-colors">
                      <Mic size={18} />
                    </button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    className="w-12 h-12 gold-gradient rounded-2xl flex items-center justify-center text-premium-dark shadow-lg"
                  >
                    <Send size={20} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 12 }}
        whileTap={{ scale: 0.9, rotate: -12 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.8rem] transition-all duration-500 flex items-center justify-center shadow-2xl relative overflow-hidden group ${
          isOpen ? 'bg-premium-dark border-2 border-white/10' : 'gold-gradient'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X size={32} className="text-white" strokeWidth={2.5} />
        ) : (
          <div className="relative">
            <MessageSquare size={32} className="text-premium-dark" strokeWidth={2.5} />
            <motion.div 
              animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles size={14} className="text-premium-dark" />
            </motion.div>
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default ChatAssistant;
