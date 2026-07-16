const { Router } = require('express');
const {
  handleGetDevice,
  handleTurnOffDevice,
  handleTurnOnDevice,
  handleIotPoll
} = require('../controllers/deviceController');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.get('/api/device/:id', authMiddleware, handleGetDevice);
router.post('/api/device/:id/on', authMiddleware, handleTurnOnDevice);
router.post('/api/device/:id/off', authMiddleware, handleTurnOffDevice);

// IoT unauthenticated routes for the ESP32-S3 hardware
router.post('/api/iot/device/:id/poll', handleIotPoll);

module.exports = router;
