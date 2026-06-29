/**
 * Server entry point.
 * Loads env, creates the Express app, starts listening.
 */
require('dotenv').config();
const { createApp } = require('./app');

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
  console.info(`[server] Metro Fit API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
