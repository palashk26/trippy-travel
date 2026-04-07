import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

/**
 * CheckoutCard — A simplified, icon-driven status card for Hotel Check-out.
 * Primarily used in the Master Trip Canvas for clear transitions.
 */
export default function CheckoutCard({ item, label = 'Hotel Check-out' }) {
  if (!item) return null;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="door-open" size={24} color={Colors.textSecondary} />
      </View>
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text 
          style={[styles.hotelName, item.isPlaceholder && styles.placeholderText]} 
          numberOfLines={1}
        >
          {item.isPlaceholder ? 'Book a hotel to see details' : item.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: 280, // Match CanvasCard width
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginRight: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    ...Fonts.bold,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
    marginHorizontal: 6,
  },
  time: {
    fontSize: 12,
    color: Colors.orange,
    ...Fonts.bold,
  },
  hotelName: {
    fontSize: 14, // Smaller heading
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  placeholderText: {
    fontSize: 13,
    color: Colors.textSecondary,
    ...Fonts.regular,
  },
  subText: {
    fontSize: 12,
    color: Colors.textMuted,
    ...Fonts.medium,
  },
  statusBadge: {
    marginLeft: Spacing.sm,
  },
});
