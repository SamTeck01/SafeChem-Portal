import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  useColorScheme,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { aiChatService, ChatMessage } from '@/services/aiChatApi';
import { useChatHistory } from '@/hooks/useChatHistory';

export default function AIChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { messages, addMessage, clearHistory } = useChatHistory();
  const quickActions = aiChatService.getQuickActions();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isTyping) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };
    await addMessage(userMessage);
    setInputText('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await aiChatService.sendMessage(messageText, {
        conversationHistory: messages,
      });
      await addMessage(aiResponse);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error.message || 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        isError: true,
      };
      await addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearHistory,
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    const isError = item.isError;

    return (
      <View
        className={`mb-4 px-4 ${isUser ? 'items-end' : 'items-start'}`}
      >
        <View
          className="max-w-[80%] rounded-2xl px-4 py-3"
          style={{
            backgroundColor: isError
              ? '#FEE2E2'
              : isUser
              ? '#10B981'
              : isDark
              ? '#1F2C34'
              : '#F7F9F9',
          }}
        >
          <Text
            className="text-base"
            style={{
              color: isError
                ? '#991B1B'
                : isUser
                ? '#FFFFFF'
                : isDark
                ? '#E9EDEF'
                : '#0F1419',
            }}
          >
            {item.content}
          </Text>
          <Text
            className="text-xs mt-1"
            style={{
              color: isError
                ? '#991B1B'
                : isUser
                ? '#FFFFFF'
                : isDark
                ? '#8696A0'
                : '#536471',
              opacity: 0.7,
            }}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? '#111B21' : '#FFFFFF' }}
      edges={['top']}
    >
      {/* Header */}
      <View
        className="px-4 py-4 border-b flex-row justify-between items-center"
        style={{ borderBottomColor: isDark ? '#2A3942' : '#EFF3F4' }}
      >
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: '#10B981' }}
          >
            <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text
              className="text-lg font-bold"
              style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
            >
              SafeChem AI
            </Text>
            <Text
              className="text-xs"
              style={{ color: isDark ? '#8696A0' : '#536471' }}
            >
              Chemical Safety Assistant
            </Text>
          </View>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity onPress={handleClearChat}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={isDark ? '#8696A0' : '#536471'}
            />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
            >
              <Ionicons name="chatbubbles" size={48} color="#10B981" />
            </View>
            <Text
              className="text-xl font-bold mb-2 text-center"
              style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
            >
              Ask me anything about chemical safety
            </Text>
            <Text
              className="text-base text-center mb-6"
              style={{ color: isDark ? '#8696A0' : '#536471' }}
            >
              I can help with hazards, handling, storage, first aid, and more.
            </Text>

            {/* Quick Actions */}
            <View className="w-full">
              <Text
                className="text-sm font-semibold mb-3"
                style={{ color: isDark ? '#8696A0' : '#536471' }}
              >
                Quick Actions:
              </Text>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  className="mb-2 p-3 rounded-lg border"
                  style={{
                    backgroundColor: isDark ? '#1F2C34' : '#F7F9F9',
                    borderColor: isDark ? '#2A3942' : '#EFF3F4',
                  }}
                  onPress={() => handleQuickAction(action)}
                >
                  <Text
                    className="text-sm"
                    style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                  >
                    {action}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
            ListFooterComponent={
              isTyping ? (
                <View className="px-4 mb-4">
                  <View
                    className="max-w-[80%] rounded-2xl px-4 py-3 flex-row items-center"
                    style={{
                      backgroundColor: isDark ? '#1F2C34' : '#F7F9F9',
                    }}
                  >
                    <ActivityIndicator size="small" color="#10B981" />
                    <Text
                      className="ml-2 text-sm"
                      style={{ color: isDark ? '#8696A0' : '#536471' }}
                    >
                      AI is typing...
                    </Text>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input */}
        <View
          className="px-4 py-3 border-t"
          style={{
            backgroundColor: isDark ? '#1F2C34' : '#FFFFFF',
            borderTopColor: isDark ? '#2A3942' : '#EFF3F4',
          }}
        >
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 px-4 py-3 rounded-full mr-2"
              style={{
                backgroundColor: isDark ? '#111B21' : '#F7F9F9',
                color: isDark ? '#E9EDEF' : '#0F1419',
              }}
              placeholder="Ask about chemical safety..."
              placeholderTextColor={isDark ? '#8696A0' : '#536471'}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!isTyping}
            />
            <TouchableOpacity
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{
                backgroundColor:
                  inputText.trim() && !isTyping ? '#10B981' : '#8696A0',
              }}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
