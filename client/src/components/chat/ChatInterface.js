import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      // Add user message immediately
      const userMessage = { text: input, isUser: true };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input
      setInput('');
      setError(null);

      // Call secure Next.js API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage = { text: data.response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get response. Please try again.');
      // Remove loading state
      setMessages(prev => prev.filter(msg => msg.text !== '...'));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 800, 
      margin: 'auto', 
      padding: 3,
      height: '80vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Paper sx={{ 
        flexGrow: 1,
        overflowY: 'auto', 
        mb: 2,
        p: 2,
        backgroundColor: '#f5f5f5'
      }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ 
            textAlign: msg.isUser ? 'right' : 'left',
            mb: 2
          }}>
            <Paper sx={{ 
              display: 'inline-block',
              p: 1.5,
              backgroundColor: msg.isUser ? '#1976d2' : '#e0e0e0',
              color: msg.isUser ? 'white' : 'black',
              borderRadius: 2,
              maxWidth: '70%'
            }}>
              <Typography variant="body1">
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          multiline
          maxRows={4}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!input.trim()}
          sx={{ height: '56px' }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;