import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
}

export default function SearchHistoryScreen() {
  const router = useRouter();
  
  // Mock data - replace with actual search history from your backend/storage
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([
    {
      id: '1',
      query: 'Sodium Chloride',
      timestamp: '2 hours ago',
      resultsCount: 1,
    },
    {
      id: '2',
      query: 'Water',
      timestamp: '1 day ago',
      resultsCount: 1,
    },
    {
      id: '3',
      query: 'Acid',
      timestamp: '3 days ago',
      resultsCount: 15,
    },
    {
      id: '4',
      query: 'Carbon',
      timestamp: '1 week ago',
      resultsCount: 8,
    },
  ]);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all search history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setSearchHistory([]);
            Alert.alert('Success', 'Search history cleared');
          },
        },
      ]
    );
  };

  const handleDeleteItem = (id: string) => {
    setSearchHistory(searchHistory.filter(item => item.id !== id));
  };

  const handleSearchAgain = (query: string) => {
    // Navigate to search with this query
    router.push({
      pathname: '/(tabs)/search',
      params: { query },
    });
  };

  const renderHistoryItem = ({ item }: { item: SearchHistoryItem }) => (
    <View style={styles.historyCard}>
      <TouchableOpacity
        style={styles.historyContent}
        onPress={() => handleSearchAgain(item.query)}
      >
        <View style={styles.historyIcon}>
          <Ionicons name="time-outline" size={24} color="#2d5875" />
        </View>
        <View style={styles.historyInfo}>
          <Text style={styles.historyQuery}>{item.query}</Text>
          <Text style={styles.historyMeta}>
            {item.resultsCount} result{item.resultsCount !== 1 ? 's' : ''} • {item.timestamp}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Ionicons name="close-circle" size={24} color="#999" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2d5875" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search History</Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
        {searchHistory.length === 0 && <View style={styles.placeholder} />}
      </View>

      {searchHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Search History</Text>
          <Text style={styles.emptyDescription}>
            Your search history will appear here
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.searchButtonText}>Start Searching</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={searchHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d5875',
  },
  clearText: {
    fontSize: 16,
    color: '#ff5252',
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyQuery: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyMeta: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  searchButton: {
    backgroundColor: '#2d5875',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
