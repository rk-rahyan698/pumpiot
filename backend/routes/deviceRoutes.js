const { Router } = require('express');
const {
  handleGetDevice,
  handleTurnOffDevice,
  handleTurnOnDevice
} = require('../controllers/deviceController');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.get('/api/device/:id', authMiddleware, handleGetDevice);
router.post('/api/device/:id/on', authMiddleware, handleTurnOnDevice);
router.post('/api/device/:id/off', authMiddleware, handleTurnOffDevice);

module.exports = router;
