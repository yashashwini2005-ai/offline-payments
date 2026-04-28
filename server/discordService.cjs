/**
 * server/discordService.cjs
 * Backend Discord webhook service for JanPay API notifications.
 * Reads VITE_DISCORD_WEBHOOK_URL from .env via dotenv.
 */

const sendDiscordNotification = async ({ transactionId, amount, merchant, status, timestamp }) => {
  const webhookUrl = process.env.VITE_DISCORD_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl === 'your_discord_webhook_url') {
    console.warn('[Discord] Webhook URL not configured. Skipping notification.');
    return;
  }

  const isFraud = status?.toUpperCase() === 'FRAUD_ALERT';

  const statusMap = {
    SUCCESS:     { color: 0x22C55E, icon: '✅' },
    PENDING:     { color: 0xF59E0B, icon: '⏳' },
    FAILED:      { color: 0xEF4444, icon: '❌' },
    SYNCED:      { color: 0x3B82F6, icon: '📡' },
    FRAUD_ALERT: { color: 0xB91C1C, icon: '🚨' },
  };
  const style = statusMap[status?.toUpperCase()] || { color: 0x6B7280, icon: '🔔' };

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        day: '2-digit', month: 'short', year: 'numeric', hour12: true
      })
    : new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  // ── Fraud Alert — dedicated rich embed ──────────────────────────────────────
  const embed = isFraud
    ? {
        title: '⚠️ Fraud Alert Detected',
        color: 0xB91C1C,
        timestamp: new Date().toISOString(),
        footer: { text: 'JanPay Security Monitor • PIN Brute-Force Detection' },
        fields: [
          { name: '🔴 Reason',   value: 'Multiple incorrect PIN attempts', inline: false },
          { name: '🔢 Attempts', value: `3 / 3 (Maximum reached)`,          inline: true  },
          { name: '🕒 Time',     value: formattedTime,                      inline: true  },
          { name: '🔒 Action',   value: 'Access temporarily blocked (30s)', inline: false },
          { name: '📢 Alert',    value: 'Security monitoring team notified', inline: false },
        ]
      }
    : {
        title: `${style.icon} JanPay — Transaction ${status}`,
        color: style.color,
        timestamp: new Date().toISOString(),
        footer: { text: 'JanPay Secure Settlement Engine • POST /notify' },
        fields: [
          { name: '🧾 Transaction ID', value: `\`${transactionId}\``, inline: false },
          { name: '💰 Amount',         value: `₹${Number(amount).toLocaleString('en-IN')}`, inline: true },
          { name: '🏪 Merchant',       value: merchant || 'N/A', inline: true },
          { name: '📊 Status',         value: status,  inline: true },
          { name: '🕒 Time',           value: formattedTime, inline: false },
        ]
      };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!response.ok) {
      console.error(`[Discord] Webhook failed: ${response.status} ${response.statusText}`);
    } else {
      console.log(`[Discord] Notification sent for TX ${transactionId}`);
    }
  } catch (err) {
    console.error('[Discord] Network error:', err.message);
  }
};

module.exports = { sendDiscordNotification };
