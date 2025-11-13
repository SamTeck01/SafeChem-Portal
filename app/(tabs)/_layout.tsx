import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2d5875" />
      </View>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: isDark ? '#8696A0' : '#536471',
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2C34' : '#FFFFFF',
          borderTopColor: isDark ? '#2A3942' : '#EFF3F4',
          borderTopWidth: 1,
          height: 75,
          paddingBottom: 12,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
