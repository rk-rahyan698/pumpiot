import { Alert, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type SnackbarVariant = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextValue {
  showMessage: (message: string, variant?: SnackbarVariant) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<SnackbarVariant>('info');

  const showMessage = useCallback((nextMessage: string, nextVariant: SnackbarVariant = 'info') => {
    setMessage(nextMessage);
    setVariant(nextVariant);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ showMessage }), [showMessage]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3500}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity={variant} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }

  return context;
}
