import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

const defaultChips = [
  { key: 'beach',      label: 'Beach',            emoji: '🏖️' },
  { key: 'backwaters', label: 'Backwaters',        emoji: '🛶' },
  { key: 'historical', label: 'Historical Places', emoji: '🏛️' },
  { key: 'culture',    label: 'Local Culture',     emoji: '🎭' },
  { key: 'mountains',  label: 'Mountains',         emoji: '⛰️' },
];

export default function ChipSelector({ chips = defaultChips, onConfirm, locked = false, initialSelected = [] }) {
  const [selected, setSelected] = useState(new Set(initialSelected));

  const toggle = (key) => {
    if (locked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.chipWrap}>
        {chips.map((chip) => {
          const isActive = selected.has(chip.key);
          return (
            <Pressable
              key={chip.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => toggle(chip.key)}
            >
              <Text style={styles.emoji}>{chip.emoji}</Text>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {onConfirm && !locked && (
        <Pressable
          style={styles.confirmBtn}
          onPress={() => onConfirm([...selected])}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 60, // Align with bot message bubble start
    paddingRight: Spacing.xl,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight,
  },
  emoji: { fontSize: 15 },
  chipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  chipTextActive: {
    color: Colors.purple,
    ...Fonts.semibold,
  },
  confirmBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  confirmText: {
    color: Colors.white,
    fontSize: 14,
    ...Fonts.semibold,
  },
});
