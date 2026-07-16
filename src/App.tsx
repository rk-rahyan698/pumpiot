import { CssBaseline, ThemeProvider, CircularProgress, Box } from '@mui/material';
import { SnackbarProvider } from './components/SnackbarProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SetupPage } from './pages/SetupPage';
import { SettingsPage } from './pages/SettingsPage';
import { HomePage } from './pages/HomePage';
import { dashboardTheme } from './theme';

function AppContent() {
  const { currentPage, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#08111f'
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'setup':
      return <SetupPage />;
    case 'settings':
      return <SettingsPage />;
    case 'dashboard':
      return <HomePage />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
