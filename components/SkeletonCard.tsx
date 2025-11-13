import React, { useEffect, useRef } from 'react';
import { View, Animated, useColorScheme } from 'react-native';

export function SkeletonCard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      className="border-b px-4 py-4"
      style={{
        backgroundColor: isDark ? '#111B21' : '#FFFFFF',
        borderBottomColor: isDark ? '#2A3942' : '#EFF3F4',
      }}
    >
      <View className="flex-row items-start">
        {/* Icon skeleton */}
        <Animated.View
          className="w-12 h-12 rounded-full mr-3"
          style={{
            backgroundColor: isDark ? '#2A3942' : '#E5E7EB',
            opacity,
          }}
        />

        {/* Content skeleton */}
        <View className="flex-1">
          <Animated.View
            className="h-5 rounded mb-2"
            style={{
              backgroundColor: isDark ? '#2A3942' : '#E5E7EB',
              width: '70%',
              opacity,
            }}
          />
          <Animated.View
            className="h-4 rounded mb-2"
            style={{
              backgroundColor: isDark ? '#2A3942' : '#E5E7EB',
              width: '50%',
              opacity,
            }}
          />
          <Animated.View
            className="h-3 rounded"
            style={{
              backgroundColor: isDark ? '#2A3942' : '#E5E7EB',
              width: '40%',
              opacity,
            }}
          />
        </View>
      </View>
    </View>
  );
}
