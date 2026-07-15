import { api } from './api';

export const turnPumpOn = async () => {
  const response = await api.post('/api/device/pump001/on');
  return response.data;
};

export const turnPumpOff = async () => {
  const response = await api.post('/api/device/pump001/off');
  return response.data;
};
