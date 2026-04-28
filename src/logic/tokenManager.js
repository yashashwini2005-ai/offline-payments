import { BankServer } from './bankServer';

const TOKENS_KEY = 'offline_tokens_list';

export class TokenManager {
  static getTokens() {
    const tokens = localStorage.getItem(TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : [];
  }

  static saveTokens(tokens) {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  }

  static async addToken(token) {
    const tokens = this.getTokens();
    tokens.push(token);
    this.saveTokens(tokens);
  }

  static async useToken(amount) {
    const tokens = this.getTokens();
    // Find tokens that can cover the amount
    const sortedTokens = [...tokens].sort((a, b) => a.amount - b.amount);
    
    let totalFound = 0;
    const tokensToUse = [];
    const remainingTokens = [];

    for (const token of sortedTokens) {
      if (totalFound < amount) {
        // Verify token before using
        const isValid = await BankServer.verifyToken(token);
        if (isValid) {
          totalFound += token.amount;
          tokensToUse.push(token);
        } else {
          console.error('Invalid token detected!', token);
        }
      } else {
        remainingTokens.push(token);
      }
    }

    if (totalFound < amount) {
      throw new Error('Insufficient offline tokens');
    }

    // Handle Change (Splitting)
    if (totalFound > amount) {
      const change = totalFound - amount;
      const changeToken = await BankServer.signToken(change);
      remainingTokens.push(changeToken);
    }

    this.saveTokens(remainingTokens);
    return true;
  }

  static getTotalBalance() {
    return this.getTokens().reduce((sum, t) => sum + t.amount, 0);
  }
}
