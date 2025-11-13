import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = '@safechem_search_history';
const MAX_HISTORY_ITEMS = 20;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount?: number;
}

/**
 * Hook to manage search history
 * Stores recent searches in AsyncStorage
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (query: string, resultsCount?: number) => {
    try {
      const trimmed = query.trim();
      if (!trimmed) return;

      // Remove duplicate if exists
      const filtered = history.filter(item => item.query.toLowerCase() !== trimmed.toLowerCase());

      // Add new item at the beginning
      const newHistory = [
        { query: trimmed, timestamp: Date.now(), resultsCount },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS);

      setHistory(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to add to search history:', error);
    }
  };

  const removeFromHistory = async (query: string) => {
    try {
      const filtered = history.filter(item => item.query !== query);
      setHistory(filtered);
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove from search history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  return {
    history,
    loading,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
