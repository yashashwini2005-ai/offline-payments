/**
 * SecurityManager.js
 * Handles encryption, hashing, and tamper detection logic.
 */

const MASTER_KEY_SEED = 'JANPAY_SECURE_SEED_2024';

export class SecurityManager {
  static async generateKey() {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(MASTER_KEY_SEED),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('static_salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data) {
    const key = await this.generateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encoded = encoder.encode(JSON.stringify(data));
    
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );
    
    return {
      iv: btoa(String.fromCharCode(...iv)),
      content: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
    };
  }

  static async decrypt(encryptedData) {
    try {
      const key = await this.generateKey();
      const iv = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
      const ciphertext = new Uint8Array(atob(encryptedData.content).split('').map(c => c.charCodeAt(0)));
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );
      
      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decrypted));
    } catch (e) {
      console.error('Decryption failed - possible tampering detected');
      throw new Error('TAMPER_DETECTED');
    }
  }

  static async hash(data) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  static generateNonce() {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  }
}
