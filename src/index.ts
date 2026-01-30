import 'dotenv/config';
import express from 'express';
import { startBot } from './bot.js';

const PORT = process.env.PORT || 3000;

// Health check server for Render keep-alive
const app = express();

app.get('/health', (_req, res) => {
  res.send('OK');
});

app.get('/', (_req, res) => {
  res.send('PostHog Discord Bot is running');
});

// Start health server
app.listen(PORT, () => {
  console.log(`Health server listening on port ${PORT}`);
});

// Start Discord bot
startBot();
