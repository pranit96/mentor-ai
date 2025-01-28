import React from 'react';
import { CssBaseline, Container, Typography, Box, ThemeProvider, createTheme, Stack } from '@mui/material';
import ChatInterface from './ChatInterface';

const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#9c27b0' }
  },
  typography: {
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    body1: { fontSize: '1rem' }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h1" component="h1" sx={{
            background: 'linear-gradient(to right, #3f51b5, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Mentor.ai
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your personal AI mentor for learning and growth.
          </Typography>
          <Box sx={{ width: '100%', maxWidth: 800 }}>
            <ChatInterface />
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;