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

  // Removed auto-scroll on activeDay change to prevent horizontal jitter
  // when user is just scrolling vertically through the page.

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={navScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
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
              {isActive && <View style={styles.tabIndicator} />}
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
    marginRight: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {},
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: Spacing.md,
    right: Spacing.md,
    height: 3,
    backgroundColor: Colors.orange,
    borderRadius: 3,
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
