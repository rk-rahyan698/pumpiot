import { useCallback, useEffect, useState } from 'react';
import { getDeviceState, turnPumpOff, turnPumpOn } from '../services/deviceService';
import type { DeviceConnectionState, DeviceRelayState } from '../types/device';

export function useDeviceControl(deviceId: string, initialRelayState: DeviceRelayState) {
  const [relayState, setRelayState] = useState<DeviceRelayState>(initialRelayState);
  const [connectionState, setConnectionState] = useState<DeviceConnectionState>('Offline');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const response = await getDeviceState(deviceId);
      if (response && response.success && response.data) {
        // Only update local state if we aren't currently submitting a turn ON/OFF request
        if (!isSubmitting) {
          setRelayState(response.data.relayState);
        }
        setConnectionState(response.data.status);
      }
    } catch (error) {
      console.error('Failed to fetch device state:', error);
    }
  }, [deviceId, isSubmitting]);

  // Poll state on mount and every 3 seconds
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const execute = useCallback(async (nextState: DeviceRelayState) => {
    setIsSubmitting(true);
    clearFeedback();

    try {
      if (nextState === 'ON') {
        await turnPumpOn();
      } else {
        await turnPumpOff();
      }

      setRelayState(nextState);
      setFeedback({
        type: 'success',
        message: `Pump-001 relay turned ${nextState}`
      });
    } catch {
      setFeedback({
        type: 'error',
        message: `Unable to turn Pump-001 ${nextState.toLowerCase()}. Check the device connection and try again.`
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [clearFeedback]);

  return {
    relayState,
    connectionState,
    isSubmitting,
    feedback,
    clearFeedback,
    turnOn: () => execute('ON'),
    turnOff: () => execute('OFF')
  };
}
