/**
 * server/index.cjs
 * JanPay Notification API Server
 * Exposes POST /notify — calls Discord webhook after transaction sync.
 *
 * Start: npm run server
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const { sendDiscordNotification } = require('./discordService.cjs');

const app  = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ service: 'JanPay Notification API', status: 'running', version: '1.0.0' });
});

/**
 * POST /notify
 * Receives transaction metadata after sync and fires a Discord notification.
 *
 * Body:
 * {
 *   transactionId : string  — Unique TX identifier
 *   amount        : number  — Payment amount in INR (positive number)
 *   merchant      : string  — Payee / merchant name
 *   status        : string  — 'SUCCESS' | 'PENDING' | 'FAILED' | 'SYNCED'
 *   timestamp     : string  — ISO 8601 timestamp
 * }
 */
app.post('/notify', async (req, res) => {
  const { transactionId, amount, merchant, status, timestamp } = req.body;

  // Validate required fields
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

  try {
    await sendDiscordNotification({ transactionId, amount, merchant, status, timestamp });

    console.log(`[/notify] ✅ TX ${transactionId} | ₹${amount} | ${merchant} | ${status}`);

    return res.status(200).json({
      success: true,
      message: 'Discord notification dispatched successfully',
      data: { transactionId, amount, merchant, status, timestamp }
    });
  } catch (err) {
    console.error('[/notify] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀  JanPay Notification API  →  http://localhost:${PORT}`);
  console.log(`    POST http://localhost:${PORT}/notify\n`);
});
