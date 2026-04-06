import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

export default function ThoughtBubble({ thoughts, isCompleted = false, title }) {
  const [visibleCount, setVisibleCount] = useState(isCompleted ? thoughts.length : 0);

  useEffect(() => {
    if (isCompleted) {
      if (visibleCount !== thoughts.length) {
        setVisibleCount(thoughts.length);
      }
      return;
    }

    if (visibleCount < thoughts.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 600); // Reveal a new thought every 600ms
      return () => clearTimeout(timer);
    }
  }, [visibleCount, thoughts, isCompleted]);

  return (
    <View style={styles.wrapper}>
      {/* Invisible spacer to match avatar width + gap in ChatBubble */}
      <View style={styles.avatarSpacer} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>{visibleCount < thoughts.length ? '⚙️' : '✅'}</Text>
          <Text style={styles.headerTitle}>
            {visibleCount < thoughts.length 
              ? `${title || 'Calculating'}...` 
              : `${title || 'Trippy Intelligence'}`}
          </Text>
        </View>
        <View style={styles.thoughtList}>
          {thoughts.slice(0, visibleCount).map((thought, i) => (
            <View key={i} style={styles.thoughtRow}>
              <View style={styles.dot} />
              <Text style={styles.thoughtText}>{thought}</Text>
            </View>
          ))}
          {visibleCount < thoughts.length && (
            <View style={styles.thoughtRow}>
              <View style={[styles.dot, { opacity: 0.3 }]} />
              <Text style={[styles.thoughtText, { color: Colors.textMuted }]}>
                {thoughts[visibleCount].substring(0, 10)}...
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  avatarSpacer: {
    width: 28,
  },
  container: {
    flex: 1,
    maxWidth: '72%',
    backgroundColor: '#FBF9FF',
    borderRadius: Radius.lg,
    borderBottomLeftRadius: Radius.xs,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E8DEFF',
    borderStyle: 'dashed',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: 6,
  },
  headerEmoji: { fontSize: 13 },
  headerTitle: {
    fontSize: 11,
    color: Colors.purple,
    ...Fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  thoughtList: { gap: 6 },
  thoughtRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.purple,
    marginTop: 7,
  },
  thoughtText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    ...Fonts.medium,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
