import { Chemical } from "@/types/chemical";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface ChemicalCardProps {
  chemical: Chemical;
  onPress: () => void;
  index?: number;
}

const hazardColors = {
  Low: "#10B981",
  Moderate: "#F59E0B",
  High: "#F97316",
  Extreme: "#EF4444",
};

const hazardIcons: Record<string, any> = {
  Low: "shield-checkmark",
  Moderate: "warning",
  High: "alert-circle",
  Extreme: "skull",
};

export function ChemicalCard({
  chemical,
  onPress,
  index = 0,
}: ChemicalCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50, // Stagger effect
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 50,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        className="border-b px-4 py-4"
        style={{
          backgroundColor: isDark ? "#111B21" : "#FFFFFF",
          borderBottomColor: isDark ? "#2A3942" : "#EFF3F4",
        }}
      >
        <Animated.View
          className="flex-row items-start"
          style={{ transform: [{ scale: scaleAnim }] }}
        >
          {/* Hazard Icon */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{
              backgroundColor: hazardColors[chemical.hazardLevel] + "20",
            }}
          >
            <Ionicons
              name={hazardIcons[chemical.hazardLevel]}
              size={24}
              color={hazardColors[chemical.hazardLevel]}
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className="text-lg font-bold"
                style={{ color: isDark ? "#E9EDEF" : "#0F1419" }}
              >
                {chemical.name}
              </Text>
              <View
                className="px-2 py-1 rounded-full"
                style={{
                  backgroundColor: hazardColors[chemical.hazardLevel] + "20",
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: hazardColors[chemical.hazardLevel] }}
                >
                  {chemical.hazardLevel}
                </Text>
              </View>
            </View>

            {/* Formula and CAS */}
            <View className="flex-row items-center mb-2">
              <Text
                className="text-base font-medium mr-3"
                style={{ color: isDark ? "#8696A0" : "#536471" }}
              >
                {chemical.formula}
              </Text>
              <Text
                className="text-sm"
                style={{ color: isDark ? "#8696A0" : "#536471" }}
              >
                CAS: {chemical.casNumber}
              </Text>
            </View>

            {/* Description */}
            <Text
              className="text-sm mb-2"
              style={{ color: isDark ? "#E9EDEF" : "#0F1419" }}
              numberOfLines={2}
            >
              {chemical.description}
            </Text>

            {/* Footer */}
            <View className="flex-row items-center justify-between">
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: isDark ? "#1F2C34" : "#F7F9F9" }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: isDark ? "#8696A0" : "#536471" }}
                >
                  {chemical.category}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text
                  className="text-sm font-semibold mr-1"
                  style={{ color: "#10B981" }}
                >
                  View SDS
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#10B981" />
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}
