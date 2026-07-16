const express = require('express');
const cors = require('cors');
const deviceRoutes = require('./routes/deviceRoutes');
const authRoutes = require('./routes/authRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Backend is running' });
  });

  app.use(authRoutes);
  app.use(deviceRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
