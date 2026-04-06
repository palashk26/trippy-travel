import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
import ChatBubble from './ChatBubble';
import ChipSelector from './ChipSelector';
import ThoughtBubble from './ThoughtBubble';
import TrippyAvatar from './TrippyAvatar';
import useTripStore from '../store/tripStore';
import { keralaTripTemplate } from '../data/mockData';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SUGGESTIONS = [
  { emoji: '💵', text: 'Show me budget\ntrips under 40K' },
  { emoji: '📅', text: 'Possible trips\nfor 4 days' },
  { emoji: '🧗', text: 'Long weekend\ngetaways' },
  { emoji: '🏖️', text: 'Find a destination\nwith beach' },
];

const BUDGET_RANGES = [
  { key: 'economy', label: 'Economy', desc: 'Value-focused', emoji: '💰' },
  { key: 'standard', label: 'Standard', desc: 'Comfortable', emoji: '💳' },
  { key: 'luxury', label: 'Luxury', desc: 'Premium stays', emoji: '✨' },
  { key: 'elite', label: 'Elite', desc: 'Ultimate luxury', emoji: '👑' },
];

export default function ChatModal({ visible, onClose, onTripCreated }) {
  const step = useTripStore((s) => s.plannerStep);
  const messages = useTripStore((s) => s.plannerMessages);
  const setStep = useTripStore((s) => s.setPlannerStep);
  const addMessagesToStore = useTripStore((s) => s.addPlannerMessages);
  const updatePlannerMessage = useTripStore((s) => s.updatePlannerMessage);

  const [inputText, setInputText] = useState('');
  const [typedTitle, setTypedTitle] = useState('');
  const [typedSub, setTypedSub] = useState('');
  const [showActionables, setShowActionables] = useState(false);
  const showSubOpacity = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const autoTypeRef = useRef(null);
  const isAutoTyping = useRef(false);
  const createTrip = useTripStore((s) => s.createTrip);

  const [scrollOffset, setScrollOffset] = useState(0);

  const addMessages = useCallback((newMsgs) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    addMessagesToStore(newMsgs);
    setTimeout(() => scrollRef.current?.scrollToOffset({ offset: 0, animated: true }), 150);
  }, [addMessagesToStore]);

  // No reset on open - persistent!
  // But we no longer add a bot message here. 
  // We'll show the welcome cards instead if length is 0.
  const fullTitle = "So, what's on your mind?";
  const fullSub = "Let's plan your next trip together";

  // Auto-typing engine for subsequent steps
  useEffect(() => {
    if (!visible) {
      if (autoTypeRef.current) clearInterval(autoTypeRef.current);
      return;
    }

    return () => {
      if (autoTypeRef.current) clearInterval(autoTypeRef.current);
    };
  }, [visible, messages.length, step]);

  useEffect(() => {
    if (visible && messages.length === 0) {
      // Reset
      setTypedTitle('');
      setTypedSub(fullSub); // Pre-set the text for the fade-in
      showSubOpacity.setValue(0);
      setInputText('');

      let tIdx = 0;
      const tInterval = setInterval(() => {
        if (tIdx < fullTitle.length) {
          setTypedTitle(fullTitle.substring(0, tIdx + 1));
          tIdx++;
        } else {
          clearInterval(tInterval);

          // Sequence: Wait -> Then Fade in Subtitle
          Animated.sequence([
            Animated.delay(500),
            Animated.timing(showSubOpacity, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            })
          ]).start(() => {
            // Stage 3: Type sample prompt into Input Box
            const promptStr = "Plan a 3 day trip to Kerala.";
            let pIdx = 0;
            const pInterval = setInterval(() => {
              if (pIdx < promptStr.length) {
                setInputText(promptStr.substring(0, pIdx + 1));
                pIdx++;
              } else {
                clearInterval(pInterval);
              }
            }, 30);
            // Cleanup for pInterval
            autoTypeRef.current = pInterval;
          });
        }
      }, 40);

      return () => {
        clearInterval(tInterval);
        setShowActionables(false);
        if (autoTypeRef.current) clearInterval(autoTypeRef.current);
      };
    }
  }, [visible, messages.length]);

  useEffect(() => {
    // Just for analytics or meta logic if needed, 
    // but we don't push a message here anymore.
  }, [visible, messages.length]);

  const advanceStep = useCallback(
    (userText) => {
      const currentStep = step;

      const thoughtId = Date.now().toString();

      switch (currentStep) {
        case 0: {
          const display = userText || 'Plan a solo trip to Kerala';
          addMessages([{ sender: 'user', text: display }]);

          // Logic: Check if duration is already provided
          const hasDuration = /day|days|night|nights/i.test(display);
          const nextBotText = hasDuration
            ? "Got it, I've noted the 3-day duration! Which specific dates are you thinking of for Kerala?"
            : "Great! When are you planning to go and for how long?";

          setStep(1);
          setTimeout(() => {
            addMessages([{
              id: thoughtId,
              sender: 'thoughts',
              title: 'Destination Mapping',
              thoughts: ['Analyzing travel trends', 'Fetching weather for Kerala'],
              isCompleted: false
            }]);
          }, 400);
          setTimeout(() => {
            updatePlannerMessage(m => m.id === thoughtId, m => ({ ...m, isCompleted: true }));
            addMessages([{ sender: 'bot', text: nextBotText }]);
          }, 2000);
          break;
        }
        case 1: {
          const display = userText || 'April for 5 days';
          addMessages([{ sender: 'user', text: display }]);
          setStep(2);
          setTimeout(() => {
            addMessages([{
              id: thoughtId,
              sender: 'thoughts',
              title: 'Calendar Optimization',
              thoughts: ['Verifying availability', 'Optimizing pace'],
              isCompleted: false
            }]);
          }, 400);
          setTimeout(() => {
            updatePlannerMessage(m => m.id === thoughtId, m => ({ ...m, isCompleted: true }));
            addMessages([
              { sender: 'bot', text: 'Perfect, and what are you planning to explore in Kerala?' },
              { sender: 'chips' },
            ]);
          }, 2000);
          break;
        }
        case 2: {
          const selectedArr = Array.isArray(userText) ? userText : (userText || '').split(', ');

          // Capitalize selections for display
          const capitalizedArr = selectedArr.map(s => {
            if (!s) return s;
            return s.charAt(0).toUpperCase() + s.slice(1);
          });

          // Update the chips message with the selection to persist UI state
          updatePlannerMessage(m => m.sender === 'chips', m => ({ ...m, selected: selectedArr }));

          addMessages([{ sender: 'user', text: capitalizedArr.join(', ') || 'Beach, Backwaters, Mountains' }]);
          setStep(3);
          setTimeout(() => {
            addMessages([{
              id: thoughtId,
              sender: 'thoughts',
              title: 'Attraction Scouting',
              thoughts: ['Clustering destinations', 'Ranking attractions'],
              isCompleted: false
            }]);
          }, 400);
          setTimeout(() => {
            updatePlannerMessage(m => m.id === thoughtId, m => ({ ...m, isCompleted: true }));
            addMessages([
              { sender: 'bot', text: 'Got it. To help with transportation planning, where will you be traveling from?' }
            ]);
          }, 2000);
          break;
        }
        case 3: {
          const display = userText || 'Hyderabad';
          addMessages([{ sender: 'user', text: display }]);
          setStep(4);
          setTimeout(() => {
            addMessages([{
              id: thoughtId,
              sender: 'thoughts',
              title: 'Route Intelligence',
              thoughts: ['Mapping flight routes', 'Calculating direct flights'],
              isCompleted: false
            }]);
          }, 400);
          setTimeout(() => {
            updatePlannerMessage(m => m.id === thoughtId, m => ({ ...m, isCompleted: true }));
            addMessages([
              { sender: 'bot', text: "Understood. What's your budget range for this trip?" },
              { sender: 'budget' }
            ]);
          }, 2000);
          break;
        }
        case 4: {
          const selectedLabel = userText || 'Standard';
          // Update the budget message with the selection to persist UI state
          updatePlannerMessage(m => m.sender === 'budget', m => ({ ...m, selected: selectedLabel }));

          addMessages([{ sender: 'user', text: selectedLabel }]);
          setStep(5);
          setTimeout(() => {
            addMessages([{
              id: thoughtId,
              sender: 'thoughts',
              title: 'Stay Optimization',
              thoughts: ['Filtering premium stays', 'Comparing local prices'],
              isCompleted: false
            }]);
          }, 400);
          setTimeout(() => {
            updatePlannerMessage(m => m.id === thoughtId, m => ({ ...m, isCompleted: true }));
            addMessages([{ sender: 'bot', text: 'Last one — anything else I should keep in mind? (e.g. food, pace, or special interests)' }]);
          }, 2000);
          break;
        }
        case 5: {
          const display = userText || 'I want a relaxed pace';
          addMessages([{ sender: 'user', text: display }]);
          setStep(6);
          setTimeout(() => {
            addMessages([{
              id: thoughtId,
              sender: 'thoughts',
              title: 'Building Itinerary',
              thoughts: ['Finalizing itinerary', 'Securing AI top picks'],
              isCompleted: false
            }]);
          }, 400);
          setTimeout(() => {
            updatePlannerMessage(m => m.id === thoughtId, m => ({ ...m, isCompleted: true }));
            addMessages([{ sender: 'bot', text: "🎉 Your trip plan is ready! I've curated the perfect Kerala itinerary based on your preferences." }]);
            addMessages([{ sender: 'viewPlan' }]);
            setStep(7);
          }, 2500);
          break;
        }
        default:
          break;
      }
      setInputText('');
    },
    [step, addMessages]
  );

  const handleSend = () => {
    if (step === 2 || step === 4) return; // 2=Interests, 4=Budget are selection chips
    if (!inputText.trim()) return;
    advanceStep(inputText.trim());
  };

  const handleViewTripPlan = () => {
    const tripData = { ...keralaTripTemplate };
    createTrip(tripData);
    onClose();
    if (onTripCreated) onTripCreated(tripData.id);
  };

  // ─── Render ────────────────────────────────────────────────────
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={{ margin: 0, justifyContent: 'flex-end', backgroundColor: 'transparent' }}
      backdropColor={Colors.black}
      backdropOpacity={0.4}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver={Platform.OS !== 'web'}
      useNativeDriverForBackdrop={Platform.OS !== 'web'}
      hideModalContentWhileAnimating={true}
      avoidKeyboard
    >
      <View style={styles.container}>
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={22} color={Colors.textPrimary} />
        </Pressable>

        {/* Handle bar */}
        <View style={styles.handleBar}>
          <View style={styles.handle} />
        </View>

        <FlatList
          ref={scrollRef}
          data={[...messages].reverse()}
          inverted
          keyExtractor={(_, index) => index.toString()}
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={<View style={{ height: 20 }} />}
          ListFooterComponent={
            // physically Top because it's an inverted list
            step === 0 && messages.length === 0 ? (
              <View style={styles.welcomeContainer}>
                {/* Trippy avatar */}
                <View style={styles.avatar}>
                  <TrippyAvatar size={60} />
                </View>
                <Text style={styles.welcomeTitle}>
                  {typedTitle}
                </Text>
                <Animated.Text style={[styles.welcomeSubtitle, { opacity: showSubOpacity }]}>
                  {typedSub}
                </Animated.Text>

                {/* Suggestion cards (instant) */}
                <View style={styles.suggestionsGrid}>
                  {SUGGESTIONS.map((s, i) => (
                    <Pressable
                      key={i}
                      style={styles.suggestionCard}
                      onPress={() => advanceStep(s.text)}
                    >
                      <Text style={styles.suggestionEmoji}>{s.emoji}</Text>
                      <Text style={styles.suggestionText}>{s.text}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : <View style={{ height: 20 }} /> // Spacer at the physical top
          }
          renderItem={({ item: msg, index }) => {
            if (msg.sender === 'chips') {
              return (
                <ChipSelector
                  key={'cs_' + index}
                  initialSelected={msg.selected || []}
                  locked={index > 0}
                  onConfirm={(selectedArr) => {
                    advanceStep(selectedArr);
                  }}
                />
              );
            }
            if (msg.sender === 'budget') {
              const isLocked = index > 0;
              return (
                <View key={'bg_' + index} style={styles.budgetChipWrap}>
                  {BUDGET_RANGES.map((b) => {
                    const isActive = msg.selected === b.label;
                    return (
                      <Pressable
                        key={b.key}
                        style={[styles.budgetChip, isActive && styles.budgetChipActive]}
                        onPress={() => !isLocked && advanceStep(b.label)}
                      >
                        <Text style={styles.budgetEmoji}>{b.emoji}</Text>
                        <Text style={[styles.budgetLabel, isActive && styles.budgetLabelActive]}>{b.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              );
            }
            if (msg.sender === 'thoughts') {
              return <ThoughtBubble key={'tb_' + index} thoughts={msg.thoughts} isCompleted={msg.isCompleted} title={msg.title} />;
            }
            if (msg.sender === 'viewPlan') {
              return (
                <View key={'vp_' + index} style={styles.viewPlanWrap}>
                  <Pressable
                    style={styles.viewPlanBtn}
                    onPress={handleViewTripPlan}
                  >
                    <Feather name="map" size={18} color={Colors.textWhite} />
                    <Text style={styles.viewPlanText}>View Trip Plan</Text>
                  </Pressable>
                </View>
              );
            }
            return (
              <ChatBubble
                key={'cb_' + index}
                text={msg.text}
                sender={msg.sender}
              />
            );
          }}
        />

        {/* Input bar */}
        {step > 0 && step < 6 && step !== 2 && step !== 4 && (
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder={
                step === 1
                  ? (messages.some(m => m.sender === 'user' && /day|days/i.test(m.text)) ? '12th Oct' : 'April for 5 days')
                  : step === 3
                    ? 'Hyderabad'
                    : 'Chill, adventure...'
              }
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.sendBtn, !inputText.trim() && { backgroundColor: 'transparent' }]}
              onPress={handleSend}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="send" size={18} color={inputText.trim() ? Colors.textWhite : Colors.textPrimary} />
            </Pressable>
          </View>
        )}

        {/* Static input bar for welcome & complete states */}
        {(step === 0 || step >= 6) && (
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="Where to next?"
              placeholderTextColor={Colors.textMuted}
              editable={step === 0}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => {
                if (step === 0 && inputText.trim()) {
                  advanceStep(inputText.trim());
                }
              }}
            />
            <Pressable
              style={[styles.sendBtn, !inputText.trim() && { backgroundColor: 'transparent' }]}
              onPress={() => {
                const text = inputText.trim();
                if (!text) return;

                if (step === 0) {
                  advanceStep(text);
                } else {
                  // Fallback for post-generation or other states
                  handleSend();
                }
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="send" size={18} color={inputText.trim() ? Colors.textWhite : Colors.textPrimary} />
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
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
    paddingBottom: Spacing.xl,
    flexGrow: 1, // Ensures content stays bottom-aligned if list is short
  },

  // Welcome
  welcomeContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: 22,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    ...Fonts.bold,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    ...Fonts.regular,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  suggestionCard: {
    width: '45%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  suggestionEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 18,
    ...Fonts.semibold,
  },

  // View Trip Plan
  viewPlanWrap: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  viewPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.orange,   // transactional CTA — book/commit action
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  viewPlanText: {
    fontSize: 16,
    color: Colors.textWhite,
    ...Fonts.bold,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingRight: Spacing.sm,
    paddingVertical: 10,
    marginBottom: Platform.OS === 'ios' ? 32 : Spacing.xl,
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
    paddingHorizontal: Spacing.lg,
    fontSize: 15,
    color: Colors.textPrimary,
    ...Fonts.medium,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.purple,   // AI send action
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 60, // Align with bot message bubble start
    paddingRight: Spacing.xl,
    paddingVertical: Spacing.sm,
    gap: 10,
    marginBottom: Spacing.md,
  },
  budgetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  budgetChipActive: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight,
  },
  budgetEmoji: { fontSize: 15 },
  budgetLabel: { fontSize: 13, color: Colors.textSecondary, ...Fonts.medium },
  budgetLabelActive: { color: Colors.purple, ...Fonts.semibold },
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
  },
});
