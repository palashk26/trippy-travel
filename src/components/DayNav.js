import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing } from '../theme/colors';

/**
 * DayNav — Sticky horizontal day selector (Tab style).
 * Includes "Checklist" as a tab + Day 1, Day 2...
 */
export default function DayNav({ days = [], activeDay, onDayPress }) {
  const tabs = [{ key: 'checklist', label: 'Checklist' }];
  days.forEach((day) => {
    tabs.push({ key: day.dayNumber, label: `Day ${day.dayNumber}` });
  });

  const navScrollRef = useRef(null);
  const tabPositions = useRef({});

  useEffect(() => {
    const x = tabPositions.current[activeDay];
    if (x !== undefined && navScrollRef.current) {
      navScrollRef.current.scrollTo({ 
        x: Math.max(0, x - Spacing.xl * 2), // Keep it nicely padded
        animated: true 
      });
    }
  }, [activeDay]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={navScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeDay;
          return (
            <Pressable
              key={tab.key}
              onLayout={(e) => { tabPositions.current[tab.key] = e.nativeEvent.layout.x; }}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onDayPress(tab.key)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  container: {
    paddingHorizontal: Spacing.xl,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: Spacing.lg,
  },
  tabActive: {
    borderBottomColor: Colors.orange,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  tabTextActive: {
    color: Colors.orange,
    ...Fonts.bold,
  },
});
