import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Paper } from '@mui/material';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const botResponseRef = useRef(''); // Using ref to track latest value

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { text: inputMessage, isBot: false },
      { text: '', isBot: true, loading: true }
    ];
    
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);
    botResponseRef.current = ''; // Reset response buffer

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: inputMessage }]
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          try {
            const { content } = JSON.parse(line.replace('data: ', ''));
            botResponseRef.current += content;
            
            // Use functional update to ensure we're working with latest state
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.isBot) {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, text: botResponseRef.current, loading: false }
                ];
              }
              return prev;
            });
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { text: '⚠️ Error connecting to AI mentor. Please try again.', isBot: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Box sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        height: '60vh',
        overflowY: 'auto',
        mb: 2,
        bgcolor: 'background.paper'
      }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ 
            display: 'flex', 
            justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
            mb: 2
          }}>
            <Paper sx={{
              p: 2,
              borderRadius: 2,
              maxWidth: '80%',
              bgcolor: msg.isBot ? 'grey.100' : 'primary.main',
              color: msg.isBot ? 'text.primary' : 'common.white'
            }}>
              {msg.loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body1">Thinking...</Typography>
                </Box>
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </Typography>
              )}
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask your mentor anything..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isLoading}
          sx={{ height: 56 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;