import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Animated } from 'react-native';

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scaleAnims = useRef(tabs.map(() => new Animated.Value(1))).current;
  const underlinePosition = useRef(new Animated.Value(0)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const tabLayouts = useRef<{ x: number; width: number }[]>([]).current;

  useEffect(() => {
    const activeIndex = tabs.indexOf(activeTab);
    if (activeIndex !== -1 && tabLayouts[activeIndex]) {
      Animated.parallel([
        Animated.spring(underlinePosition, {
          toValue: tabLayouts[activeIndex].x,
          useNativeDriver: false,
          tension: 100,
          friction: 10,
        }),
        Animated.spring(underlineWidth, {
          toValue: tabLayouts[activeIndex].width,
          useNativeDriver: false,
          tension: 100,
          friction: 10,
        }),
      ]).start();
    }
  }, [activeTab, tabs]);

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 7,
    }).start();
  };

  const handleLayout = (index: number, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    tabLayouts[index] = { x, width };
    
    // Initialize underline position on first render
    if (tabs[index] === activeTab && !tabLayouts.some(layout => layout && layout.width > 0)) {
      underlinePosition.setValue(x);
      underlineWidth.setValue(width);
    }
  };

  return (
    <View 
      className="border-b"
      style={{ borderBottomColor: isDark ? '#2A3942' : '#EFF3F4' }}
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ position: 'relative', flexDirection: 'row' }}>
          {tabs.map((tab, index) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => onTabChange(tab)}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                onLayout={(event) => handleLayout(index, event)}
                className="px-6 py-3"
                activeOpacity={1}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnims[index] }] }}>
                  <Text
                    className="text-center font-semibold text-base"
                    style={{
                      color: isActive 
                        ? (isDark ? '#E9EDEF' : '#0F1419')
                        : (isDark ? '#8696A0' : '#536471')
                    }}
                  >
                    {tab}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
          
          {/* Animated Underline - Twitter Style */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: underlinePosition,
              width: underlineWidth,
              height: 4,
              backgroundColor: '#10B981',
              borderRadius: 2,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
