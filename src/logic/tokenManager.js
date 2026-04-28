import { BankServer } from './bankServer';

/**
 * TokenManager.js
 * Manages local offline token persistence, holding limits, and spending caps.
 */

const STORAGE_KEY = 'offline_tokens';
const LIMIT_KEY = 'offline_daily_limit';
const HOLDING_LIMIT = 1000;
const DAILY_SPENDING_LIMIT = 1000;

export class TokenManager {
  static getTokens() {
    const t = localStorage.getItem(STORAGE_KEY);
    return t ? JSON.parse(t) : [];
  }

  static saveTokens(tokens) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }

  static getDailySpent() {
    const data = localStorage.getItem(LIMIT_KEY);
    if (!data) return 0;
    try {
      const { date, amount } = JSON.parse(data);
      const today = new Date().toLocaleDateString();
      return date === today ? amount : 0;
    } catch (e) {
      return 0;
    }
  }

  static trackSpending(amount) {
    const current = this.getDailySpent();
    const today = new Date().toLocaleDateString();
    localStorage.setItem(LIMIT_KEY, JSON.stringify({
      date: today,
      amount: current + amount
    }));
  }

  static getTotalBalance() {
    const tokens = this.getTokens();
    return tokens.reduce((sum, t) => sum + t.amount, 0);
  }

  static async addToken(token) {
    const currentBalance = this.getTotalBalance();
    if (currentBalance + token.amount > HOLDING_LIMIT) {
      throw new Error(`HOLDING_LIMIT_EXCEEDED: Your offline reserve cannot exceed ₹${HOLDING_LIMIT}.`);
    }

    const tokens = this.getTokens();
    tokens.push(token);
    this.saveTokens(tokens);
  }

  static async useToken(amount) {
    const spentToday = this.getDailySpent();
    if (spentToday + amount > DAILY_SPENDING_LIMIT) {
      throw new Error(`DAILY_LIMIT_EXCEEDED: Daily offline spending limit is ₹${DAILY_SPENDING_LIMIT}.`);
    }

    let tokens = this.getTokens();
    const currentTotal = tokens.reduce((sum, t) => sum + t.amount, 0);
    
    if (currentTotal < amount) {
      throw new Error('INSUFFICIENT_OFFLINE_BALANCE: Not enough funds in offline reserve.');
    }

    // Consolidated verification & spending
    // We treat all tokens as a single pool for the UI/UX but keep them as individual signed assets internally
    tokens.sort((a, b) => b.amount - a.amount); // Largest first to cover amount efficiently

    let amountRemaining = amount;
    let remainingTokens = [];
    let usedTokens = [];

    for (const token of tokens) {
      if (amountRemaining > 0) {
        if (token.amount <= amountRemaining) {
          amountRemaining -= token.amount;
          usedTokens.push(token);
        } else {
          // Partial use of a large token
          const changeAmount = token.amount - amountRemaining;
          const changeToken = await BankServer.signToken(changeAmount);
          remainingTokens.push(changeToken);
          amountRemaining = 0;
          usedTokens.push(token);
        }
      } else {
        remainingTokens.push(token);
      }
    }

    if (amountRemaining > 0) {
      throw new Error('INSUFFICIENT_OFFLINE_TOKENS: Could not fulfill amount with existing tokens.');
    }

    this.saveTokens(remainingTokens);
    this.trackSpending(amount);
    return true;
  }
}
