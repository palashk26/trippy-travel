import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';
import TrippyAvatar from './TrippyAvatar';

/**
 * ChatBubble – Renders a single chat message.
 * sender: 'bot' | 'user'
 * Bot: white card, slate border
 * User: AI Purple fill, white text
 */
export default function ChatBubble({ text, sender = 'bot' }) {
  const isUser = sender === 'user';
  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && (
        <TrippyAvatar size={28} />
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.text, isUser && styles.textUser]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  avatarEmoji: { fontSize: 14 },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  bubbleBot: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: Radius.xs,
  },
  bubbleUser: {
    backgroundColor: Colors.purple,
    borderBottomRightRadius: Radius.xs,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textPrimary,
    ...Fonts.regular,
  },
  textUser: {
    color: Colors.white,
    ...Fonts.medium,
  },
});
