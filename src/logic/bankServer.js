// Simulated Central Bank Server
const WALLET_KEY = 'upi_wallet_balance';
const MASTER_SECRET = 'janpay-secure-secret-2024';

export class BankServer {
  static async getBalance() {
    const balance = localStorage.getItem(WALLET_KEY);
    if (balance === null) {
      localStorage.setItem(WALLET_KEY, '10000');
      return 10000;
    }
    return parseFloat(balance);
  }

  static async updateBalance(newBalance) {
    localStorage.setItem(WALLET_KEY, newBalance.toString());
  }

  static async signToken(amount) {
    const encoder = new TextEncoder();
    const data = {
      id: crypto.randomUUID(),
      amount,
      timestamp: Date.now()
    };
    
    const message = JSON.stringify(data);
    const keyData = encoder.encode(MASTER_SECRET);
    const msgData = encoder.encode(message);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      msgData
    );

    return {
      ...data,
      signature: btoa(String.fromCharCode(...new Uint8Array(signature)))
    };
  }

  static async verifyToken(token) {
    const { signature, ...data } = token;
    const encoder = new TextEncoder();
    const message = JSON.stringify(data);
    const keyData = encoder.encode(MASTER_SECRET);
    const msgData = encoder.encode(message);
    const sigData = new Uint8Array(atob(signature).split('').map(c => c.charCodeAt(0)));

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigData,
      msgData
    );
  }
}
