import { ChakraProvider, Heading, Text, Link, VStack, Box } from '@chakra-ui/react';
import ChatInterface from './ChatInterface';

function App() {
  return (
    <ChakraProvider>
      <VStack spacing={4} p={4} textAlign="center">
        <Heading as="h1" size="xl" bgGradient="linear(to-r, blue.500, purple.500)" bgClip="text">
          Mentor.ai
        </Heading>
        <Text fontSize="lg">
          Your personal AI mentor for learning and growth.
        </Text>
        <Box width="100%" maxWidth="800px">
          <ChatInterface />
        </Box>
        <Text fontSize="sm" color="gray.500">
          Powered by <Link href="https://huggingface.co" color="blue.500">Hugging Face</Link> and <Link href="https://vercel.com" color="blue.500">Vercel</Link>
        </Text>
      </VStack>
    </ChakraProvider>
  );
}

export default App;