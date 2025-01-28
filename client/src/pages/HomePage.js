import { Container, Typography } from '@mui/material';
import ChatInterface from '../components/Chat/ChatInterface';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom>
        AI Mentor
      </Typography>
      <ChatInterface />
    </Container>
  );
};

export default HomePage;