import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useConnectivity } from '../hooks/useConnectivity';
import { BankServer } from '../logic/bankServer';
import { TokenManager } from '../logic/tokenManager';

const AppContext = createContext();
const HISTORY_KEY = 'janpay_tx_history';

export const AppProvider = ({ children }) => {
  const isOnline = useConnectivity();
  const prevOnline = useRef(isOnline);
  const [balance, setBalance] = useState(10000);
  const [offlineTokens, setOfflineTokens] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);

  // Initialize from persistence
  useEffect(() => {
    const loadData = async () => {
      const b = await BankServer.getBalance();
      const t = TokenManager.getTokens();
      const h = localStorage.getItem(HISTORY_KEY);
      
      setBalance(b);
      setOfflineTokens(t);
      if (h) setHistory(JSON.parse(h));
    };
    loadData();
  }, []);

  // Auto-Sync Logic
  useEffect(() => {
    if (isOnline && !prevOnline.current) {
      syncPendingTransactions();
    }
    prevOnline.current = isOnline;
  }, [isOnline]);

  const syncPendingTransactions = async () => {
    const pendingTxs = history.filter(tx => tx.status === 'Pending');
    if (pendingTxs.length === 0) return;

    // Simulate syncing with bank server
    setTimeout(() => {
      const updatedHistory = history.map(tx => 
        tx.status === 'Pending' ? { ...tx, status: 'Success' } : tx
      );
      setHistory(updatedHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      console.log('Synced offline transactions to server');
    }, 2000);
  };

  const navigateTo = (screen, data = null) => {
    if (data) setPendingTransaction(data);
    setCurrentScreen(screen);
  };

  const convertToTokens = async (amount) => {
    if (balance < amount) return false;
    
    const newToken = await BankServer.signToken(amount);
    const newBalance = balance - amount;
    
    await BankServer.updateBalance(newBalance);
    await TokenManager.addToken(newToken);
    
    setBalance(newBalance);
    setOfflineTokens(TokenManager.getTokens());
    return true;
  };

  const confirmTransaction = async () => {
    if (!pendingTransaction) return;

    try {
      const mode = isOnline ? 'Online' : 'Offline';
      const status = isOnline ? 'Success' : 'Pending';
      
      if (isOnline) {
        const newBalance = balance - pendingTransaction.amount;
        await BankServer.updateBalance(newBalance);
        setBalance(newBalance);
      } else {
        await TokenManager.useToken(pendingTransaction.amount);
        setOfflineTokens(TokenManager.getTokens());
      }

      const tx = {
        ...pendingTransaction,
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        type: mode,
        status: status
      };

      // Update History (Immutable)
      const newHistory = [tx, ...history];
      setHistory(newHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));

      setLastTransaction(tx);
      setPendingTransaction(null);
      setCurrentScreen('success');
    } catch (error) {
      throw error;
    }
  };

  const offlineBalance = offlineTokens.reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppContext.Provider value={{
      balance,
      offlineBalance,
      offlineTokens,
      history,
      isOnline,
      currentScreen,
      pendingTransaction,
      lastTransaction,
      navigateTo,
      confirmTransaction,
      convertToTokens,
      setCurrentScreen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
