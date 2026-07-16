const DEFAULT_DEVICE_STATE = {
  id: null,
  relayState: 'OFF',
  status: 'Offline',
  lastHeartbeat: null,
  updatedAt: null
};

const deviceStore = new Map();

function normalizeDeviceId(id) {
  return String(id || '').trim().toLowerCase();
}

function ensureDevice(id) {
  const normalizedId = normalizeDeviceId(id);

  if (!normalizedId) {
    return null;
  }

  if (!deviceStore.has(normalizedId)) {
    deviceStore.set(normalizedId, {
      ...DEFAULT_DEVICE_STATE,
      id: normalizedId,
      updatedAt: new Date().toISOString()
    });
  }

  return deviceStore.get(normalizedId);
}

function updateDeviceRelayState(id, relayState) {
  const device = ensureDevice(id);

  if (!device) {
    return null;
  }

  const updatedDevice = {
    ...device,
    relayState,
    status: 'Online',
    updatedAt: new Date().toISOString()
  };

  deviceStore.set(updatedDevice.id, updatedDevice);
  return updatedDevice;
}

function getDevice(id) {
  const device = ensureDevice(id);
  if (device && device.status === 'Online' && device.lastHeartbeat) {
    const elapsed = Date.now() - new Date(device.lastHeartbeat).getTime();
    if (elapsed > 10000) { // 10 seconds timeout
      device.status = 'Offline';
      device.updatedAt = new Date().toISOString();
      deviceStore.set(device.id, device);
    }
  }
  return device;
}

function updateDeviceHeartbeat(id) {
  const device = ensureDevice(id);
  if (!device) {
    return null;
  }

  const updatedDevice = {
    ...device,
    status: 'Online',
    lastHeartbeat: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  deviceStore.set(updatedDevice.id, updatedDevice);
  return updatedDevice;
}

function resetDeviceStatus(id) {
  const device = ensureDevice(id);

  if (!device) {
    return null;
  }

  const updatedDevice = {
    ...device,
    status: 'Offline',
    updatedAt: new Date().toISOString()
  };

  deviceStore.set(updatedDevice.id, updatedDevice);
  return updatedDevice;
}

module.exports = {
  getDevice,
  normalizeDeviceId,
  resetDeviceStatus,
  updateDeviceRelayState,
  updateDeviceHeartbeat
};
