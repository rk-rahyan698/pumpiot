const { Router } = require('express');
const {
  handleGetDevice,
  handleTurnOffDevice,
  handleTurnOnDevice
} = require('../controllers/deviceController');

const router = Router();

router.get('/api/device/:id', handleGetDevice);
router.post('/api/device/:id/on', handleTurnOnDevice);
router.post('/api/device/:id/off', handleTurnOffDevice);

module.exports = router;
