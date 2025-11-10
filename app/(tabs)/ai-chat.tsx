import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AIChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View 
      className="flex-1 items-center justify-center px-8"
      style={{ backgroundColor: isDark ? '#111B21' : '#FFFFFF' }}
    >
      <View 
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
      >
        <Ionicons 
          name="chatbubbles" 
          size={48} 
          color="#10B981" 
        />
      </View>
      <Text 
        className="text-2xl font-bold mb-3 text-center"
        style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
      >
        AI Chat Assistant
      </Text>
      <Text 
        className="text-base text-center mb-6"
        style={{ color: isDark ? '#8696A0' : '#536471' }}
      >
        Coming soon! Chat with our AI to get instant answers about chemical safety, handling procedures, and more.
      </Text>
      <View 
        className="px-4 py-2 rounded-full"
        style={{ backgroundColor: '#10B981' + '20' }}
      >
        <Text 
          className="text-sm font-semibold"
          style={{ color: '#10B981' }}
        >
          Under Development
        </Text>
      </View>
    </View>
  );
}
