const { getDevice, normalizeDeviceId, updateDeviceRelayState, updateDeviceHeartbeat } = require('../models/deviceStore');

function buildResponse(device) {
  return {
    success: true,
    data: {
      id: device.id,
      status: device.status,
      relayState: device.relayState,
      updatedAt: device.updatedAt
    }
  };
}

function getDeviceState(id) {
  const normalizedId = normalizeDeviceId(id);
  const device = getDevice(normalizedId);

  if (!device) {
    const error = new Error('Device not found');
    error.statusCode = 404;
    throw error;
  }

  return buildResponse(device);
}

function turnDeviceOn(id) {
  const normalizedId = normalizeDeviceId(id);
  const device = updateDeviceRelayState(normalizedId, 'ON');

  if (!device) {
    const error = new Error('Device not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    success: true,
    message: `Device ${device.id} relay turned ON`,
    data: {
      id: device.id,
      status: device.status,
      relayState: device.relayState,
      updatedAt: device.updatedAt
    }
  };
}

function turnDeviceOff(id) {
  const normalizedId = normalizeDeviceId(id);
  const device = updateDeviceRelayState(normalizedId, 'OFF');

  if (!device) {
    const error = new Error('Device not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    success: true,
    message: `Device ${device.id} relay turned OFF`,
    data: {
      id: device.id,
      status: device.status,
      relayState: device.relayState,
      updatedAt: device.updatedAt
    }
  };
}

function registerDeviceHeartbeat(id) {
  const normalizedId = normalizeDeviceId(id);
  const device = updateDeviceHeartbeat(normalizedId);

  if (!device) {
    const error = new Error('Device not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    success: true,
    data: {
      id: device.id,
      status: device.status,
      relayState: device.relayState,
      updatedAt: device.updatedAt
    }
  };
}

module.exports = {
  getDeviceState,
  turnDeviceOff,
  turnDeviceOn,
  registerDeviceHeartbeat
};
