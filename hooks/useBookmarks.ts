import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chemical } from '@/types/chemical';

const BOOKMARKS_KEY = '@safechem_bookmarks';

/**
 * Hook to manage bookmarked/saved chemicals
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Chemical[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBookmarks(parsed);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const isBookmarked = (chemicalId: string): boolean => {
    return bookmarks.some(item => item.id === chemicalId);
  };

  const addBookmark = async (chemical: Chemical) => {
    try {
      // Check if already bookmarked
      if (isBookmarked(chemical.id)) {
        return;
      }

      const newBookmarks = [chemical, ...bookmarks];
      setBookmarks(newBookmarks);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      throw error;
    }
  };

  const removeBookmark = async (chemicalId: string) => {
    try {
      const filtered = bookmarks.filter(item => item.id !== chemicalId);
      setBookmarks(filtered);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    }
  };

  const toggleBookmark = async (chemical: Chemical) => {
    if (isBookmarked(chemical.id)) {
      await removeBookmark(chemical.id);
    } else {
      await addBookmark(chemical);
    }
  };

  const clearBookmarks = async () => {
    try {
      setBookmarks([]);
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
    }
  };

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearBookmarks,
  };
}
