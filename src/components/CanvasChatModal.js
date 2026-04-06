import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, FlatList, StyleSheet, Dimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';
import ChatBubble from './ChatBubble';
import ThoughtBubble from './ThoughtBubble';
import useTripStore from '../store/tripStore';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SUGGESTIONS = [
  { emoji: '🏨', text: 'Find cheaper hotels' },
  { emoji: '🌴', text: 'Add another day' },
  { emoji: '🥘', text: 'Suggest local dining' },
];

export default function CanvasChatModal({ visible, onClose }) {
  const { 
    canvasMessages: messages, 
    addCanvasMessages: addMessagesToStore, 
    updateCanvasMessage 
  } = useTripStore();
  
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const addMessages = useCallback((newMsgs) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addMessagesToStore(newMsgs);
    setTimeout(() => scrollRef.current?.scrollToOffset({ offset: 0, animated: true }), 150);
  }, [addMessagesToStore]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    const thoughtId = Date.now().toString();
    
    // 1. Add User Message
    addMessages([{ sender: 'user', text: userMsg }]);
    setInputText('');

    // 2. Add Thoughts (2 lines) after a short delay
    setTimeout(() => {
      addMessages([{ 
        id: thoughtId,
        sender: 'thoughts', 
        thoughts: ['Analyzing trip context', 'Finding optimal matches'],
        isCompleted: false 
      }]);
    }, 400);

    // 3. Mark completed and add bot message AFTER thoughts reveal
    setTimeout(() => {
      updateCanvasMessage(m => m.id === thoughtId, m => ({ ...m, isCompleted: true }));
      addMessages([
        { sender: 'bot', text: 'Got it! I am looking for options that match your request. I will update your trip canvas shortly.' }
      ]);
    }, 2000);
  };

  const [scrollOffset, setScrollOffset] = useState(0);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: 'flex-end', backgroundColor: 'transparent' }}
      backdropColor={Colors.black}
      backdropOpacity={0.4}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      avoidKeyboard
    >
      <View style={styles.sheet}>
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={22} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.handleBar}>
          <View style={styles.handle} />
        </View>

        <FlatList
          data={[...messages].reverse()}
          inverted
          keyExtractor={(_, index) => index.toString()}
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            messages[messages.length - 1].sender === 'bot' ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.suggestionsScroll} 
                contentContainerStyle={{ paddingHorizontal: Spacing.xl }}
              >
                {SUGGESTIONS.map((s, i) => (
                  <Pressable
                    key={i}
                    style={styles.suggestionChip}
                    onPress={() => setInputText(s.text)}
                  >
                    <Text style={styles.suggestionEmoji}>{s.emoji}</Text>
                    <Text style={styles.suggestionText}>{s.text}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null
          }
          ListFooterComponent={<View style={{ height: 20 }} />}
          renderItem={({ item: msg, index }) => {
            if (msg.sender === 'thoughts') {
              return <ThoughtBubble key={'tb_'+index} thoughts={msg.thoughts} isCompleted={msg.isCompleted} />;
            }
            return (
              <ChatBubble
                key={'cb_'+index}
                text={msg.text}
                sender={msg.sender}
              />
            );
          }}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask Trippy to change anything..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <Pressable 
            style={[styles.sendBtn, !inputText.trim() && { backgroundColor: 'transparent' }]} 
            onPress={handleSend}
          >
            <Feather name="send" size={18} color={inputText.trim() ? Colors.white : Colors.textPrimary} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: SCREEN_HEIGHT * 0.75,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    flexDirection: 'column',
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
    flexGrow: 1, // Ensures items sit at bottom if less than sheet height
  },
  suggestionsScroll: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    marginRight: Spacing.md,
  },
  suggestionEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 13,
    color: Colors.textPrimary,
    ...Fonts.medium,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingRight: Spacing.sm,
    paddingVertical: 10,
    marginBottom: 32,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: 'transparent',
    fontSize: 15,
    color: Colors.textPrimary,
    ...Fonts.medium,
    paddingHorizontal: Spacing.md,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleBar: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});

