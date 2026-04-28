/**
 * ConnectivityMonitor.js
 * Advanced network monitoring with latency detection.
 */

export const NETWORK_STATE = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  UNSTABLE: 'UNSTABLE',
  RECONNECTED: 'RECONNECTED'
};

export class ConnectivityMonitor {
  constructor(onStateChange) {
    this.onStateChange = onStateChange;
    this.state = navigator.onLine ? NETWORK_STATE.ONLINE : NETWORK_STATE.OFFLINE;
    this.latencyThreshold = 1000; // 1s
    this.interval = null;
    
    window.addEventListener('online', () => this.checkConnectivity());
    window.addEventListener('offline', () => this.updateState(NETWORK_STATE.OFFLINE));
  }

  start() {
    this.checkConnectivity();
    this.interval = setInterval(() => this.checkConnectivity(), 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  async checkConnectivity() {
    if (!navigator.onLine) {
      this.updateState(NETWORK_STATE.OFFLINE);
      return;
    }

    try {
      const start = Date.now();
      // Faster ping simulation
      await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
      const latency = Date.now() - start;

      if (latency > this.latencyThreshold) {
        this.updateState(NETWORK_STATE.UNSTABLE);
      } else {
        const newState = (this.state === NETWORK_STATE.OFFLINE || this.state === NETWORK_STATE.UNSTABLE) ? NETWORK_STATE.RECONNECTED : NETWORK_STATE.ONLINE;
        this.updateState(newState);
      }
    } catch (e) {
      this.updateState(NETWORK_STATE.OFFLINE);
    }
  }

  updateState(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.onStateChange(newState);
      
      // If reconnected, transition to online quickly after triggering sync
      if (newState === NETWORK_STATE.RECONNECTED) {
        setTimeout(() => this.updateState(NETWORK_STATE.ONLINE), 400);
      }
    }
  }
}
