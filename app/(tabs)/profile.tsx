import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useStatistics } from '@/hooks/useStatistics';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { bookmarks } = useBookmarks();
  const { stats } = useStatistics();

  // If no user after loading, redirect to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [isLoading, user, router]);

  // Show nothing while loading or if no user
  if (isLoading || !user) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Force navigation to login screen
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111B21' : '#F5F5F5' }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#E9EDEF' : '#000' }]}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: isDark ? '#1F2C34' : '#fff' }]}>
          <View style={styles.avatarContainer}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.userName, { color: isDark ? '#E9EDEF' : '#000' }]}>{user?.fullName}</Text>
          <Text style={[styles.userEmail, { color: isDark ? '#8696A0' : '#666' }]}>{user?.email}</Text>
          
          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#E9EDEF' : '#000' }]}>{bookmarks.length}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#8696A0' : '#666' }]}>Saved</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: isDark ? '#2A3942' : '#e0e0e0' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#E9EDEF' : '#000' }]}>{stats.totalSearches}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#8696A0' : '#666' }]}>Searches</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: isDark ? '#2A3942' : '#e0e0e0' }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? '#E9EDEF' : '#000' }]}>{stats.chemicalsViewed}</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#8696A0' : '#666' }]}>Viewed</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? '#1F2C34' : '#fff' }]}
            onPress={() => router.push('/profile/edit')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={24} color={isDark ? '#10B981' : '#2d5875'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#E9EDEF' : '#000' }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? '#8696A0' : '#999'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? '#1F2C34' : '#fff' }]}
            onPress={() => router.push('/profile/settings')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={24} color={isDark ? '#10B981' : '#2d5875'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#E9EDEF' : '#000' }]}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? '#8696A0' : '#999'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? '#1F2C34' : '#fff' }]}
            onPress={() => router.push('/profile/saved' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#10B981' : '#2d5875'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#E9EDEF' : '#000' }]}>Saved Chemicals</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? '#8696A0' : '#999'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? '#1F2C34' : '#fff' }]}
            onPress={() => router.push('/profile/history' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={24} color={isDark ? '#10B981' : '#2d5875'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#E9EDEF' : '#000' }]}>Search History</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? '#8696A0' : '#999'} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? '#1F2C34' : '#fff' }]}
            onPress={() => router.push('/profile/about' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={24} color={isDark ? '#10B981' : '#2d5875'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#E9EDEF' : '#000' }]}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? '#8696A0' : '#999'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: isDark ? '#1F2C34' : '#fff' }]}
            onPress={() => router.push('/profile/about' as any)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color={isDark ? '#10B981' : '#2d5875'} />
              <Text style={[styles.menuItemText, { color: isDark ? '#E9EDEF' : '#000' }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={isDark ? '#8696A0' : '#999'} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={[styles.versionText, { color: isDark ? '#8696A0' : '#999' }]}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  userCard: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2d5875',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  menuSection: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#999',
  },
});
