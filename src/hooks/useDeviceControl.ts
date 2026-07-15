import { useCallback, useState } from 'react';
import { turnPumpOff, turnPumpOn } from '../services/deviceService';
import type { DeviceRelayState } from '../types/device';

export function useDeviceControl(initialRelayState: DeviceRelayState) {
  const [relayState, setRelayState] = useState<DeviceRelayState>(initialRelayState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

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
    isSubmitting,
    feedback,
    clearFeedback,
    turnOn: () => execute('ON'),
    turnOff: () => execute('OFF')
  };
}
