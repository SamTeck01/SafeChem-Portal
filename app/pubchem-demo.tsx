import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChemicalSearch, useChemicalSafety } from '@/hooks/usePubChem';
import { getChemicalImageURL } from '@/services/pubchemApi';

export default function PubChemDemo() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCID, setSelectedCID] = useState<number | null>(null);

  const { results, loading: searchLoading } = useChemicalSearch(searchQuery);
  const { safetyData, loading: safetyLoading } = useChemicalSafety(selectedCID);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#111B21' : '#FFFFFF' }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header */}
      <View className="mb-6 mt-12">
        <Text
          className="text-3xl font-bold mb-2"
          style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
        >
          PubChem API Demo
        </Text>
        <Text
          className="text-sm"
          style={{ color: isDark ? '#8696A0' : '#536471' }}
        >
          Search for any chemical to see real SDS data from PubChem
        </Text>
      </View>

      {/* Search Input */}
      <View className="mb-6">
        <View
          className="flex-row items-center px-4 py-3 rounded-lg border"
          style={{
            backgroundColor: isDark ? '#1F2C34' : '#F7F9F9',
            borderColor: isDark ? '#2A3942' : '#EFF3F4',
          }}
        >
          <Ionicons name="search" size={20} color={isDark ? '#8696A0' : '#536471'} />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Try: Acetone, Benzene, 67-64-1..."
            placeholderTextColor={isDark ? '#8696A0' : '#536471'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={isDark ? '#8696A0' : '#536471'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading State */}
      {searchLoading && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#10B981" />
          <Text
            className="mt-2 text-sm"
            style={{ color: isDark ? '#8696A0' : '#536471' }}
          >
            Searching PubChem...
          </Text>
        </View>
      )}

      {/* Search Results */}
      {!searchLoading && results.length > 0 && (
        <View className="mb-6">
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
          >
            Search Results ({results.length})
          </Text>
          {results.map((compound) => (
            <TouchableOpacity
              key={compound.cid}
              onPress={() => setSelectedCID(compound.cid)}
              className="mb-3 p-4 rounded-lg border"
              style={{
                backgroundColor: selectedCID === compound.cid
                  ? (isDark ? '#1F2C34' : '#F7F9F9')
                  : (isDark ? '#111B21' : '#FFFFFF'),
                borderColor: selectedCID === compound.cid ? '#10B981' : (isDark ? '#2A3942' : '#EFF3F4'),
                borderWidth: selectedCID === compound.cid ? 2 : 1,
              }}
            >
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold mb-1"
                    style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                  >
                    {compound.name}
                  </Text>
                  <Text
                    className="text-sm mb-1"
                    style={{ color: isDark ? '#8696A0' : '#536471' }}
                  >
                    Formula: {compound.molecularFormula}
                  </Text>
                  <Text
                    className="text-xs"
                    style={{ color: isDark ? '#8696A0' : '#536471' }}
                  >
                    CID: {compound.cid} • MW: {compound.molecularWeight.toFixed(2)}
                  </Text>
                </View>
                <Ionicons
                  name={selectedCID === compound.cid ? 'checkmark-circle' : 'chevron-forward'}
                  size={24}
                  color={selectedCID === compound.cid ? '#10B981' : (isDark ? '#8696A0' : '#536471')}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* No Results */}
      {!searchLoading && searchQuery.length > 0 && results.length === 0 && (
        <View className="items-center py-8">
          <Ionicons name="flask-outline" size={48} color={isDark ? '#8696A0' : '#536471'} />
          <Text
            className="mt-2 text-sm text-center"
            style={{ color: isDark ? '#8696A0' : '#536471' }}
          >
            No chemicals found
          </Text>
        </View>
      )}

      {/* Safety Data */}
      {selectedCID && (
        <View className="mb-6">
          {/* Chemical Image */}
          <View className="items-center mb-4">
            <Image
              source={{ uri: getChemicalImageURL(selectedCID, 300) }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>

          {safetyLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#10B981" />
              <Text
                className="mt-2 text-sm"
                style={{ color: isDark ? '#8696A0' : '#536471' }}
              >
                Loading safety data...
              </Text>
            </View>
          ) : safetyData ? (
            <>
              {/* GHS Classification */}
              {safetyData.ghsClassification && (
                <View
                  className="p-4 rounded-lg mb-4"
                  style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
                >
                  <Text
                    className="text-lg font-bold mb-3"
                    style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                  >
                    🛡️ GHS Classification
                  </Text>

                  {safetyData.ghsClassification.signalWord && (
                    <View className="mb-3">
                      <Text
                        className="text-sm font-semibold mb-1"
                        style={{ color: isDark ? '#8696A0' : '#536471' }}
                      >
                        Signal Word:
                      </Text>
                      <Text
                        className="text-base font-bold"
                        style={{
                          color: safetyData.ghsClassification.signalWord === 'Danger' ? '#EF4444' : '#F59E0B',
                        }}
                      >
                        {safetyData.ghsClassification.signalWord}
                      </Text>
                    </View>
                  )}

                  {safetyData.ghsClassification.pictograms.length > 0 && (
                    <View className="mb-3">
                      <Text
                        className="text-sm font-semibold mb-1"
                        style={{ color: isDark ? '#8696A0' : '#536471' }}
                      >
                        Pictograms:
                      </Text>
                      <Text
                        className="text-sm"
                        style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                      >
                        {safetyData.ghsClassification.pictograms.join(', ')}
                      </Text>
                    </View>
                  )}

                  {safetyData.ghsClassification.hazardStatements.length > 0 && (
                    <View className="mb-3">
                      <Text
                        className="text-sm font-semibold mb-2"
                        style={{ color: isDark ? '#8696A0' : '#536471' }}
                      >
                        Hazard Statements:
                      </Text>
                      {safetyData.ghsClassification.hazardStatements.map((statement, index) => (
                        <Text
                          key={index}
                          className="text-sm mb-1"
                          style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                        >
                          • {statement}
                        </Text>
                      ))}
                    </View>
                  )}

                  {safetyData.ghsClassification.precautionaryStatements.length > 0 && (
                    <View>
                      <Text
                        className="text-sm font-semibold mb-2"
                        style={{ color: isDark ? '#8696A0' : '#536471' }}
                      >
                        Precautionary Statements:
                      </Text>
                      {safetyData.ghsClassification.precautionaryStatements.slice(0, 5).map((statement, index) => (
                        <Text
                          key={index}
                          className="text-sm mb-1"
                          style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                        >
                          • {statement}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* First Aid */}
              {safetyData.firstAid && safetyData.firstAid.length > 0 && (
                <View
                  className="p-4 rounded-lg mb-4"
                  style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
                >
                  <Text
                    className="text-lg font-bold mb-3"
                    style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                  >
                    🏥 First Aid Measures
                  </Text>
                  {safetyData.firstAid.slice(0, 3).map((aid, index) => (
                    <Text
                      key={index}
                      className="text-sm mb-2"
                      style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                    >
                      • {aid}
                    </Text>
                  ))}
                </View>
              )}

              {/* Handling & Storage */}
              {(safetyData.handling || safetyData.storage) && (
                <View
                  className="p-4 rounded-lg mb-4"
                  style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
                >
                  <Text
                    className="text-lg font-bold mb-3"
                    style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                  >
                    📦 Handling & Storage
                  </Text>
                  {safetyData.handling?.slice(0, 2).map((item, index) => (
                    <Text
                      key={`h-${index}`}
                      className="text-sm mb-2"
                      style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                    >
                      • {item}
                    </Text>
                  ))}
                  {safetyData.storage?.slice(0, 2).map((item, index) => (
                    <Text
                      key={`s-${index}`}
                      className="text-sm mb-2"
                      style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
                    >
                      • {item}
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="information-circle-outline" size={48} color={isDark ? '#8696A0' : '#536471'} />
              <Text
                className="mt-2 text-sm text-center"
                style={{ color: isDark ? '#8696A0' : '#536471' }}
              >
                No safety data available for this chemical
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Instructions */}
      {!searchQuery && (
        <View
          className="p-4 rounded-lg"
          style={{ backgroundColor: isDark ? '#1F2C34' : '#F7F9F9' }}
        >
          <Text
            className="text-base font-semibold mb-2"
            style={{ color: isDark ? '#E9EDEF' : '#0F1419' }}
          >
            💡 How to use:
          </Text>
          <Text
            className="text-sm mb-1"
            style={{ color: isDark ? '#8696A0' : '#536471' }}
          >
            1. Type a chemical name (e.g., Acetone, Benzene)
          </Text>
          <Text
            className="text-sm mb-1"
            style={{ color: isDark ? '#8696A0' : '#536471' }}
          >
            2. Or enter a CAS number (e.g., 67-64-1)
          </Text>
          <Text
            className="text-sm mb-1"
            style={{ color: isDark ? '#8696A0' : '#536471' }}
          >
            3. Select a chemical to view its safety data
          </Text>
          <Text
            className="text-sm mt-3 font-semibold"
            style={{ color: '#10B981' }}
          >
            ✅ Data from PubChem - 100% FREE!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
