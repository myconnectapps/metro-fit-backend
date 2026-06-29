/**
 * Express application factory.
 * Separated from server.js to enable supertest integration testing.
 */
const express = require('express');
const cors = require('cors');
const wellnessProfileRoutes = require('./features/wellness-profile/wellness-profile.routes');

function createApp() {
  const app = express();

  // ── Middleware ──────────────────────────────────────────────────────────────
  app.use(cors());
  app.use(express.json());

  // ── Health check ────────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // ── Feature routes ──────────────────────────────────────────────────────────
  app.use('/api/wellness-profile', wellnessProfileRoutes);

  // ── 404 handler ─────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
  });

  // ── Global error handler ────────────────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('[app] Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  });

  return app;
}

module.exports = { createApp };
