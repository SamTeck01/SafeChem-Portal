import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SavedChemical {
  id: string;
  name: string;
  formula: string;
  savedDate: string;
}

export default function SavedChemicalsScreen() {
  const router = useRouter();
  
  // Mock data - replace with actual saved chemicals from your backend/storage
  const [savedChemicals] = useState<SavedChemical[]>([
    {
      id: '1',
      name: 'Sodium Chloride',
      formula: 'NaCl',
      savedDate: '2 days ago',
    },
    {
      id: '2',
      name: 'Water',
      formula: 'H₂O',
      savedDate: '1 week ago',
    },
    {
      id: '3',
      name: 'Carbon Dioxide',
      formula: 'CO₂',
      savedDate: '2 weeks ago',
    },
  ]);

  const renderChemicalItem = ({ item }: { item: SavedChemical }) => (
    <TouchableOpacity
      style={styles.chemicalCard}
      onPress={() => router.push(`/chemical/${item.id}`)}
    >
      <View style={styles.chemicalIcon}>
        <Ionicons name="flask" size={32} color="#2d5875" />
      </View>
      <View style={styles.chemicalInfo}>
        <Text style={styles.chemicalName}>{item.name}</Text>
        <Text style={styles.chemicalFormula}>{item.formula}</Text>
        <Text style={styles.savedDate}>Saved {item.savedDate}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton}>
        <Ionicons name="bookmark" size={24} color="#2d5875" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2d5875" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Chemicals</Text>
        <View style={styles.placeholder} />
      </View>

      {savedChemicals.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Saved Chemicals</Text>
          <Text style={styles.emptyDescription}>
            Chemicals you bookmark will appear here
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.exploreButtonText}>Explore Chemicals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedChemicals}
          renderItem={renderChemicalItem}
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
  placeholder: {
    width: 32,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  chemicalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chemicalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chemicalInfo: {
    flex: 1,
  },
  chemicalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  chemicalFormula: {
    fontSize: 14,
    color: '#2d5875',
    marginBottom: 4,
  },
  savedDate: {
    fontSize: 12,
    color: '#999',
  },
  removeButton: {
    padding: 8,
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
  exploreButton: {
    backgroundColor: '#2d5875',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
