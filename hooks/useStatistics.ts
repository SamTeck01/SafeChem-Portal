import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = '@safechem_statistics';

interface Statistics {
  totalSearches: number;
  totalBookmarks: number;
  totalChatsStarted: number;
  lastActive: number;
  joinedDate: number;
  chemicalsViewed: number;
}

const DEFAULT_STATS: Statistics = {
  totalSearches: 0,
  totalBookmarks: 0,
  totalChatsStarted: 0,
  lastActive: Date.now(),
  joinedDate: Date.now(),
  chemicalsViewed: 0,
};

/**
 * Hook to track and manage user statistics
 */
export function useStatistics() {
  const [stats, setStats] = useState<Statistics>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stored = await AsyncStorage.getItem(STATS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setStats(parsed);
      } else {
        // First time user - save default stats
        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (updates: Partial<Statistics>) => {
    try {
      const newStats = { ...stats, ...updates, lastActive: Date.now() };
      setStats(newStats);
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    } catch (error) {
      console.error('Failed to update statistics:', error);
    }
  };

  const incrementSearch = async () => {
    await updateStats({ totalSearches: stats.totalSearches + 1 });
  };

  const incrementBookmark = async () => {
    await updateStats({ totalBookmarks: stats.totalBookmarks + 1 });
  };

  const decrementBookmark = async () => {
    await updateStats({ totalBookmarks: Math.max(0, stats.totalBookmarks - 1) });
  };

  const incrementChatStarted = async () => {
    await updateStats({ totalChatsStarted: stats.totalChatsStarted + 1 });
  };

  const incrementChemicalViewed = async () => {
    await updateStats({ chemicalsViewed: stats.chemicalsViewed + 1 });
  };

  const resetStats = async () => {
    try {
      const resetData = { ...DEFAULT_STATS, joinedDate: stats.joinedDate };
      setStats(resetData);
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(resetData));
    } catch (error) {
      console.error('Failed to reset statistics:', error);
    }
  };

  return {
    stats,
    loading,
    incrementSearch,
    incrementBookmark,
    decrementBookmark,
    incrementChatStarted,
    incrementChemicalViewed,
    resetStats,
  };
}
