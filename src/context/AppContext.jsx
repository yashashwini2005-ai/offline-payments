import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ConnectivityMonitor, NETWORK_STATE } from '../logic/ConnectivityMonitor';
import { TransactionQueue } from '../logic/TransactionQueue';
import { SyncEngine } from '../logic/SyncEngine';
import { BankServer } from '../logic/bankServer';
import { TokenManager } from '../logic/tokenManager';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [networkState, setNetworkState] = useState(NETWORK_STATE.ONLINE);
  const [balance, setBalance] = useState(50000);
  const [offlineBalance, setOfflineBalance] = useState(0);
  const [offlineTokens, setOfflineTokens] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [tamperDetected, setTamperDetected] = useState(false);

  // User Profile State
  const [user, setUser] = useState({
    name: 'Yashashwini Kumar',
    phone: '+91 98765 43210',
    email: 'yash@janpay.ai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    kycStatus: 'Verified',
    completion: 85
  });

  // Bank Management State
  const [linkedBanks, setLinkedBanks] = useState([
    {
      id: 'bank_01',
      name: 'HDFC Bank',
      holder: 'Yashashwini Kumar',
      accountNumber: 'XXXX XXXX 8921',
      ifsc: 'HDFC0001234',
      upiId: 'yash@hdfc',
      type: 'Savings',
      isPrimary: true,
      verified: true
    },
    {
      id: 'bank_02',
      name: 'ICICI Bank',
      holder: 'Yashashwini Kumar',
      accountNumber: 'XXXX XXXX 4452',
      ifsc: 'ICIC0005678',
      upiId: 'yash@icici',
      type: 'Current',
      isPrimary: false,
      verified: true
    }
  ]);

  // For PIN-authorized preloading
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadAmount, setPreloadAmount] = useState(0);

  const syncEngineRef = useRef(null);
  const monitorRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const ledger = await TransactionQueue.getLedger();
        setHistory(ledger);
        const b = await BankServer.getBalance();
        const t = TokenManager.getTokens();
        setBalance(b);
        setOfflineTokens(t);
        setOfflineBalance(t.reduce((sum, tk) => sum + tk.amount, 0));

        syncEngineRef.current = new SyncEngine((state) => setNetworkState(state));
        monitorRef.current = new ConnectivityMonitor((state) => {
          setNetworkState(state);
          if (state === NETWORK_STATE.RECONNECTED || state === NETWORK_STATE.ONLINE) {
            syncEngineRef.current.startSync();
          }
        });
        monitorRef.current.start();
      } catch (e) {
        if (e.message === 'TAMPER_DETECTED') setTamperDetected(true);
      }
    };
    init();
    return () => { if (monitorRef.current) monitorRef.current.stop(); };
  }, []);

  const navigateTo = (screen, data = null) => {
    if (data) setPendingTransaction(data);
    setCurrentScreen(screen);
  };

  // Preloading now requires PIN auth
  const requestPreload = (amount) => {
    setPreloadAmount(amount);
    setIsPreloading(true);
    navigateTo('pin', { amount, receiver: 'OFFLINE_RESERVE', isPreload: true });
  };

  const convertToTokens = async (amount) => {
    if (balance < amount) return false;
    
    const currentOffline = TokenManager.getTotalBalance();
    if (currentOffline + amount > 1000) {
      console.error('Holding limit exceeded');
      return false;
    }

    const newToken = await BankServer.signToken(amount);
    const newBalance = balance - amount;
    await BankServer.updateBalance(newBalance);
    await TokenManager.addToken(newToken);
    
    setBalance(newBalance);
    const updatedTokens = TokenManager.getTokens();
    setOfflineTokens(updatedTokens);
    setOfflineBalance(updatedTokens.reduce((sum, t) => sum + t.amount, 0));
    setIsPreloading(false);
    setPreloadAmount(0);
    return true;
  };

  const confirmTransaction = async () => {
    if (!pendingTransaction) return;

    // Handle PIN-authorized preloading
    if (pendingTransaction.isPreload) {
      await convertToTokens(pendingTransaction.amount);
      setPendingTransaction(null);
      navigateTo('home');
      return;
    }

    const isOffline = networkState === NETWORK_STATE.OFFLINE || networkState === NETWORK_STATE.UNSTABLE;
    const status = isOffline ? 'Pending' : 'Success';
    const type = isOffline ? 'Offline' : 'Online';

    if (!isOffline) {
      const newBalance = balance - pendingTransaction.amount;
      await BankServer.updateBalance(newBalance);
      setBalance(newBalance);
    } else {
      await TokenManager.useToken(pendingTransaction.amount);
      const updatedTokens = TokenManager.getTokens();
      setOfflineTokens(updatedTokens);
      setOfflineBalance(updatedTokens.reduce((sum, t) => sum + t.amount, 0));
    }

    const tx = {
      ...pendingTransaction,
      id: crypto.randomUUID(),
      type,
      status,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const securedTx = await TransactionQueue.addTransaction(tx);
    const updatedHistory = await TransactionQueue.getLedger();
    setHistory(updatedHistory);
    
    setLastTransaction(securedTx);
    setPendingTransaction(null);
    setCurrentScreen('success');
  };

  const switchPrimaryBank = (bankId) => {
    setLinkedBanks(prev => prev.map(bank => ({
      ...bank,
      isPrimary: bank.id === bankId
    })));
  };

  const isOnline = networkState === NETWORK_STATE.ONLINE || networkState === NETWORK_STATE.SYNCING || networkState === NETWORK_STATE.RECONNECTED;

  return (
    <AppContext.Provider value={{
      balance,
      offlineBalance,
      offlineTokens,
      history,
      isOnline,
      networkState,
      tamperDetected,
      currentScreen,
      pendingTransaction,
      lastTransaction,
      user,
      linkedBanks,
      setUser,
      setLinkedBanks,
      switchPrimaryBank,
      navigateTo,
      requestPreload,
      confirmTransaction,
      convertToTokens,
      setCurrentScreen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
