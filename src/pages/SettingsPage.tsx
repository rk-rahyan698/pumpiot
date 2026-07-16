import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Paper, Stack, TextField, Typography, Alert, IconButton, InputAdornment, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/SnackbarProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export function SettingsPage() {
  const { user, updateSettings, setCurrentPage } = useAuth();
  const { showMessage } = useSnackbar();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepopulate username and email
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) {
      setError('Username and Email are required.');
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

    // Password change validation
    if (newPassword || confirmNewPassword || currentPassword) {
      if (!currentPassword) {
        setError('Please enter your current password to set a new password.');
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError('New passwords do not match.');
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await updateSettings(
        username,
        email,
        currentPassword || undefined,
        newPassword || undefined
      );
      showMessage('Account settings updated successfully.', 'success');
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to update settings. Please check your inputs.'
      );
      showMessage('Failed to update account settings.', 'error');
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
              onClick={() => setCurrentPage('dashboard')}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
                    Root Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your Root Administrator profile details and security credentials.
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

                    <Typography variant="subtitle2" color="primary.main" sx={{ mt: 1, fontWeight: 700 }}>
                      Change Password (Optional)
                    </Typography>

                    <TextField
                      label="Current Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
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
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                      label="Confirm New Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      fullWidth
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                      {isSubmitting ? 'Updating...' : 'Save Settings'}
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
