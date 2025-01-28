import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2d3e50',
    },
    secondary: {
      main: '#e74c3c',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px'
        }
      }
    }
  }
});