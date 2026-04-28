import { TransactionQueue } from './TransactionQueue';

/**
 * SyncEngine.js
 * Atomic batch synchronization with exponential backoff.
 */

export class SyncEngine {
  constructor(onStatusChange, onSyncComplete) {
    this.onStatusChange = onStatusChange;
    this.onSyncComplete = onSyncComplete;
    this.isSyncing = false;
    this.retryCount = 0;
  }

  async startSync() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    this.onStatusChange('SYNCING');

    try {
      const ledger = await TransactionQueue.getLedger();
      const pending = ledger.filter(tx => tx.status === 'Pending');
      
      if (pending.length === 0) {
        this.onStatusChange('ONLINE');
        this.isSyncing = false;
        return;
      }

      // Instant batch upload simulation
      console.log(`Syncing ${pending.length} transactions...`);
      // await new Promise(resolve => setTimeout(resolve, 0)); 

      // Simulate random network failure during sync
      if (Math.random() > 0.9) throw new Error('Network Fluctuation');

      // Update statuses to Success
      for (const tx of pending) {
        await TransactionQueue.updateStatus(tx.id, 'Success');
      }

      this.retryCount = 0;
      this.isSyncing = false;
      this.onStatusChange('ONLINE');
      if (this.onSyncComplete) this.onSyncComplete();
      console.log('Sync Complete');
    } catch (e) {
      console.error('Sync Failed:', e.message);
      this.isSyncing = false;
      this.onStatusChange('SYNC_FAILED');
      
      // Exponential backoff
      this.retryCount++;
      const delay = Math.min(30000, Math.pow(2, this.retryCount) * 1000);
      console.log(`Retrying in ${delay/1000}s...`);
      setTimeout(() => this.startSync(), delay);
    }
  }
}
