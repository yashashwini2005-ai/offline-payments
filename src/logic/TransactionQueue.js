import { SecurityManager } from './SecurityManager';

/**
 * TransactionQueue.js
 * Manages the encrypted local ledger and ensures data integrity.
 */

const STORAGE_KEY = 'janpay_secure_ledger';

export class TransactionQueue {
  static async getLedger() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    try {
      const encrypted = JSON.parse(raw);
      const ledger = await SecurityManager.decrypt(encrypted);
      
      // Integrity check: Validate hash chain
      for (let i = 1; i < ledger.length; i++) {
        const expectedHash = await SecurityManager.hash(ledger[i-1]);
        if (ledger[i].prevHash !== expectedHash) {
          throw new Error('TAMPER_DETECTED');
        }
      }
      
      return ledger;
    } catch (e) {
      if (e.message === 'TAMPER_DETECTED') throw e;
      return [];
    }
  }

  static async addTransaction(tx) {
    const ledger = await this.getLedger();
    const prevHash = ledger.length > 0 ? await SecurityManager.hash(ledger[ledger.length - 1]) : 'GENESIS';
    
    const entry = {
      ...tx,
      prevHash,
      nonce: SecurityManager.generateNonce(),
      timestamp: Date.now()
    };
    
    const hash = await SecurityManager.hash(entry);
    const finalEntry = { ...entry, hash };
    
    const newLedger = [...ledger, finalEntry];
    const encrypted = await SecurityManager.encrypt(newLedger);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
    
    return finalEntry;
  }

  static async updateStatus(txId, status) {
    const ledger = await this.getLedger();
    const index = ledger.findIndex(t => t.id === txId);
    if (index === -1) return;
    
    ledger[index].status = status;
    const encrypted = await SecurityManager.encrypt(ledger);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
  }

  static async clearSynced() {
    const ledger = await this.getLedger();
    const remaining = ledger.filter(t => t.status === 'Pending');
    const encrypted = await SecurityManager.encrypt(remaining);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
  }
}
