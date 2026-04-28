import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Sparkles, Bot, Mic, MicOff, 
  ShieldCheck, AlertTriangle, ArrowRight, User, Wallet, History,
  Lock, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

const ChatAssistant = () => {
  const { balance, history, navigateTo, isOnline } = useApp();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm JanPay AI. You can ask me to send money, check balance, or view history." }
  ]);
  const [input, setInput] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice Support (Web Speech API)
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      addBotMessage("Voice recognition is not supported in your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const addBotMessage = (content, data = null) => {
    setMessages(prev => [...prev, { role: 'bot', content, data }]);
  };

  const maskPII = (text) => {
    // Mask mobile numbers (10 digits)
    let masked = text.replace(/(\d{6})(\d{4})/g, '******$2');
    // Mask UPI IDs (user@bank)
    masked = masked.replace(/([a-zA-Z0-9]{2})[a-zA-Z0-9]+(@[a-zA-Z]+)/g, '$1****$2');
    return masked;
  };

  const detectIntent = (text) => {
    const lower = text.toLowerCase();
    
    // 1. Extraction
    const amountMatch = text.match(/₹?\s?(\d+)/);
    const upiMatch = text.match(/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/);
    const phoneMatch = text.match(/[6-9]\d{9}/);
    
    const amount = amountMatch ? parseInt(amountMatch[1]) : null;
    const receiver = upiMatch ? upiMatch[0] : (phoneMatch ? phoneMatch[0] : null);

    // 2. Intent Matching
    if (lower.includes('send') || lower.includes('pay') || lower.includes('transfer')) {
      if (amount && receiver) return { type: 'SEND_MONEY', amount, receiver };
      return { type: 'SEND_MONEY_INCOMPLETE', amount, receiver };
    }
    
    if (lower.includes('balance') || lower.includes('much') || lower.includes('money do i have')) {
      return { type: 'CHECK_BALANCE' };
    }
    
    if (lower.includes('history') || lower.includes('transactions') || lower.includes('ledger')) {
      return { type: 'VIEW_HISTORY' };
    }

    return { type: 'UNKNOWN' };
  };

  const checkFraud = (amount, receiver) => {
    // Rule 1: High amount
    if (amount > 5000) return "High transaction value flagged. Requires manual verification.";
    
    // Rule 2: Duplicate detection (last 5 mins)
    const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
    const isDuplicate = history.some(tx => 
      tx.amount === amount && 
      tx.receiver === receiver && 
      new Date(tx.timestamp).getTime() > fiveMinsAgo
    );
    if (isDuplicate) return "Duplicate transaction detected within 5 minutes. Please verify.";
    
    return null;
  };

  const handleSend = (overrideInput = null) => {
    const text = overrideInput || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: maskPII(text) }]);
    if (!overrideInput) setInput('');

    // Process intent
    const intent = detectIntent(text);
    
    setTimeout(() => {
      switch (intent.type) {
        case 'CHECK_BALANCE':
          setPendingAction({ type: 'CHECK_BALANCE' });
          addBotMessage("I need your secure authorization to access your bank balance. Please confirm to proceed to the PIN screen.", { 
            type: 'confirmation_card', 
            actionLabel: 'Check Balance',
            icon: 'Wallet'
          });
          break;
        
        case 'VIEW_HISTORY':
          addBotMessage("I'll fetch your transaction history for you.", { type: 'history_list', items: history.slice(-3).reverse() });
          break;
        
        case 'SEND_MONEY':
          const fraudWarning = checkFraud(intent.amount, intent.receiver);
          if (fraudWarning) {
            addBotMessage(fraudWarning, { type: 'fraud_alert' });
          } else {
            setPendingAction(intent);
            addBotMessage("I've prepared the payment details. You will need to enter your UPI PIN on the next screen to authorize this.", { 
              type: 'confirmation_card', 
              amount: intent.amount, 
              receiver: intent.receiver,
              actionLabel: 'Send Money'
            });
          }
          break;
        
        case 'SEND_MONEY_INCOMPLETE':
          addBotMessage("I can help with that. Please provide both the amount and the receiver's UPI ID or phone number.");
          break;
        
        default:
          addBotMessage("I'm not sure I understood. I can help you send money, check balance, or see transaction history.");
      }
    }, 800);
  };

  const confirmAction = () => {
    if (pendingAction) {
      setIsOpen(false);
      if (pendingAction.type === 'CHECK_BALANCE') {
        navigateTo('pin', { isBalanceCheck: true });
      } else {
        navigateTo('pin', { amount: pendingAction.amount, receiver: pendingAction.receiver });
      }
      setPendingAction(null);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="absolute bottom-32 left-6 w-16 h-16 blue-gradient rounded-full flex items-center justify-center shadow-2xl z-50 border-4 border-white"
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
            <div className="w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[75vh] border border-primary-100">
              {/* Header */}
              <div className="blue-gradient p-8 flex justify-between items-center relative">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg tracking-tight">{t('ai_assistant')}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{t('smart_assistant')}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-primary-50/30">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'bot' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="space-y-3 max-w-[85%]">
                      <div className={`p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${
                        msg.role === 'bot' 
                          ? 'bg-white text-primary-900 rounded-tl-none border border-primary-100' 
                          : 'blue-gradient rounded-br-none text-white'
                      }`}>
                        {msg.content}
                      </div>

                      {/* Specialized Bot Responses */}
                      {msg.data?.type === 'confirmation_card' && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-white p-6 rounded-[2.5rem] border-2 border-blue-100 shadow-xl space-y-4"
                        >
                          <div className="flex items-center gap-3 pb-4 border-b border-primary-50">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                              {msg.data.icon === 'Wallet' ? <Wallet size={20} /> : <ShieldCheck size={20} />}
                            </div>
                            <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{msg.data.actionLabel}</p>
                          </div>
                          {msg.data.receiver && (
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">To</span>
                                <span className="text-sm font-black text-primary-900">{maskPII(msg.data.receiver)}</span>
                              </div>
                              <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-bold text-primary-900/30 uppercase tracking-widest">Amount</span>
                                <span className="text-2xl font-black text-primary-900">₹{msg.data.amount}</span>
                              </div>
                            </div>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={confirmAction}
                            className="w-full py-4 blue-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                          >
                            {msg.data.actionLabel === 'Check Balance' ? 'Verify & View' : 'Proceed to PIN'} <ArrowRight size={16} />
                          </motion.button>
                        </motion.div>
                      )}

                      {msg.data?.type === 'fraud_alert' && (
                        <div className="bg-red-50 p-5 rounded-[2rem] border border-red-100 flex gap-3 text-red-600">
                          <AlertTriangle size={20} className="shrink-0" />
                          <p className="text-xs font-bold leading-tight">{msg.content}</p>
                        </div>
                      )}

                      {msg.data?.type === 'history_list' && (
                        <div className="space-y-2">
                          {msg.data.items.map((tx, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-primary-100 flex justify-between items-center shadow-sm">
                              <div className="flex items-center gap-3">
                                <History size={16} className="text-primary-400" />
                                <span className="text-xs font-bold text-primary-900 truncate max-w-[100px]">{maskPII(tx.receiver)}</span>
                              </div>
                              <span className="text-xs font-black text-primary-900">₹{tx.amount}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* AI Quick Actions */}
                <div className="pt-4 flex flex-wrap gap-2 justify-start">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput('Pay to mobile ')}
                    className="px-4 py-2 bg-white border border-primary-100 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest shadow-sm flex items-center gap-2"
                  >
                    <User size={12} /> Mobile Pay
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput('Pay to UPI ')}
                    className="px-4 py-2 bg-white border border-primary-100 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest shadow-sm flex items-center gap-2"
                  >
                    <ArrowRight size={12} /> UPI Pay
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSend('Check my balance')}
                    className="px-4 py-2 bg-white border border-primary-100 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest shadow-sm flex items-center gap-2"
                  >
                    <Wallet size={12} /> Balance
                  </motion.button>
                </div>
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-primary-100">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={t('ask_about')}
                      className="w-full bg-primary-50 border border-primary-100 rounded-[1.8rem] pl-6 pr-14 py-5 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-500 transition-all shadow-inner"
                    />
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={startListening}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl ${isListening ? 'text-red-500 bg-red-50' : 'text-primary-400 hover:text-primary-600'}`}
                    >
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSend()}
                    className="w-16 h-16 blue-gradient rounded-[1.8rem] flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-95 transition-all shrink-0"
                  >
                    <Send size={24} className="text-white" />
                  </motion.button>
                </div>
                {!isOnline && (
                  <p className="text-center mt-3 text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center justify-center gap-1">
                    <ShieldAlert size={12} /> Voice Support Limited Offline
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
