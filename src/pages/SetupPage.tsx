import React, { useState } from 'react';
import { Box, Button, Container, Paper, Stack, TextField, Typography, Alert, IconButton, InputAdornment, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export function SetupPage() {
  const { setupRoot, setCurrentPage } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all the fields.');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await setupRoot(username, email, password);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Setup failed. Please check your data and try again.'
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
                    First-Time Setup
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure the Root Administrator account for the pump control system. This setup will be locked after completion.
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
                      label="Username"
                      variant="outlined"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                    <TextField
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      sx={{
                        height: 48,
                        fontWeight: 'bold',
                        mt: 2
                      }}
                    >
                      {isSubmitting ? 'Creating Administrator...' : 'Create Account'}
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
