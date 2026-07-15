const { getDeviceState, turnDeviceOff, turnDeviceOn } = require('../services/deviceService');

function handleGetDevice(req, res, next) {
  try {
    const response = getDeviceState(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

function handleTurnOnDevice(req, res, next) {
  try {
    const response = turnDeviceOn(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

function handleTurnOffDevice(req, res, next) {
  try {
    const response = turnDeviceOff(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleGetDevice,
  handleTurnOffDevice,
  handleTurnOnDevice
};
