/**
 * discordWebhook.js
 * Professional Discord notification service for JanPay events.
 */

const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

/**
 * Sends a rich embed notification to Discord.
 * @param {string} type - Event type (e.g., 'PAYMENT', 'SYNC', 'FRAUD')
 * @param {object} data - Event metadata
 */
export const sendDiscordNotification = async (type, data) => {
  if (!WEBHOOK_URL || WEBHOOK_URL === 'your_discord_webhook_url') {
    // console.warn('Discord Webhook URL not configured correctly.');
    return;
  }

  const getEventStyle = (type) => {
    switch (type) {
      case 'PAYMENT_SUCCESS': return { color: 0x22C55E, title: '💳 Payment Completed' };
      case 'OFFLINE_PAYMENT': return { color: 0x3B82F6, title: '📶 Offline Payment Authorized' };
      case 'TOKENS_LOADED': return { color: 0xF59E0B, title: '🪙 Tokens Loaded' };
      case 'SYNC_COMPLETE': return { color: 0x8B5CF6, title: '📡 Synchronization Successful' };
      case 'SYNC_FAILED': return { color: 0xEF4444, title: '⚠️ Sync Failure Detected' };
      case 'FRAUD_ALERT': return { color: 0xB91C1C, title: '🚫 Security Breach / Fraud' };
      case 'NETWORK_SWITCH': return { color: 0x64748B, title: '🌐 Network Status Change' };
      default: return { color: 0x000000, title: '🔔 JanPay Alert' };
    }
  };

  const style = getEventStyle(type);
  const timestamp = new Date().toISOString();

  const embed = {
    title: style.title,
    color: style.color,
    timestamp: timestamp,
    footer: { text: 'JanPay Secure Settlement Engine' },
    fields: []
  };

  // Dynamically populate fields based on data
  if (data.user) embed.fields.push({ name: '👤 User', value: data.user, inline: true });
  if (data.amount) embed.fields.push({ name: '💰 Amount', value: `₹${data.amount}`, inline: true });
  if (data.receiver) embed.fields.push({ name: '📥 Receiver', value: data.receiver, inline: true });
  if (data.mode) embed.fields.push({ name: '📡 Mode', value: data.mode, inline: true });
  if (data.tokenCount) embed.fields.push({ name: '🔐 Tokens', value: String(data.tokenCount), inline: true });
  if (data.status) embed.fields.push({ name: '✅ Status', value: data.status, inline: true });
  if (data.details) embed.fields.push({ name: '📝 Details', value: data.details });

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!response.ok) {
      // Silently log failure in console as requested
      console.error('Discord Webhook failed:', response.statusText);
    }
  } catch (error) {
    console.error('Discord Notification Error:', error.message);
  }
};
