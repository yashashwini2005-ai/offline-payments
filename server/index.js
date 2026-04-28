/**
 * server/index.js
 * JanPay Notification API Server
 * Exposes POST /notify — calls Discord webhook after transaction sync.
 *
 * Start with: node server/index.js
 * Or:         npm run server
 */

require('dotenv').config(); // Load .env variables into process.env

const express = require('express');
const cors    = require('cors');
const { sendDiscordNotification } = require('./discordService');

const app  = express();
const PORT = process.env.SERVER_PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());               // Allow calls from the Vite frontend (localhost:5173)
app.use(express.json());       // Parse JSON request bodies

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ service: 'JanPay Notification API', status: 'running', version: '1.0.0' });
});

// ── POST /notify ─────────────────────────────────────────────────────────────
/**
 * Receives transaction metadata after a sync event and forwards
 * a rich Discord notification to the configured webhook channel.
 *
 * Request body (all fields required):
 * {
 *   transactionId : string   — Unique TX identifier
 *   amount        : number   — Payment amount in INR
 *   merchant      : string   — Payee / merchant name
 *   status        : string   — 'SUCCESS' | 'PENDING' | 'FAILED' | 'SYNCED'
 *   timestamp     : string   — ISO 8601 timestamp of the transaction
 * }
 */
app.post('/notify', async (req, res) => {
  const { transactionId, amount, merchant, status, timestamp } = req.body;

  // ── Validation ────────────────────────────────────────────────────────────
  if (!transactionId || !amount || !merchant || !status || !timestamp) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: transactionId, amount, merchant, status, timestamp'
    });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'amount must be a positive number'
    });
  }

  // ── Send Discord Notification ─────────────────────────────────────────────
  try {
    await sendDiscordNotification({ transactionId, amount, merchant, status, timestamp });

    console.log(`[/notify] TX ${transactionId} | ₹${amount} | ${merchant} | ${status}`);

    return res.status(200).json({
      success: true,
      message: 'Discord notification dispatched successfully',
      data: { transactionId, amount, merchant, status, timestamp }
    });
  } catch (err) {
    // The Discord service handles its own errors silently, but catch anything unexpected
    console.error('[/notify] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while sending notification'
    });
  }
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 JanPay Notification API running at http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/notify\n`);
});
