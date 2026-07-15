import { Alert, Box, Container, Fade, Stack, Typography } from '@mui/material';
import { DeviceCard } from '../components/DeviceCard';
import { useSnackbar } from '../components/SnackbarProvider';
import { useDeviceControl } from '../hooks/useDeviceControl';
import type { DeviceInfo } from '../types/device';
import { useEffect } from 'react';

const initialDevice: DeviceInfo = {
  id: 'pump001',
  name: 'Pump-001',
  connectionState: 'Online',
  relayState: 'OFF'
};

export function HomePage() {
  const { showMessage } = useSnackbar();
  const { relayState, isSubmitting, feedback, turnOff, turnOn } = useDeviceControl(initialDevice.relayState);

  useEffect(() => {
    if (feedback) {
      showMessage(feedback.message, feedback.type);
    }
  }, [feedback, showMessage]);

  const device = {
    ...initialDevice,
    relayState
  } satisfies DeviceInfo;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(106, 228, 255, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(143, 123, 255, 0.16), transparent 26%), linear-gradient(180deg, #08111f 0%, #0b1628 100%)'
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="primary.main" letterSpacing={2}>
              IoT Control Center
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
              ESP32-S3 Pump Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 720 }}>
              Monitor the pump device and control the relay from a responsive, dark-mode dashboard built for production use.
            </Typography>
          </Box>

          {device.connectionState === 'Offline' ? (
            <Alert severity="warning">The device is offline. Command actions may fail until connectivity is restored.</Alert>
          ) : null}

          <Fade in timeout={500}>
            <Box>
              <DeviceCard device={device} isSubmitting={isSubmitting} onTurnOn={turnOn} onTurnOff={turnOff} />
            </Box>
          </Fade>
        </Stack>
      </Container>
    </Box>
  );
}
