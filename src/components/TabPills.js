import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

const defaultTabs = [
  { key: 'active',   label: 'Active',   icon: 'time' },
  { key: 'planning', label: 'Planning', icon: 'map' },
  { key: 'flight',   label: 'Flights',  icon: 'airplane' },
  { key: 'hotel',    label: 'Hotels',   icon: 'home' },
  { key: 'bus',      label: 'Bus',      icon: 'bus' },
];

/**
 * TabPills — Horizontal icon+label tabs.
 * Active state: black icon wrap + bold label.
 */
export default function TabPills({ tabs = defaultTabs, activeKey = 'planning', onTabPress }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.container}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          // Use filled for active, outline for inactive
          const iconName = isActive ? tab.icon : `${tab.icon}-outline`;

          return (
            <Pressable
              key={tab.key}
              style={styles.pill}
              onPress={() => {
                if (onTabPress) onTabPress(tab.key);
              }}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Ionicons
                  name={iconName}
                  size={21}
                  color={isActive ? Colors.white : '#000000'}
                />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
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
    paddingVertical: Spacing.md,
    gap: Spacing.xl,
  },
  pill: {
    alignItems: 'center',
    gap: 5,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  iconWrapActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  label: {
    fontSize: 13,
    color: '#000000',
    opacity: 0.5, // Reduced opacity instead of weight for stability
    ...Fonts.bold, 
  },
  labelActive: {
    color: '#000000',
    opacity: 1,
    ...Fonts.bold,
  },
});
