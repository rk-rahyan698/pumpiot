import { Box, Button, Container, Grid, Paper, Stack, Typography, Card, CardContent, Fade } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StorageIcon from '@mui/icons-material/Storage';

export function LandingPage() {
  const { isAuthenticated, isSetupRequired, setCurrentPage } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(circle at top left, rgba(106, 228, 255, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(143, 123, 255, 0.16), transparent 26%), linear-gradient(180deg, #08111f 0%, #0b1628 100%)',
        py: 8
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={600}>
          <Stack spacing={6} alignItems="center" textAlign="center">
            {/* Header / Hero */}
            <Box>
              <Typography variant="overline" color="primary.main" letterSpacing={3} sx={{ fontWeight: 800 }}>
                IoT Control Gateway
              </Typography>
              <Typography variant="h2" sx={{ mt: 2, fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                Pump Control System
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}>
                Secure, low-latency administrator dashboard for controlling pump state and monitoring device parameters in real time.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                width: '100%',
                maxWidth: 480,
                borderRadius: 4,
                bgcolor: 'background.paper',
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Stack spacing={2}>
                {isSetupRequired ? (
                  <>
                    <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                      ⚠️ Setup Required: No administrator account exists yet.
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      onClick={() => setCurrentPage('setup')}
                      sx={{ height: 48 }}
                    >
                      Run First-Time Setup
                    </Button>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      ✓ You are securely authenticated.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() => setCurrentPage('dashboard')}
                      sx={{ height: 48, color: '#08111f' }}
                    >
                      Open Control Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Access is restricted to authorized personnel.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() => setCurrentPage('login')}
                      sx={{ height: 48, color: '#08111f' }}
                    >
                      Sign In to Admin Panel
                    </Button>
                  </>
                )}
              </Stack>
            </Paper>

            {/* Features Grid */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <ShieldIcon color="primary" sx={{ fontSize: 32, mt: 0.5 }} />
                    <Box textAlign="left">
                      <Typography variant="h6" gutterBottom>
                        Secure Access
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        JWT-tokenized authentication layer blocks unauthorized requests and controls endpoints safely.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <FlashOnIcon color="secondary" sx={{ fontSize: 32, mt: 0.5 }} />
                    <Box textAlign="left">
                      <Typography variant="h6" gutterBottom>
                        Instant Relay Command
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Low-latency, real-time command dispatch flows to turn physical pumps ON and OFF securely.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <StorageIcon color="secondary" sx={{ fontSize: 32, mt: 0.5 }} />
                    <Box textAlign="left">
                      <Typography variant="h6" gutterBottom>
                        SQLite Storage
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Credential and system configurations are persisted locally in a database utilizing salted bcrypt hashing.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <SettingsIcon color="primary" sx={{ fontSize: 32, mt: 0.5 }} />
                    <Box textAlign="left">
                      <Typography variant="h6" gutterBottom>
                        VPS Recovery Mechanism
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recover the Root Administrator account securely via temporary server environment flags.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Fade>
      </Container>
    </Box>
  );
}
