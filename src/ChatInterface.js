import React, { useState, useRef, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
import { Box, TextField, Button, Typography, CircularProgress, Paper } from '@mui/material';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiLimit, setApiLimit] = useState(500);
  const messagesEndRef = useRef(null);
  const hf = new HfInference(process.env.REACT_APP_HF_TOKEN);

  // Auto-scroll to bottom
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView();
  useEffect(scrollToBottom, [messages]);

  // Track API usage
  useEffect(() => {
    const storedLimit = localStorage.getItem('apiLimit');
    if (storedLimit) setApiLimit(parseInt(storedLimit));
  }, []);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    if (apiLimit <= 0) {
      alert("Free API limit reached. Please try again later.");
      return;
    }

    // Update UI
    setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.1',
        inputs: `[INST] You are an AI mentor. Provide actionable, step-by-step advice. Be encouraging and professional. Answer: ${inputMessage} [/INST]`,
        parameters: { max_new_tokens: 500, temperature: 0.7 }
      });

      setMessages(prev => [...prev, { 
        text: response.generated_text.replace(/\[INST\].*\[\/INST\]/g, '').trim(), 
        isBot: true 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "⚠️ Free API limit reached. Please wait 1 minute and try again.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
      setApiLimit(prev => {
        const newLimit = prev - 1;
        localStorage.setItem('apiLimit', newLimit);
        return newLimit;
      });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Box
        sx={{
          borderWidth: 1,
          borderRadius: 2,
          padding: 2,
          height: '60vh',
          overflowY: 'auto',
          mb: 2,
          backgroundColor: 'background.paper',
        }}
      >
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end', mb: 2 }}>
            <Paper
              sx={{
                padding: 2,
                borderRadius: 2,
                maxWidth: '80%',
                backgroundColor: msg.isBot ? 'grey.100' : 'primary.main',
                color: msg.isBot ? 'text.primary' : 'white',
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Paper sx={{ padding: 2, borderRadius: 2, maxWidth: '80%', backgroundColor: 'grey.100' }}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body1" component="span">
                Mentor is thinking...
              </Typography>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          variant="outlined"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask your mentor anything..."
          fullWidth
          onKeyUp={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSend}
          disabled={isLoading}
        >
          Send
        </Button>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
        Free requests remaining: {apiLimit}
      </Typography>
    </Box>
  );
};

export default ChatInterface;
