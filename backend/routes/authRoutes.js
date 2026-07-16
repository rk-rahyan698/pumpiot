const { Router } = require('express');
const {
  handleGetStatus,
  handleSetup,
  handleLogin,
  handleUpdateSettings
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.get('/api/auth/status', handleGetStatus);
router.post('/api/auth/setup', handleSetup);
router.post('/api/auth/login', handleLogin);
router.put('/api/auth/settings', authMiddleware, handleUpdateSettings);

module.exports = router;
