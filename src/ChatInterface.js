import { useState, useRef, useEffect } from 'react';
import { HfInference } from '@huggingface/inference';
import { Box, Input, Button, Flex, Text, Spinner } from '@chakra-ui/react';

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
    <Box>
      <Box borderWidth={1} borderRadius="lg" p={4} height="60vh" overflowY="auto" mb={4}>
        {messages.map((msg, index) => (
          <Flex key={index} justify={msg.isBot ? "flex-start" : "flex-end"} mb={3}>
            <Box
              p={3}
              borderRadius="lg"
              bg={msg.isBot ? "gray.100" : "blue.500"}
              color={msg.isBot ? "black" : "white"}
              maxWidth="80%"
            >
              <Text whiteSpace="pre-wrap">{msg.text}</Text>
            </Box>
          </Flex>
        ))}
        {isLoading && (
          <Flex justify="flex-start" mb={4}>
            <Box p={3} borderRadius="lg" bg="gray.100" maxWidth="80%">
              <Spinner size="sm" mr={2} />
              <Text as="span">Mentor is thinking...</Text>
            </Box>
          </Flex>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Flex gap={2}>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask your mentor anything..."
          onKeyUp={(e) => e.key === 'Enter' && handleSend()}
          flex={1}
        />
        <Button 
          colorScheme="blue" 
          onClick={handleSend}
          isLoading={isLoading}
        >
          Send
        </Button>
      </Flex>
      <Text fontSize="sm" color="gray.500" mt={2}>
        Free requests remaining: {apiLimit}
      </Text>
    </Box>
  );
};

export default ChatInterface;