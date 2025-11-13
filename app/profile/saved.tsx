import React from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBookmarks } from '@/hooks/useBookmarks';
import { ChemicalCard } from '@/components/ChemicalCard';

export default function SavedChemicalsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { bookmarks, loading } = useBookmarks();

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: isDark ? '#111B21' : '#F5F5F5' }}
      edges={['top']}
    >
      {/* Header */}
      <View 
        className="px-4 py-4 border-b flex-row items-center"
        style={{ 
          backgroundColor: isDark ? '#1F2C34' : '#fff',
          borderBottomColor: isDark ? '#2A3942' : '#e0e0e0'
        }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#E9EDEF' : '#2d5875'} />
        </TouchableOpacity>
        <Text 
          className="text-lg font-bold"
          style={{ color: isDark ? '#E9EDEF' : '#2d5875' }}
        >
          Saved Chemicals
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text
            className="mt-4"
            style={{ color: isDark ? '#8696A0' : '#666' }}
          >
            Loading saved chemicals...
          </Text>
        </View>
      ) : bookmarks.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: isDark ? '#1F2C34' : '#f5f5f5' }}
          >
            <Ionicons name="bookmark-outline" size={40} color={isDark ? '#8696A0' : '#999'} />
          </View>
          <Text 
            className="text-lg font-bold mb-2 text-center"
            style={{ color: isDark ? '#E9EDEF' : '#1a3a52' }}
          >
            No Saved Chemicals
          </Text>
          <Text 
            className="text-base text-center mb-4"
            style={{ color: isDark ? '#8696A0' : '#666' }}
          >
            Chemicals you bookmark will appear here
          </Text>
          <TouchableOpacity
            className="px-6 py-3 rounded-full"
            style={{ backgroundColor: '#10B981' }}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text className="text-white font-semibold">Search Chemicals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mx-4 mb-3">
              <ChemicalCard
                chemical={item}
                onPress={() => router.push(`/chemical/${item.id}` as any)}
              />
            </View>
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}
