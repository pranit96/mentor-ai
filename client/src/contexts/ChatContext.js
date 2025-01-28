import { createContext, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  const value = {
    history,
    addMessage: (message) => setHistory([...history, message]),
    clearHistory: () => setHistory([])
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};