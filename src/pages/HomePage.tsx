import { Alert, Box, Container, Fade, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import { DeviceCard } from '../components/DeviceCard';
import { useSnackbar } from '../components/SnackbarProvider';
import { useDeviceControl } from '../hooks/useDeviceControl';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import type { DeviceInfo } from '../types/device';
import { useEffect } from 'react';

const initialDevice: DeviceInfo = {
  id: 'pump001',
  name: 'Pump-001',
  connectionState: 'Online',
  relayState: 'OFF'
};

export function HomePage() {
  const { user, isAuthenticated, logout, setCurrentPage } = useAuth();
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPage('login');
    }
  }, [isAuthenticated, setCurrentPage]);

  const { relayState, connectionState, isSubmitting, feedback, turnOff, turnOn } = useDeviceControl(initialDevice.id, initialDevice.relayState);

  useEffect(() => {
    if (feedback) {
      showMessage(feedback.message, feedback.type);
    }
  }, [feedback, showMessage]);

  if (!isAuthenticated) {
    return null;
  }

  const device = {
    ...initialDevice,
    relayState,
    connectionState
  } satisfies DeviceInfo;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(106, 228, 255, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(143, 123, 255, 0.16), transparent 26%), linear-gradient(180deg, #08111f 0%, #0b1628 100%)'
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          bgcolor: 'rgba(8, 17, 31, 0.7)',
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }}
      >
        <Container maxWidth="md">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: 72 }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
              onClick={() => setCurrentPage('landing')}
            >
              <Box component="span" sx={{ color: 'primary.main' }}>⚡</Box> IoT Control Center
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
                Root Admin: <strong>{user?.username}</strong>
              </Typography>
              
              <Tooltip title="Account Settings">
                <IconButton onClick={() => setCurrentPage('settings')} sx={{ color: 'text.primary' }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Log Out">
                <IconButton onClick={logout} sx={{ color: 'error.main' }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="primary.main" letterSpacing={2}>
              IoT Device Dashboard
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
              ESP32-S3 Pump Control
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
