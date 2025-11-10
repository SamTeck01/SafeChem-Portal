import React, { useState, useMemo, useEffect, useRef } from "react";
import { View, Text, ScrollView, useColorScheme, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { LiquidGlassSearch } from "@/components/LiquidGlassSearch";
import { FilterTabs } from "@/components/FilterTabs";
import { ChemicalCard } from "@/components/ChemicalCard";
import { Sidebar } from "@/components/Sidebar";
import { chemicals } from "@/data/chemicals";
import { Chemical } from "@/types/chemical";
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  "All",
  "Acid",
  "Base",
  "Solvent",
  "Salt",
  "Organic",
  "Inorganic",
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentChemicals, setRecentChemicals] = useState<Chemical[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredChemicals = useMemo(() => {
    return chemicals.filter((chemical) => {
      const matchesSearch =
        chemical.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chemical.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chemical.casNumber.includes(searchQuery);
      const matchesCategory =
        activeCategory === "All" || chemical.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Load recent chemicals from storage
  useEffect(() => {
    loadRecentChemicals();
  }, []);

  const loadRecentChemicals = async () => {
    try {
      const stored = await AsyncStorage.getItem('recentChemicals');
      if (stored) {
        const ids = JSON.parse(stored);
        const recents = ids
          .map((id: string) => chemicals.find(c => c.id === id))
          .filter(Boolean)
          .slice(0, 5);
        setRecentChemicals(recents);
      }
    } catch (error) {
      console.error('Error loading recent chemicals:', error);
    }
  };

  const handleChemicalPress = async (id: string) => {
    // Save to recent chemicals
    try {
      const stored = await AsyncStorage.getItem('recentChemicals');
      let ids = stored ? JSON.parse(stored) : [];
      ids = [id, ...ids.filter((i: string) => i !== id)].slice(0, 5);
      await AsyncStorage.setItem('recentChemicals', JSON.stringify(ids));
      await loadRecentChemicals();
    } catch (error) {
      console.error('Error saving recent chemical:', error);
    }
    router.push(`/chemical/${id}` as any);
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: isDark ? "#111B21" : "#FFFFFF" }}
    >
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* U-Shaped Hero */}
        <LinearGradient
          colors={isDark ? ["#111B21", "#1F2C34"] : ["#FFFFFF", "#F7F9F9"]}
          style={{
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <View className="pt-28 px-6 pb-4">
            <View className="flex-row items-center mb-2">
              <Text
                className="text-3xl font-bold mr-3"
                style={{ color: isDark ? "#E9EDEF" : "#0F1419" }}
              >
                Hi, Chemist!
              </Text>
              <Ionicons name="flask" size={32} color="#10B981" />
            </View>
            <Text
              className="text-base mb-2"
              style={{ color: isDark ? "#8696A0" : "#536471" }}
            >
              Search and explore safety data sheets
            </Text>
          </View>

          {/* Liquid Glass Search inside hero */}
          <LiquidGlassSearch
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search chemicals, CAS, formula..."
          />
        </LinearGradient>

        {/* Twitter-Style Filter Tabs */}
        <FilterTabs
          tabs={categories}
          activeTab={activeCategory}
          onTabChange={setActiveCategory}
        />

        {/* Chemical Cards */}
        {filteredChemicals.map((chemical) => (
          <ChemicalCard
            key={chemical.id}
            chemical={chemical}
            onPress={() => handleChemicalPress(chemical.id)}
          />
        ))}
      </Animated.ScrollView>

      {/* Sticky Hamburger Menu Button */}
      <TouchableOpacity
        onPress={() => setIsSidebarOpen(true)}
        style={{
          position: 'absolute',
          top: 40,
          left: 16,
          width: 45,
          height: 45,
          borderRadius: 22.5,
          backgroundColor: isDark ? 'rgba(31, 44, 52, 0.9)' : 'rgba(247, 249, 249, 0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 101,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
        activeOpacity={0.8}
      >
        <Ionicons
          name="menu"
          size={24}
          color={isDark ? '#E9EDEF' : '#0F1419'}
        />
      </TouchableOpacity>

      {/* Sticky Search Bar - Appears when scrolled past hero */}
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          zIndex: 100,
          opacity: scrollY.interpolate({
            inputRange: [150, 250],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [{
            translateY: scrollY.interpolate({
              inputRange: [150, 250],
              outputRange: [-20, 0],
              extrapolate: 'clamp',
            }),
          }],
        }}
      >
        <View style={{ backgroundColor: 'none' }} className="ps-[66px]">
          <LiquidGlassSearch
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search chemicals, CAS, formula..."
          />
        </View>
      </Animated.View>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        recentChemicals={recentChemicals}
      />
    </View>
  );
}
