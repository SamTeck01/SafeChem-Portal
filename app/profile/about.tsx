import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2d5875" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* App Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Ionicons name="flask" size={60} color="#fff" />
          </View>
          <Text style={styles.appName}>SafeChem Portal</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description}>
            SafeChem Portal is your comprehensive chemical database and safety information platform. 
            Access detailed information about thousands of chemicals, their properties, safety guidelines, 
            and handling procedures.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="search" size={20} color="#2d5875" />
              <Text style={styles.featureText}>Search chemical database</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color="#2d5875" />
              <Text style={styles.featureText}>Safety information & guidelines</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="bookmark" size={20} color="#2d5875" />
              <Text style={styles.featureText}>Save favorite chemicals</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubbles" size={20} color="#2d5875" />
              <Text style={styles.featureText}>AI-powered assistance</Text>
            </View>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://safechem.com/privacy')}
          >
            <Ionicons name="document-text-outline" size={24} color="#2d5875" />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://safechem.com/terms')}
          >
            <Ionicons name="document-text-outline" size={24} color="#2d5875" />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleOpenLink('https://safechem.com/support')}
          >
            <Ionicons name="help-circle-outline" size={24} color="#2d5875" />
            <Text style={styles.linkText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleOpenLink('mailto:support@safechem.com')}
          >
            <Ionicons name="mail-outline" size={24} color="#2d5875" />
            <Text style={styles.linkText}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={styles.creditsText}>
            Made with ❤️ by SafeChem Team
          </Text>
          <Text style={styles.copyright}>
            © 2024 SafeChem Portal. All rights reserved.
          </Text>
        </View>
      </ScrollView>
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
  placeholder: {
    width: 32,
  },
  content: {
    padding: 20,
    gap: 32,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2d5875',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d5875',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  credits: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  creditsText: {
    fontSize: 14,
    color: '#666',
  },
  copyright: {
    fontSize: 12,
    color: '#999',
  },
});
