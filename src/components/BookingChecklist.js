import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

/**
 * BookingChecklist — Vertical timeline tracking 5 core booking anchors.
 * Design: dashed vertical line, gray pending nodes, green booked nodes.
 */
import { getItemById } from '../data/mockData';

const anchors = [
  { key: 'outboundFlight', label: 'Outbound Flight', subline: 'HYD → COK • Oct 12', icon: 'airplane', day: 1 },
  { key: 'hotel_alleppey', label: 'Hotel – Alleppey', subline: '2 Nights • Oct 12', icon: 'home', day: 1 },
  { key: 'transit_day3',   label: 'Inter-City Transfer', subline: 'Alleppey → Munnar • Oct 14', icon: 'repeat', day: 3 },
  { key: 'hotel_munnar',   label: 'Hotel – Munnar', subline: '1 Night • Oct 14', icon: 'home', day: 3 },
  { key: 'transit_day4',   label: 'Inter-City Transfer', subline: 'Munnar → Kochi • Oct 14', icon: 'repeat', day: 3 },
  { key: 'returnFlight',   label: 'Return Flight', subline: 'COK → HYD • Oct 14', icon: 'airplane', day: 3 },
];

export default function BookingChecklist({ locks = {}, onAnchorPress }) {

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Feather name="check-square" size={20} color={Colors.textPrimary} />
        <Text style={styles.heading}>Booking Checklist</Text>
      </View>

      {anchors.map((anchor) => {
        const lockedId = locks[anchor.key];
        const locked = !!lockedId;
        const lockedItem = lockedId ? getItemById(lockedId) : null;

        // Determine display subline
        let displaySubline = anchor.subline;
        if (locked && lockedItem) {
           if (lockedItem.airline) {
              displaySubline = `${lockedItem.airline} ${lockedItem.flightNo} • ${lockedItem.departTime}`;
           } else {
              displaySubline = lockedItem.name;
           }
        }

        return (
          <Pressable 
            key={anchor.key} 
            style={[styles.card, locked && styles.cardLocked]}
            onPress={() => onAnchorPress && onAnchorPress(anchor.day, anchor.key)}
          >
            <View style={styles.leftCol}>
              <View style={[styles.iconBox, locked ? styles.iconBoxLocked : styles.iconBoxPending]}>
                {anchor.icon === 'airplane' ? (
                  <Ionicons
                    name={locked ? 'checkmark' : anchor.icon}
                    size={14}
                    color={locked ? Colors.white : Colors.textMuted}
                  />
                ) : (
                  <Feather
                    name={locked ? 'check' : anchor.icon}
                    size={14}
                    color={locked ? Colors.white : Colors.textMuted}
                  />
                )}
              </View>
              <View style={styles.textWrap}>
                <Text style={[styles.label, locked && styles.labelLocked]}>{anchor.label}</Text>
                <Text style={styles.subline}>{displaySubline}</Text>
              </View>
            </View>

            <View style={[styles.badge, locked ? styles.badgeLocked : styles.badgePending]}>
              <Text style={[styles.badgeText, locked ? styles.badgeTextLocked : styles.badgeTextPending]}>
                {locked ? 'Added' : 'Select'}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xl,
    marginTop: 32,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 32,
  },
  heading: {
    fontSize: 17,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  cardLocked: {
    borderColor: 'rgba(255, 79, 23, 0.3)', // Colors.orange is #FF4F17
    backgroundColor: '#FFF8F5', 
  },
  leftCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxPending: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  iconBoxLocked: {
    backgroundColor: Colors.orange,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
    ...Fonts.semibold,
  },
  labelLocked: {
    color: Colors.textPrimary,
  },
  subline: {
    fontSize: 12,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginLeft: Spacing.sm,
  },
  badgePending: {
    backgroundColor: '#000000',
  },
  badgeLocked: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.orange,
  },
  badgeText: {
    fontSize: 11,
    ...Fonts.semibold,
  },
  badgeTextPending: {
    color: Colors.white,
  },
  badgeTextLocked: {
    color: Colors.orange,
  },
});
