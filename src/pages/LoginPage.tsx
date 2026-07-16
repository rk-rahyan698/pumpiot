import React, { useState } from 'react';
import { Box, Button, Container, Paper, Stack, TextField, Typography, Alert, IconButton, InputAdornment, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export function LoginPage() {
  const { login, setCurrentPage } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please enter both your username/email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login(usernameOrEmail, password);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(circle at top left, rgba(106, 228, 255, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(143, 123, 255, 0.16), transparent 26%), linear-gradient(180deg, #08111f 0%, #0b1628 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3}>
          {/* Back Navigation */}
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setCurrentPage('landing')}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Back to Home
            </Button>
          </Box>

          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
                    Sign In
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Welcome back. Enter your credentials to access the Pump Control Dashboard.
                  </Typography>
                </Box>

                {error ? (
                  <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                  </Alert>
                ) : null}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      label="Username or Email"
                      variant="outlined"
                      fullWidth
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      disabled={isSubmitting}
                      slotProps={{
                        inputLabel: { shrink: true }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />

                    <TextField
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                disabled={isSubmitting}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      sx={{
                        height: 48,
                        color: '#08111f',
                        fontWeight: 'bold',
                        mt: 2
                      }}
                    >
                      {isSubmitting ? 'Verifying...' : 'Sign In'}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
