import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from './components/SnackbarProvider';
import { HomePage } from './pages/HomePage';
import { dashboardTheme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <HomePage />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
