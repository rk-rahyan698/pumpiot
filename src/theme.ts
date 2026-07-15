import { createTheme } from '@mui/material/styles';

export const dashboardTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6ae4ff'
    },
    secondary: {
      main: '#8f7bff'
    },
    background: {
      default: '#08111f',
      paper: '#0f1a2d'
    },
    success: {
      main: '#4ee59d'
    },
    error: {
      main: '#ff6b7a'
    },
    text: {
      primary: '#eff6ff',
      secondary: '#91a4bf'
    }
  },
  shape: {
    borderRadius: 20
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
    h4: {
      fontWeight: 800
    },
    h6: {
      fontWeight: 700
    },
    button: {
      textTransform: 'none',
      fontWeight: 700
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 20,
          paddingBlock: 10
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.08)'
        }
      }
    }
  }
});
