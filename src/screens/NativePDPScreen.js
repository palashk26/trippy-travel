import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';
import useTripStore from '../store/tripStore';
import { getItemById } from '../data/mockData';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * NativePDPScreen — The Spoke (Product Detail Page).
 * Full hotel/flight/activity detail page.
 * - Full-width image carousel with pagination dots
 * - Name, rating, location
 * - "Why Trippy Picked This" section
 * - Amenities / flight details
 * - Description
 * - Fixed bottom bar with price + [Add to Trip] CTA
 */
export default function NativePDPScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId, type = 'hotel', lockKey } = route.params || {};
  const item = getItemById(itemId);
  const lockItemAction = useTripStore((s) => s.lockItem);
  const locks = useTripStore((s) => s.locks);
  const isLocked = lockKey && (Array.isArray(locks[lockKey]) ? locks[lockKey].includes(itemId) : locks[lockKey] === itemId);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const scrollRef = useRef(null);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Item not found.</Text>
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

  const images = item.images || [item.image];
  const title = type === 'flight' ? `${item.airline} ${item.flightNo}` : item.name;
  const price =
    type === 'hotel'
      ? `₹${(item.totalPrice || item.pricePerNight || 0).toLocaleString('en-IN')}`
      : item.price === 0
        ? 'Free'
        : `₹${(item.price || 0).toLocaleString('en-IN')}`;

  const handleAddToTrip = () => {
    if (lockKey) {
      lockItemAction(lockKey, itemId);
    }
    navigation.goBack();
  };

  const handleScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SCREEN_WIDTH);
    setActiveImageIdx(idx);
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
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Pressable style={styles.shareBtn}>
            <Feather name="share-2" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Carousel */}
          {type !== 'transit' && type !== 'flight' && (
            <View style={styles.carouselContainer}>
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
              >
                {images.map((imgSource, idx) => (
                  <Image
                    key={idx}
                    source={typeof imgSource === 'string' ? { uri: imgSource } : imgSource}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Pagination dots */}
              {images.length > 1 && (
                <View style={styles.dotsRow}>
                  {images.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        activeImageIdx === idx && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Title & Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            {item.location && (
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color={Colors.textMuted} />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            )}
            {item.rating && (
              <View style={styles.ratingRow}>
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingNumber}>{item.rating}</Text>
                </View>
                <Text style={styles.ratingDesc}>
                  <Text style={{ color: '#005CEE' }}>{item.rating > 4.5 ? 'Excellent' : 'Very Good'}</Text>
                  {item.reviews && ` (${item.reviews.toLocaleString('en-IN')} reviews)`}
                </Text>
              </View>
            )}
          </View>

          {/* Why Trippy Picked This */}
          {item.aiPick && item.aiReason && (
            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={16} color={Colors.purple} />
                <Text style={styles.aiLabel}>Why Trippy Picked This</Text>
              </View>
              <Text style={styles.aiReason}>{item.aiReason}</Text>
            </View>
          )}

          {/* Flight Details */}
          {type === 'flight' && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Flight Details</Text>
              <View style={styles.flightGrid}>
                <View style={styles.flightCell}>
                  <Text style={styles.flightLabel}>Route</Text>
                  <Text style={styles.flightValue}>
                    {item.from} → {item.to}
                  </Text>
                </View>
                <View style={styles.flightCell}>
                  <Text style={styles.flightLabel}>Duration</Text>
                  <Text style={styles.flightValue}>{item.duration}</Text>
                </View>
                <View style={styles.flightCell}>
                  <Text style={styles.flightLabel}>Depart</Text>
                  <Text style={styles.flightValue}>{item.departTime}</Text>
                </View>
                <View style={styles.flightCell}>
                  <Text style={styles.flightLabel}>Arrive</Text>
                  <Text style={styles.flightValue}>{item.arriveTime}</Text>
                </View>
                <View style={styles.flightCell}>
                  <Text style={styles.flightLabel}>Stops</Text>
                  <Text style={styles.flightValue}>{item.stops}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Amenities */}
          {item.amenities && item.amenities.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {item.amenities.map((a, i) => (
                  <View key={i} style={styles.amenityItem}>
                    <Feather
                      name="check-circle"
                      size={16}
                      color={Colors.green}
                    />
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {item.description && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}

          {/* Contextual Info */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Things to Know</Text>
            <View style={styles.infoRow}>
              <Feather name="clock" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Arrive 15 minutes before the start time</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="info" size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Bring comfortable walking shoes and water</Text>
            </View>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Cancellation Policy</Text>
            <Text style={styles.description}>
              Free cancellation up to 24 hours before the experience starts (local time). No refund for cancellations made less than 24 hours in advance.
            </Text>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Fixed Bottom Bar */}
        <View style={[styles.bottomBar, type === 'activity' && { justifyContent: 'center' }]}>
          {type !== 'activity' && (
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>{price}</Text>
              {type === 'hotel' && (
                <Text style={styles.perNight}>
                  ₹{(item.pricePerNight || 0).toLocaleString('en-IN')}/night
                  {item.nights ? ` × ${item.nights} nights` : ''}
                </Text>
              )}
            </View>
          )}

          <Pressable
            style={[
              styles.addBtn,
              isLocked && styles.addBtnLocked,
              type === 'activity' && { paddingHorizontal: 60 }
            ]}
            onPress={handleAddToTrip}
          >
            <Feather
              name={isLocked ? 'check' : 'plus'}
              size={18}
              color={isLocked ? Colors.green : Colors.textWhite}
            />
            <Text
              style={[
                styles.addBtnText,
                isLocked && styles.addBtnTextLocked,
              ]}
            >
              {isLocked ? 'Added' : 'Add to trip'}
            </Text>
          </Pressable>
        </View>
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
    backgroundColor: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  emptyText: {
    fontSize: 16,
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
    color: Colors.textWhite,
    fontSize: 14,
    ...Fonts.semibold,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    color: Colors.textPrimary,
    textAlign: 'center',
    ...Fonts.semibold,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {},

  // Carousel
  carouselContainer: {
    height: 260,
    backgroundColor: Colors.cardBg,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  dotsRow: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: Colors.white,
    width: 20,
  },

  // Title section
  titleSection: {
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textMuted,
    ...Fonts.regular,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  ratingBox: {
    backgroundColor: '#005CEE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  ratingNumber: {
    color: Colors.white,
    fontSize: 12,
    ...Fonts.bold,
  },
  ratingDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },

  // AI Card
  aiCard: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    backgroundColor: Colors.aiPickBg,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.aiPickBorder,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  aiLabel: {
    fontSize: 13,
    color: Colors.purple,
    ...Fonts.bold,
  },
  aiReason: {
    fontSize: 14,
    color: Colors.aiPickText,
    lineHeight: 20,
    ...Fonts.regular,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    ...Fonts.regular,
  },

  // Detail sections
  detailSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    ...Fonts.bold,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    ...Fonts.regular,
  },

  // Flight grid
  flightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  flightCell: {
    width: '46%',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.sm,
    padding: Spacing.md,
  },
  flightLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
    ...Fonts.medium,
  },
  flightValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    ...Fonts.semibold,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '46%',
    paddingVertical: Spacing.sm,
  },
  amenityText: {
    fontSize: 14,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  priceCol: {},
  priceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    ...Fonts.medium,
  },
  priceValue: {
    fontSize: 22,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  perNight: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    ...Fonts.regular,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.orange,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  addBtnLocked: {
    backgroundColor: Colors.greenLight,
  },
  addBtnText: {
    fontSize: 16,
    color: Colors.textWhite,
    ...Fonts.bold,
  },
  addBtnTextLocked: {
    color: Colors.green,
  },
});
