/**
 * BankServer.js
 * Simulated Central Bank Server for wallet management and token signing.
 * Implements HMAC-SHA256 digital signatures using Web Crypto API.
 */

const MASTER_SECRET = 'JANPAY_BANK_MASTER_KEY_2024';
const INITIAL_BALANCE = 50000;

export class BankServer {
  static async getBalance() {
    const b = localStorage.getItem('upi_wallet_balance');
    if (b === null) {
      // First time initialization
      localStorage.setItem('upi_wallet_balance', INITIAL_BALANCE.toString());
      return INITIAL_BALANCE;
    }
    return parseFloat(b);
  }

  static async updateBalance(newBalance) {
    localStorage.setItem('upi_wallet_balance', newBalance.toString());
  }

  static async signToken(amount) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(MASTER_SECRET);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const tokenId = crypto.randomUUID();
    const timestamp = Date.now();
    const expiry = timestamp + (48 * 60 * 60 * 1000); // 48 Hours Expiry for production simulation

    const payload = JSON.stringify({
      id: tokenId,
      amount,
      timestamp,
      expiry,
      bankId: 'JANPAY_CENTRAL_BANK',
      authorizedBy: 'RESERVE_BANK_SIM'
    });

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    );

    return {
      id: tokenId,
      amount,
      timestamp,
      expiry,
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      payload
    };
  }

  static async verifyToken(token) {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(MASTER_SECRET);
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const signature = new Uint8Array(
        atob(token.signature).split('').map(c => c.charCodeAt(0))
      );

      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signature,
        encoder.encode(token.payload)
      );

      const isExpired = Date.now() > token.expiry;

      return isValid && !isExpired;
    } catch (e) {
      console.error('Cryptographic Verification Failed:', e);
      return false;
    }
  }
}
