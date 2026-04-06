import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getItemById } from '../data/mockData';
import useTripStore from '../store/tripStore';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

/**
 * CheckoutBar — Sticky bottom bar on TripCanvasScreen.
 * Transactional CTA → orange (#FF4F17). Eyebrow label is uppercase.
 */
export default function CheckoutBar({ onCheckout, onSave }) {
  const locks = useTripStore((s) => s.locks);
  const hasUnsavedChanges = useTripStore((s) => s.hasUnsavedChanges);

  const totalPrice = Object.values(locks).reduce((sum, val) => {
    if (Array.isArray(val)) {
      return sum + val.reduce((s, id) => {
        const item = getItemById(id);
        return s + (item ? (item.totalPrice ?? item.price ?? 0) : 0);
      }, 0);
    }
    if (val) {
      const item = getItemById(val);
      return sum + (item ? (item.totalPrice ?? item.price ?? 0) : 0);
    }
    return sum;
  }, 0);

  const coreKeys = ['outboundFlight', 'hotel_alleppey', 'hotel_munnar', 'returnFlight'];
  const anchorsDone = coreKeys.filter((k) => locks[k] != null).length;
  const locked = anchorsDone;
  const total = 4;
  const allDone = anchorsDone === 4;
  const isDisabled = !hasUnsavedChanges && !allDone;

  const handlePress = () => {
    if (hasUnsavedChanges) {
      onSave && onSave();
    } else {
      onCheckout && onCheckout();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.priceCol}>
        <Text style={styles.eyebrow}>ESTIMATED COST</Text>
        <Text style={styles.price}>
          {totalPrice > 0 ? `₹${totalPrice.toLocaleString('en-IN')}` : '—'}
        </Text>
        <Text style={styles.progress}>{locked}/{total} items added</Text>
      </View>

      <Pressable
        style={[
          styles.cta, 
          isDisabled && styles.ctaDisabled,
          !hasUnsavedChanges && allDone && styles.ctaReady,
          hasUnsavedChanges && styles.ctaSave
        ]}
        onPress={handlePress}
        disabled={isDisabled}
      >
        <Text style={[styles.ctaText, isDisabled && styles.ctaTextDisabled]}>
          {hasUnsavedChanges ? 'Save' : (allDone ? 'Review & Book' : `Add ${locked}/${total} to Book`)}
        </Text>
        <Feather name={hasUnsavedChanges ? 'save' : (allDone ? 'check-circle' : 'arrow-right')} size={16} color={isDisabled ? Colors.textMuted : Colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.lg,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  priceCol: { flex: 1 },
  eyebrow: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
    ...Fonts.extrabold,
  },
  price: {
    fontSize: 22,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  progress: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    ...Fonts.regular,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.black,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 13,
    borderRadius: Radius.sm,
  },
  ctaReady: {
    backgroundColor: Colors.orange,  // transactional orange for final book action
  },
  ctaSave: {
    backgroundColor: '#005CEE', // Clear blue for saving changes
  },
  ctaDisabled: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ctaText: {
    fontSize: 13,
    color: Colors.white,
    ...Fonts.semibold,
  },
  ctaTextDisabled: {
    color: Colors.textMuted,
  },
});
