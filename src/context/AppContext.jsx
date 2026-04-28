import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ConnectivityMonitor, NETWORK_STATE } from '../logic/ConnectivityMonitor';
import { TransactionQueue } from '../logic/TransactionQueue';
import { SyncEngine } from '../logic/SyncEngine';
import { BankServer } from '../logic/bankServer';
import { TokenManager } from '../logic/tokenManager';
import { sendDiscordNotification } from '../services/discordWebhook';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [networkState, setNetworkState] = useState(NETWORK_STATE.ONLINE);
  const [balance, setBalance] = useState(50000);
  const [offlineBalance, setOfflineBalance] = useState(0);
  const [offlineTokens, setOfflineTokens] = useState([]);
  const [history, setHistory] = useState([]);
  const [tokenActivities, setTokenActivities] = useState([]);
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

        const refreshHistory = async () => {
          const updatedLedger = await TransactionQueue.getLedger();
          setHistory(updatedLedger);
        };

        syncEngineRef.current = new SyncEngine((state) => {
          setNetworkState(state);
          // Discord: Sync failure notification
          if (state === 'SYNC_FAILED') {
            sendDiscordNotification('SYNC_FAILED', {
              user: 'Yashashwini Kumar',
              status: 'Sync Failed',
              details: 'Transaction ledger sync failed. Exponential backoff retry scheduled.'
            });
          }
          // Discord: Sync complete notification
          if (state === 'ONLINE' && syncEngineRef.current?.retryCount === 0) {
            sendDiscordNotification('SYNC_COMPLETE', {
              user: 'Yashashwini Kumar',
              status: 'Synced Successfully',
              details: 'All pending offline transactions uploaded to ledger.'
            });
          }
        }, refreshHistory);
        monitorRef.current = new ConnectivityMonitor((state) => {
          setNetworkState(state);
          // Discord: Network status switch notification
          if (state === NETWORK_STATE.RECONNECTED || state === NETWORK_STATE.OFFLINE) {
            sendDiscordNotification('NETWORK_SWITCH', {
              user: 'Yashashwini Kumar',
              mode: state === NETWORK_STATE.OFFLINE ? 'OFFLINE' : 'ONLINE (Reconnected)',
              status: state,
              details: 'Wallet mode switched automatically by ConnectivityMonitor.'
            });
          }
          if (state === NETWORK_STATE.RECONNECTED || state === NETWORK_STATE.ONLINE) {
            syncEngineRef.current.startSync();
          }
        });
        monitorRef.current.start();
      } catch (e) {
        if (e.message === 'TAMPER_DETECTED') {
          setTamperDetected(true);
          // Discord: Fraud / double-spend alert
          sendDiscordNotification('FRAUD_ALERT', {
            user: 'Yashashwini Kumar',
            status: 'TAMPER DETECTED',
            details: 'Cryptographic signature mismatch — possible double-spend or token replay attack detected.'
          });
        }
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
    
    // Log Activity
    const activity = {
      id: crypto.randomUUID(),
      action: 'Created',
      amount,
      status: 'Success',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'Online',
      tokenId: `TK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      remarks: 'Reserve Authorized'
    };
    setTokenActivities(prev => [activity, ...prev]);

    // Discord: Tokens loaded notification
    sendDiscordNotification('TOKENS_LOADED', {
      user: user.name,
      amount: amount,
      tokenCount: TokenManager.getTokens().length,
      mode: 'Online',
      status: 'Reserve Authorized'
    });

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

    // Handle Bank Transfer
    if (pendingTransaction.type === 'BANK_TRANSFER') {
      const isOffline = networkState === NETWORK_STATE.OFFLINE || networkState === NETWORK_STATE.UNSTABLE;
      if (isOffline) return; // caught by UI

      const newBalance = balance - pendingTransaction.amount;
      await BankServer.updateBalance(newBalance);
      setBalance(newBalance);

      const tx = {
        ...pendingTransaction,
        id: crypto.randomUUID(),
        status: 'Success',
        mode: 'Online',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      await TransactionQueue.addTransaction(tx);
      const updatedHistory = await TransactionQueue.getLedger();
      setHistory(updatedHistory);
      setLastTransaction(tx);
      setPendingTransaction(null);
      setCurrentScreen('success');
      // Discord: Bank transfer notification
      sendDiscordNotification('PAYMENT_SUCCESS', {
        user: user.name,
        amount: pendingTransaction.amount,
        receiver: pendingTransaction.receiverName,
        mode: 'Online – Bank Transfer',
        status: 'Success'
      });
      return;
    }

    const isOffline = networkState === NETWORK_STATE.OFFLINE || networkState === NETWORK_STATE.UNSTABLE;
    const status = isOffline ? 'Pending' : 'Success';
    const type = isOffline ? 'Offline' : 'Online';

    if (!isOffline) {
      const newBalance = balance - pendingTransaction.amount;
      await BankServer.updateBalance(newBalance);
      setBalance(newBalance);
      // Discord: Online payment notification
      sendDiscordNotification('PAYMENT_SUCCESS', {
        user: user.name,
        amount: pendingTransaction.amount,
        receiver: pendingTransaction.receiver,
        mode: 'Online',
        status: 'Success'
      });
    } else {
      await TokenManager.useToken(pendingTransaction.amount);
      const updatedTokens = TokenManager.getTokens();
      setOfflineTokens(updatedTokens);
      setOfflineBalance(updatedTokens.reduce((sum, t) => sum + t.amount, 0));

      // Log Activity for Offline Use
      const activity = {
        id: crypto.randomUUID(),
        action: 'Used',
        amount: pendingTransaction.amount,
        status: 'Success',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'Offline',
        tokenId: `TK-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        remarks: 'Payment Settled'
      };
      setTokenActivities(prev => [activity, ...prev]);
      // Discord: Offline payment notification
      sendDiscordNotification('OFFLINE_PAYMENT', {
        user: user.name,
        amount: pendingTransaction.amount,
        receiver: pendingTransaction.receiver,
        tokenCount: TokenManager.getTokens().length,
        mode: 'Offline',
        status: 'Pending Sync'
      });
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
      tokenActivities,
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
