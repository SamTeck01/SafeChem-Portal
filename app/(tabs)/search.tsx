import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, useColorScheme, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LiquidGlassSearch } from '@/components/LiquidGlassSearch';
import { ChemicalCard } from '@/components/ChemicalCard';
import { useHybridSearch } from '@/hooks/useHybridSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchHistory } from '@/hooks/useSearchHistory';

export default function SearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce search query to prevent excessive API calls
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Use hybrid search (cached + API) with debounced query
  const { results: searchResults, loading: searchLoading, hasCachedResults } = useHybridSearch(debouncedQuery);
  
  // Search history
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  
  // Add to history when search completes
  useEffect(() => {
    if (debouncedQuery && searchResults.length > 0) {
      addToHistory(debouncedQuery, searchResults.length);
    }
  }, [debouncedQuery, searchResults.length]);

  const handleChemicalPress = (id: string) => {
    router.push(`/chemical/${id}` as any);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#111B21' : '#FFFFFF' }}>
      {/* Header */}
      <View className="pt-16 pb-4">
        <LiquidGlassSearch
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search SafeChem..."
        />
      </View>

      {/* Results */}
      {searchQuery.length === 0 ? (
        <View className="flex-1 px-4">
          {/* Search History */}
          {history.length > 0 && (
            <View className="mt-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text 
                  className="text-lg font-bold"
                  style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                >
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearHistory}>
                  <Text style={{ color: '#10B981', fontWeight: '600' }}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {history.slice(0, 10).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center justify-between py-3 border-b"
                  style={{ borderBottomColor: isDark ? '#2A3942' : '#EFF3F4' }}
                  onPress={() => setSearchQuery(item.query)}
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons name="time-outline" size={20} color={isDark ? '#8696A0' : '#536471'} />
                    <Text 
                      className="ml-3 flex-1"
                      style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                    >
                      {item.query}
                    </Text>
                    {item.resultsCount !== undefined && (
                      <Text 
                        className="text-xs mr-2"
                        style={{ color: isDark ? '#8696A0' : '#536471' }}
                      >
                        {item.resultsCount} results
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item.query);
                    }}
                    className="p-2"
                  >
                    <Ionicons name="close" size={20} color={isDark ? '#8696A0' : '#536471'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Empty State */}
          {history.length === 0 && (
            <View className="flex-1 items-center justify-center px-8">
              <View 
                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
              >
                <Ionicons 
                  name="search" 
                  size={48} 
                  color={isDark ? '#8696A0' : '#536471'} 
                />
              </View>
              <Text 
                className="text-xl font-bold mb-2 text-center"
                style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
              >
                Search for chemicals
              </Text>
              <Text 
                className="text-base text-center"
                style={{ color: isDark ? '#8696A0' : '#536471' }}
              >
                Find safety data sheets by name, formula, or CAS number
              </Text>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="px-4 py-3 border-b" style={{ borderBottomColor: isDark ? '#2A3942' : '#EFF3F4' }}>
              <View className="flex-row items-center justify-between">
                <Text 
                  className="text-sm font-semibold"
                  style={{ color: isDark ? '#8696A0' : '#536471' }}
                >
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                </Text>
                {hasCachedResults && (
                  <View 
                    className="flex-row items-center px-2 py-1 rounded-full"
                    style={{ backgroundColor: isDark ? '#1F2C34' : '#F0FDF4' }}
                  >
                    <Ionicons name="flash" size={12} color="#10B981" />
                    <Text 
                      className="ml-1 text-xs font-semibold"
                      style={{ color: '#10B981' }}
                    >
                      Instant
                    </Text>
                  </View>
                )}
                {searchLoading && (
                  <ActivityIndicator size="small" color="#10B981" />
                )}
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ChemicalCard
              chemical={item}
              onPress={() => handleChemicalPress(item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-8 py-20">
              <View 
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
              >
                <Ionicons 
                  name="alert-circle-outline" 
                  size={40} 
                  color={isDark ? '#8696A0' : '#536471'} 
                />
              </View>
              <Text 
                className="text-lg font-bold mb-2 text-center"
                style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
              >
                No results found
              </Text>
              <Text 
                className="text-base text-center"
                style={{ color: isDark ? '#8696A0' : '#536471' }}
              >
                Try searching with different keywords
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
