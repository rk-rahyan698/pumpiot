import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import type { DeviceInfo } from '../types/device';

interface DeviceCardProps {
  device: DeviceInfo;
  isSubmitting: boolean;
  onTurnOn: () => void;
  onTurnOff: () => void;
}

export function DeviceCard({ device, isSubmitting, onTurnOn, onTurnOff }: DeviceCardProps) {
  return (
    <Card elevation={10} sx={{ width: '100%', overflow: 'hidden' }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                ESP32-S3 Device
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.5 }}>
                {device.name}
              </Typography>
            </Box>
            <Chip
              label={device.connectionState}
              color={device.connectionState === 'Online' ? 'success' : 'default'}
              variant={device.connectionState === 'Online' ? 'filled' : 'outlined'}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)' }}>
              <Typography variant="body2" color="text.secondary">
                Device ID
              </Typography>
              <Typography variant="h6">{device.id}</Typography>
            </Box>
            <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)' }}>
              <Typography variant="body2" color="text.secondary">
                Relay Status
              </Typography>
              <Typography variant="h6" color={device.relayState === 'ON' ? 'success.main' : 'text.primary'}>
                {device.relayState}
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={onTurnOn}
              disabled={isSubmitting || device.relayState === 'ON'}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PowerSettingsNewIcon />}
            >
              Turn ON
            </Button>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={onTurnOff}
              disabled={isSubmitting || device.relayState === 'OFF'}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PowerSettingsNewIcon />}
            >
              Turn OFF
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
