import { Chemical } from "@/types/chemical";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recentChemicals: Chemical[];
}

export function Sidebar({ isOpen, onClose, recentChemicals }: SidebarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-280)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChemicalPress = (id: string) => {
    onClose();
    router.push(`/chemical/${id}` as any);
  };

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 100,
        }}
      />

      {/* Sidebar */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          backgroundColor: isDark ? "#1F2C34" : "#FFFFFF",
          zIndex: 200,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View
            style={{
              paddingTop: 60,
              paddingHorizontal: 16,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? "#2A3942" : "#EFF3F4",
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-xl font-bold"
                style={{ color: isDark ? "#E9EDEF" : "#0F1419" }}
              >
                SafeChem
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? "#8696A0" : "#536471"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Chemicals */}
          <View style={{ paddingTop: 16 }}>
            <Text
              className="text-xs font-semibold px-4 mb-3"
              style={{ color: isDark ? "#8696A0" : "#536471" }}
            >
              RECENTLY VIEWED
            </Text>

            {recentChemicals.length === 0 ? (
              <View className="px-4 py-8">
                <Text
                  className="text-sm text-center"
                  style={{ color: isDark ? "#8696A0" : "#536471" }}
                >
                  No recent chemicals viewed
                </Text>
              </View>
            ) : (
              recentChemicals.map((chemical) => (
                <TouchableOpacity
                  key={chemical.id}
                  onPress={() => handleChemicalPress(chemical.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: "transparent",
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{
                        backgroundColor: isDark ? "#111B21" : "#F7F9F9",
                      }}
                    >
                      <Ionicons
                        name="flask-outline"
                        size={16}
                        color="#10B981"
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-sm font-medium mb-1"
                        style={{ color: isDark ? "#E9EDEF" : "#0F1419" }}
                        numberOfLines={1}
                      >
                        {chemical.name}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: isDark ? "#8696A0" : "#536471" }}
                        numberOfLines={1}
                      >
                        {chemical.formula}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Footer */}
          <View
            style={{
              marginTop: "auto",
              paddingHorizontal: 16,
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: isDark ? "#2A3942" : "#EFF3F4",
            }}
          >
            <TouchableOpacity
              className="flex-row items-center py-3"
              activeOpacity={0.7}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={isDark ? "#8696A0" : "#536471"}
              />
              <Text
                className="text-sm ml-3"
                style={{ color: isDark ? "#8696A0" : "#536471" }}
              >
                Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-3"
              activeOpacity={0.7}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={isDark ? "#8696A0" : "#536471"}
              />
              <Text
                className="text-sm ml-3"
                style={{ color: isDark ? "#8696A0" : "#536471" }}
              >
                Help & Support
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}
