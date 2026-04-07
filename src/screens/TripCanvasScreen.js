import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';
import DayNav from '../components/DayNav';
import CanvasCard from '../components/CanvasCard';
import BookingChecklist from '../components/BookingChecklist';
import CheckoutCard from '../components/CheckoutCard';
import CheckoutBar from '../components/CheckoutBar';
import QuickLookModal from '../components/QuickLookModal';
import MoreOptionsModal from '../components/MoreOptionsModal';
import CanvasChatModal from '../components/CanvasChatModal';
import TrippyAvatar from '../components/TrippyAvatar';
import useTripStore from '../store/tripStore';
import { getItemById } from '../data/mockData';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 59; 
const TABS_HEIGHT = 60;

/**
 * TripCanvasScreen — The Master Trip Canvas (Hub).
 * Displays the generated multi-day itinerary with:
 * - Hero image + trip meta
 * - Sticky DayNav pills
 * - Per-day sections with timeline and horizontally scrollable cards
 * - Booking Checklist
 * - CheckoutBar at bottom
 */
export default function TripCanvasScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const savedTrips = useTripStore((s) => s.savedTrips);
  const activeTripId = useTripStore((s) => s.activeTripId);
  // Use route param tripId first (from new trip creation), fallback to activeTripId (from revisit)
  const lookupId = route.params?.tripId || activeTripId;
  const trip = savedTrips.find((t) => t.id === lookupId) || null;
  const locks = useTripStore((s) => s.locks);
  const lockItem = useTripStore((s) => s.lockItem);
  const unlockItem = useTripStore((s) => s.unlockItem);
  const isLocked = useTripStore((s) => s.isLocked);

  const [activeDay, setActiveDay] = useState('checklist');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [quickLookItem, setQuickLookItem] = useState(null);
  const [quickLookType, setQuickLookType] = useState('hotel');
  const [quickLookLockKey, setQuickLookLockKey] = useState(null);
  const [canvasChatVisible, setCanvasChatVisible] = useState(false);
  const [displayedChatText, setDisplayedChatText] = useState('');

  // Advanced multi-stage typewriter animation
  useEffect(() => {
    const words = ['flights', 'dates', 'anything'];
    const base = "Ask Trippy to change ";
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const currentWord = words[wordIdx];
      const fullText = base + currentWord;

      // Use LayoutAnimation for a smooth "growing/shrinking" pill effect
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      if (!isDeleting) {
        // Typing forward
        setDisplayedChatText(fullText.slice(0, base.length + charIdx + 1));
        charIdx++;

        if (charIdx === currentWord.length) {
          if (wordIdx === words.length - 1) {
            // Final reduction stage
            timeout = setTimeout(() => {
              const target = "Ask Trippy";
              let finalCharIdx = fullText.length;
              const reduce = () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                if (finalCharIdx > target.length) {
                  finalCharIdx--;
                  setDisplayedChatText(fullText.slice(0, finalCharIdx));
                  timeout = setTimeout(reduce, 40);
                }
              };
              reduce();
            }, 2500);
            return;
          }
          // Hold the full word for a bit before starting to delete
          timeout = setTimeout(() => {
            isDeleting = true;
            type();
          }, 2000);
          return;
        }
      } else {
        // Backspacing
        setDisplayedChatText(fullText.slice(0, base.length + charIdx - 1));
        charIdx--;

        if (charIdx === 0) {
          isDeleting = false;
          wordIdx++;
          // Brief pause before typing the next word
          timeout = setTimeout(type, 300);
          return;
        }
      }

      // Speed control: faster when deleting, standard when typing
      timeout = setTimeout(type, isDeleting ? 30 : 60);
    };

    // Initial delay for the screen to settle
    const initialTimer = setTimeout(type, 1200);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timeout);
    };
  }, []);
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const [moreOptionsType, setMoreOptionsType] = useState('activity');
  const [moreOptionsLockKey, setMoreOptionsLockKey] = useState(null);
  const [moreOptionsContext, setMoreOptionsContext] = useState(null); // Added context
  const [showSaveToast, setShowSaveToast] = useState(false);

  const saveChanges = useTripStore((s) => s.saveChanges);

  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const sectionLayouts = useRef({});
  const scrollRef = useRef(null);
  const currentYRef = useRef(0);
  const scrollAnimRef = useRef(null); // Keep a ref to the active animation
  const isSystemScrolling = useRef(false);

  const hasUnsavedChanges = useTripStore((s) => s.hasUnsavedChanges);

  // Track the current Y value for the manual "smooth scroll" start point
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      currentYRef.current = value;
    });
    return () => scrollY.removeListener(listenerId);
  }, [scrollY]);

  // Intercept back button removed

  if (!trip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active trip found.</Text>
          <Pressable
            style={styles.goBackBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goBackText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (e) => {
        if (isSystemScrolling.current) return;

        const y = e.nativeEvent.contentOffset.y;
        let currentActive = 'checklist';

        // Only consider 'checklist' and numeric day keys for the Tab Navigation highlight
        const offsets = Object.entries(sectionLayouts.current)
          .filter(([key]) => key === 'checklist' || !isNaN(key))
          .map(([key, val]) => ({ key, val }));

        offsets.sort((a, b) => a.val - b.val);

        for (let i = 0; i < offsets.length; i++) {
          if (y >= offsets[i].val - (HEADER_HEIGHT + TABS_HEIGHT + 40)) {
            currentActive = isNaN(offsets[i].key) ? offsets[i].key : parseInt(offsets[i].key, 10);
          }
        }

        if (activeDay !== currentActive) {
          setActiveDay(currentActive);
        }
      },
    }
  );

  const handleDayPress = (key) => {
    isSystemScrolling.current = true;
    setActiveDay(key);
    const targetY = Math.max(0, (sectionLayouts.current[key.toString()] || 0) - (HEADER_HEIGHT + TABS_HEIGHT - 6));

    if (scrollRef.current) {
      if (scrollAnimRef.current) {
        scrollAnimRef.current.stopAnimation();
      }

      const scrollAnim = new Animated.Value(currentYRef.current);
      scrollAnimRef.current = scrollAnim;

      scrollAnim.addListener(({ value }) => {
        scrollRef.current?.scrollTo({ y: value, animated: false });
      });

      Animated.timing(scrollAnim, {
        toValue: targetY,
        duration: 850,
        easing: Easing.bezier(0.33, 1, 0.68, 1), // Custom smooth ease
        useNativeDriver: false,
      }).start(() => {
        isSystemScrolling.current = false;
        scrollAnim.removeAllListeners();
        scrollAnimRef.current = null;
      });
    }
  };

  const openQuickLook = (item, type, lockKey) => {
    setQuickLookItem(item);
    setQuickLookType(type);
    setQuickLookLockKey(lockKey);
  };

  const handleAddFromQuickLook = () => {
    if (quickLookItem && quickLookLockKey) {
      const isMulti = quickLookLockKey.startsWith('activities_');
      if (isMulti) {
        lockItem(quickLookLockKey, quickLookItem.id);
      } else {
        if (locks[quickLookLockKey] === quickLookItem.id) {
          unlockItem(quickLookLockKey);
        } else {
          lockItem(quickLookLockKey, quickLookItem.id);
        }
      }
    }
    setQuickLookItem(null);
  };

  const handleFullDetails = () => {
    setQuickLookItem(null);
    if (quickLookItem) {
      navigation.navigate('NativePDPScreen', {
        itemId: quickLookItem.id,
        type: quickLookType,
        lockKey: quickLookLockKey,
      });
    }
  };

  const handleSelectCard = (item, lockKey) => {
    const lockVal = locks[lockKey];
    const isMulti = lockKey.startsWith('activities_');

    if (isMulti) {
      lockItem(lockKey, item.id);
    } else {
      if (lockVal === item.id) {
        unlockItem(lockKey);
      } else {
        lockItem(lockKey, item.id);
      }
    }
  };

  const handleSelectMoreOption = (itemId) => {
    if (moreOptionsLockKey) {
      lockItem(moreOptionsLockKey, itemId);
    }
    setMoreOptionsVisible(false);
  };

  const handleSave = () => {
    saveChanges();
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3000); // Hide after 3 seconds
  };

  const getSectionIcon = (type) => {
    switch (type) {
      case 'flight':
        return 'send';
      case 'hotel':
        return 'home';
      case 'activity':
        return 'map';
      default:
        return 'circle';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Your itinerary</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Sticky Day Nav — clip container + native-driver slide-in from scrollY */}
        <View style={styles.dayNavClip}>
          <Animated.View
            style={[
              styles.stickyNavContainer,
              {
                transform: [{
                  translateY: scrollY.interpolate({
                    inputRange: [100, 130],
                    outputRange: [-TABS_HEIGHT, 0],
                    extrapolate: 'clamp',
                  })
                }]
              }
            ]}
          >
            <DayNav
              days={trip.days}
              activeDay={activeDay}
              onDayPress={handleDayPress}
            />
          </Animated.View>
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="always"
        >
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            <Image source={{ uri: trip.coverImage }} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroDuration}>{trip.duration}</Text>
              <Text style={styles.heroTitle}>{trip.title}</Text>
              <Text style={styles.heroSubtitle}>{trip.subtitle}</Text>
              <View style={styles.heroTags}>
                {trip.tags.map((tag, i) => (
                  <View key={i} style={styles.heroTag}>
                    <Text style={styles.heroTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Booking Checklist */}
          <View onLayout={(e) => sectionLayouts.current['checklist'] = e.nativeEvent.layout.y}>
            <BookingChecklist locks={locks} onAnchorPress={(dayNumber, anchorKey) => {
              const sectionY = sectionLayouts.current[anchorKey];
              const dayY = sectionLayouts.current[dayNumber];
              const targetY = Math.max(0, sectionY !== undefined ? sectionY - 80 : (dayY !== undefined ? dayY - 120 : 0));

              if (scrollRef.current) {
                if (scrollAnimRef.current) scrollAnimRef.current.stopAnimation();

                const scrollAnim = new Animated.Value(currentYRef.current);
                scrollAnimRef.current = scrollAnim;

                scrollAnim.addListener(({ value }) => {
                  scrollRef.current?.scrollTo({ y: value, animated: false });
                });

                Animated.timing(scrollAnim, {
                  toValue: targetY,
                  duration: 850,
                  easing: Easing.bezier(0.33, 1, 0.68, 1),
                  useNativeDriver: false,
                }).start(() => {
                  scrollAnim.removeAllListeners();
                  scrollAnimRef.current = null;
                  setActiveDay(dayNumber);
                });
              }
            }} />
          </View>

          {/* Day Sections */}
          {trip.days.map((day) => (
            <View
              key={day.id}
              onLayout={(e) => sectionLayouts.current[day.dayNumber] = e.nativeEvent.layout.y}
              style={styles.daySection}
            >
              {/* Timeline stroke */}
              <View style={styles.dayTimelineStroke} />

              {/* Day header with timeline dot */}
              <View style={styles.dayHeader}>
                <Feather name="calendar" size={20} color={Colors.textPrimary} />
                <Text style={styles.dayTitle}>
                  Day {day.dayNumber} - {day.title}
                </Text>
              </View>

              {/* Sections within the day */}
              {day.sections.map((section, sIdx) => {
                let items = section.itemIds.map((id) => getItemById(id)).filter(Boolean);
                const lockVal = locks[section.lockKey];
                const isMulti = section.lockKey.startsWith('activities_');

                // If items are locked but not in the default list, add them to the list so they render
                if (isMulti && Array.isArray(lockVal)) {
                  const extraIds = lockVal.filter((id) => !section.itemIds.includes(id));
                  const extraItems = extraIds.map(id => getItemById(id)).filter(Boolean);
                  items = [...extraItems, ...items]; // Show newly added items first
                } else if (!isMulti && lockVal && !section.itemIds.includes(lockVal)) {
                  const extraItem = getItemById(lockVal);
                  if (extraItem) items.unshift(extraItem);
                }

                const isCheckout = section.label && section.label.includes('Check-out');
                if (isCheckout) {
                  const selectedItem = items.find(it => it.id === lockVal);
                  if (selectedItem) {
                    items = [selectedItem];
                  } else {
                    // Show a placeholder if nothing is selected yet
                    items = [{ id: `placeholder_${section.lockKey}`, name: 'Stay not selected', isPlaceholder: true }];
                  }
                }

                if (!items.length) return null;
                return (
                  <View
                    key={sIdx}
                    style={styles.sectionBlock}
                    onLayout={(e) => {
                      // Calculate absolute Y from start of content
                      const dayY = sectionLayouts.current[day.dayNumber] || 0;
                      sectionLayouts.current[section.lockKey] = dayY + e.nativeEvent.layout.y;
                    }}
                  >
                    {/* Section label row */}
                    <View style={styles.sectionLabelRow}>
                      <View style={styles.sectionDotWrap}>
                        <View style={styles.sectionDot} />
                      </View>
                      <Text style={styles.sectionLabel}>{section.label}</Text>
                    </View>

                    {/* Horizontally scrollable cards */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.cardsScroll}
                      contentContainerStyle={styles.cardsRow}
                    >
                      {items.map((item) => (
                        isCheckout ? (
                          <CheckoutCard
                            key={item.id}
                            item={item}
                            label={section.label}
                          />
                        ) : (
                          <CanvasCard
                            key={item.id}
                            item={item}
                            type={section.type}
                            isLocked={isMulti ? (Array.isArray(lockVal) && lockVal.includes(item.id)) : (lockVal === item.id)}
                            onMoreDetails={() => openQuickLook(item, section.type, section.lockKey)}
                            onSelect={() => handleSelectCard(item, section.lockKey)}
                          />
                        )
                      ))}

                      {/* Custom Option Card (Hides for check-out sections) */}
                      {!isCheckout && (
                        <Pressable
                          style={styles.customCard}
                          onPress={() => {
                            if (section.type === 'hotel' || section.type === 'flight') {
                              navigation.navigate('CleartripSearchScreen', { type: section.type });
                            } else {
                              setMoreOptionsType(section.type);
                              setMoreOptionsLockKey(section.lockKey);

                              // Determine context (area for hotels/activities, route for transit)
                              let context = null;
                              if (section.type === 'hotel' || section.type === 'activity') {
                                // Try to find a representative item to get the area
                                const firstItem = getItemById(section.itemIds[0]);
                                context = firstItem?.area;
                              } else if (section.type === 'transit') {
                                const firstItem = getItemById(section.itemIds[0]);
                                context = firstItem?.route;
                              }
                              setMoreOptionsContext(context);
                              setMoreOptionsVisible(true);
                            }
                          }}
                        >
                          <View style={styles.customCardIconBox}>
                            {section.type === 'flight' ? (
                              <Ionicons name="airplane" size={20} color={Colors.orange} />
                            ) : (
                              <Feather
                                name={section.type === 'hotel' ? 'home' : 'compass'}
                                size={20}
                                color={Colors.orange}
                              />
                            )}
                          </View>
                          <Text style={styles.customCardTitle}>
                            {section.type === 'flight'
                              ? 'Find another flight'
                              : section.type === 'hotel'
                                ? 'Search other stays'
                                : section.type === 'transit'
                                  ? 'Explore alternatives'
                                  : 'Explore more options'}
                          </Text>
                          {section.type !== 'transit' && (
                            <Text style={styles.customCardSub}>
                              Browse our full catalog
                            </Text>
                          )}
                        </Pressable>
                      )}
                    </ScrollView>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Bottom spacing for CheckoutBar */}
          <View style={{ height: 120 }} />
        </Animated.ScrollView>

        {/* Sticky Checkout Bar */}
        <View style={styles.checkoutBarWrap}>
          <CheckoutBar
            onCheckout={() => { /* Final checkout nav logic here */ }}
            onSave={handleSave}
          />
        </View>

        <Pressable
          style={[
            styles.floatingChatBar,
            !displayedChatText && { paddingHorizontal: 12, width: 44, justifyContent: 'center' }
          ]}
          onPress={() => setCanvasChatVisible(true)}
        >
          <View style={[styles.floatingChatIcon, !displayedChatText && { marginRight: 0 }]}>
            <TrippyAvatar size={22} />
          </View>
          {displayedChatText.length > 0 && (
            <Text style={styles.floatingChatText}>{displayedChatText}</Text>
          )}
        </Pressable>

        {/* Canvas Chat Modal */}
        <CanvasChatModal
          visible={canvasChatVisible}
          onClose={() => setCanvasChatVisible(false)}
        />

        {/* Quick Look Modal */}
        <QuickLookModal
          visible={quickLookItem != null}
          item={quickLookItem}
          type={quickLookType}
          isLocked={
            quickLookLockKey && quickLookItem
              ? quickLookLockKey.startsWith('activities_')
                ? Array.isArray(locks[quickLookLockKey]) && locks[quickLookLockKey].includes(quickLookItem.id)
                : locks[quickLookLockKey] === quickLookItem.id
              : false
          }
          onClose={() => setQuickLookItem(null)}
          onAddToTrip={handleAddFromQuickLook}
          onFullDetails={handleFullDetails}
        />

        {/* More Options Modal */}
        <MoreOptionsModal
          visible={moreOptionsVisible}
          type={moreOptionsType}
          context={moreOptionsContext}
          onClose={() => setMoreOptionsVisible(false)}
          onSelect={handleSelectMoreOption}
          alreadySelectedIds={[].concat(...Object.values(locks))}
        />
        {/* Save Toast Notification */}
        {showSaveToast && (
          <View style={styles.saveToast}>
            <Feather name="check" size={16} color={Colors.white} />
            <Text style={styles.saveToastText}>Changes saved successfully</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  goBackBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.orange,
    borderRadius: Radius.sm,
  },
  goBackText: {
    color: Colors.white,
    fontSize: 14,
    ...Fonts.semibold,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    ...Fonts.semibold,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 0 },
  dayNavClip: {
    position: 'absolute',
    top: HEADER_HEIGHT, 
    left: 0,
    right: 0,
    height: TABS_HEIGHT,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },

  // Hero
  heroContainer: {
    height: 260,
    backgroundColor: Colors.cardBg,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: Spacing.xl,
    elevation: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  heroDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
    ...Fonts.semibold,
  },
  heroTitle: {
    fontSize: 28,
    color: Colors.white,
    lineHeight: 34,
    marginBottom: 6,
    ...Fonts.extrabold,
  },
  heroSubtitle: {
    fontSize: 13, // Smaller city text
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    ...Fonts.medium,
  },
  heroTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  heroTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  heroTagText: {
    fontSize: 11,
    color: Colors.black,
    ...Fonts.bold,
  },

  // Day section
  daySection: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 32,
  },
  dayTimelineStroke: {
    position: 'absolute',
    top: Spacing.xl + 22,
    bottom: 0,
    left: Spacing.lg + 9,
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
    borderStyle: 'dashed',
    zIndex: -1,
  },
  dayTitle: {
    fontSize: 17,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  stickyNavContainer: {
    height: TABS_HEIGHT,
    zIndex: 500,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  // Section block (timeline)
  sectionBlock: {
    marginBottom: Spacing.xxl,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 24,
  },
  sectionDotWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  sectionLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    ...Fonts.semibold,
  },
  cardsScroll: {
    marginLeft: 28,
  },
  cardsRow: {
    paddingRight: Spacing.lg,
    paddingLeft: 8,
    paddingBottom: Spacing.lg,
  },
  customCard: {
    width: 180,
    alignSelf: 'stretch',
    marginRight: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E2E2E2',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  customCardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  customCardTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
    ...Fonts.bold,
  },
  customCardSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    ...Fonts.medium,
  },

  // Checkout bar wrapper
  checkoutBarWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  floatingChatBar: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(124, 58, 237, 0.18)', // Subtler purple halo
    // High-fidelity centered shadow
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, // Slightly lighter shadow too
    shadowRadius: 10,
    elevation: 4, // Softened Android presence 🔘✨
  },
  floatingChatIcon: {
    marginRight: 10,
  },
  floatingChatText: {
    fontSize: 14,
    color: Colors.textPrimary,
    ...Fonts.medium,
  },
  saveToast: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    backgroundColor: '#222222', // Dark background for a system toast look
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.md, // Less rounded to distinguish from pills
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 3000,
  },
  saveToastText: {
    color: Colors.white,
    fontSize: 13,
    ...Fonts.medium,
  },
});

