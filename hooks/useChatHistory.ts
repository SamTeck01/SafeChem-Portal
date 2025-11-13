import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '@/services/aiChatApi';

const CHAT_HISTORY_KEY = '@safechem_chat_history';
const MAX_MESSAGES = 100;

/**
 * Hook to manage AI chat history
 */
export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (message: ChatMessage) => {
    try {
      const newMessages = [...messages, message].slice(-MAX_MESSAGES);
      setMessages(newMessages);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const clearHistory = async () => {
    try {
      setMessages([]);
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  return {
    messages,
    loading,
    addMessage,
    clearHistory,
  };
}
