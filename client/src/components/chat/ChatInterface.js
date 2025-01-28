import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';
import DOMPurify from 'dompurify';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sanitizeInput = (text) => {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanInput = sanitizeInput(input);
    if (!cleanInput.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cleanInput })
      });

      if (!response.ok) throw new Error('Request failed');
      
      const data = await response.json();
      setMessages([...messages, 
        { text: cleanInput, isUser: true },
        { text: data.response, isUser: false }
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
      <Box sx={{ mb: 2 }}>
        {messages.map((msg, i) => (
          <Box key={i} sx={{ 
            textAlign: msg.isUser ? 'right' : 'left',
            bgcolor: msg.isUser ? '#e3f2fd' : '#f5f5f5',
            p: 2,
            borderRadius: 2,
            mb: 1
          }}>
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
      </Box>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          InputProps={{
            endAdornment: (
              <Button type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : <Send />}
              </Button>
            )
          }}
        />
      </form>
    </Box>
  );
};

export default ChatInterface;