import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * QuickLookModal – Progressive disclosure bottom sheet.
 * Shows a larger image, ratings, "Why Trippy Picked This", and price.
 * CTAs: [Add to Trip] and [Full Details]
 */
export default function QuickLookModal({
  visible,
  item,
  type = 'hotel',
  isLocked = false,
  onClose,
  onAddToTrip,
  onFullDetails,
}) {
  if (!item) return null;

  const price =
    type === 'hotel'
      ? `₹${(item.totalPrice || item.pricePerNight || 0).toLocaleString('en-IN')}`
      : item.price === 0
      ? 'Free'
      : `₹${(item.price || 0).toLocaleString('en-IN')}`;

  const title =
    type === 'flight' ? `${item.airline} ${item.flightNo}` : item.name;

  const scrollViewRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = p => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const hasImage = type !== 'flight' && !!(item.image || (item.images && item.images[0]));

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={100} 
      propagateSwipe={true}
      style={{ margin: 0, justifyContent: 'flex-end' }}
    >
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={[styles.handleBar, hasImage && styles.handleBarAbsolute]}>
          <View style={[styles.handle, hasImage && styles.handleImageOverlay]} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Image */}
          {type !== 'flight' && (item.image || (item.images && item.images[0])) && (() => {
            const img = item.image || item.images[0];
            return (
              <Image
                source={typeof img === 'string' ? { uri: img } : img}
                style={styles.image}
                resizeMode="cover"
              />
            );
          })()}

          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={styles.title}>{title}</Text>
              </View>
              {item.location && (
                <Text style={styles.location}>
                  <Feather name="map-pin" size={12} color={Colors.textMuted} />{' '}
                  {item.location}
                </Text>
              )}
            </View>
            {type !== 'activity' && (
              <View style={styles.priceCol}>
                <Text style={styles.price}>{price}</Text>
                {type === 'hotel' && (
                  <Text style={styles.perNight}>
                    ₹{(item.pricePerNight || 0).toLocaleString('en-IN')}/night
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Unified Rating from Design System (Hotels & Activities) */}
          {(type === 'hotel' || type === 'activity') && item.rating && (
            <View style={styles.hotelRatingRow}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingNumber}>{item.rating}</Text>
              </View>
              <Text style={styles.ratingDesc}>
                <Text style={{ color: '#005CEE' }}>{item.rating > 4.5 ? 'Excellent' : 'Very Good'}</Text> ({item.reviews || '5.3k'} ratings) • {type === 'hotel' ? `Hotel in ${item.location?.split(',')[0]}` : 'Top Activity'}
              </Text>
            </View>
          )}

          {/* Why Trippy Picked This */}
          {item.aiPick && item.aiReason && (
            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Feather name="zap" size={14} color={Colors.aiPickText || Colors.purple} />
                <Text style={styles.aiLabel}>Why Trippy Picked This</Text>
              </View>
              <Text style={styles.aiReason}>{item.aiReason}</Text>
            </View>
          )}

          {/* Description */}
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          {/* Amenities (hotels) */}
          {item.amenities && item.amenities.length > 0 && (
            <View style={styles.amenitiesWrap}>
              <Text style={styles.sectionLabel}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {item.amenities.map((a, i) => (
                  <View key={i} style={styles.amenityChip}>
                    <Feather
                      name="check-circle"
                      size={12}
                      color={Colors.green}
                    />
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Flight details */}
          {type === 'flight' && (
            <View style={styles.flightDetails}>
              <Text style={styles.sectionLabel}>Flight Details</Text>
              <Text style={styles.flightInfo}>
                {item.from} → {item.to} · {item.duration} · {item.stops}
              </Text>
              <Text style={styles.flightTime}>
                Depart {item.departTime} — Arrive {item.arriveTime}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          <Pressable
            style={[
              styles.addBtn,
              isLocked && styles.addBtnLocked,
            ]}
            onPress={onAddToTrip}
          >
            <Feather
              name={isLocked ? 'check' : 'plus'}
              size={16}
              color={isLocked ? Colors.orange : Colors.white}
            />
            <Text
              style={[
                styles.addBtnText,
                isLocked && styles.addBtnTextLocked,
              ]}
            >
              {isLocked ? 'Added to Trip' : 'Add to Trip'}
            </Text>
          </Pressable>

          <Pressable style={styles.fullDetailsBtn} onPress={onFullDetails}>
            <Text style={styles.fullDetailsText}>Full Details</Text>
            <Feather
              name="arrow-right"
              size={16}
              color={Colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  handleBarAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  handleImageOverlay: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    paddingBottom: Spacing.lg,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.cardBg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  title: {
    fontSize: 18,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  location: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
    ...Fonts.regular,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  perNight: {
    fontSize: 11,
    color: Colors.textMuted,
    ...Fonts.regular,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textPrimary,
    ...Fonts.semibold,
  },
  reviewText: {
    fontSize: 12,
    color: Colors.textMuted,
    ...Fonts.regular,
  },
  hotelRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
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
    fontFamily: 'Inter_700Bold',
  },
  ratingDesc: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Inter_500Medium',
  },
  aiCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.aiPickBg,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.aiPickBorder,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiLabel: {
    fontSize: 13,
    color: Colors.aiPickText,
    ...Fonts.bold,
  },
  aiReason: {
    fontSize: 13,
    color: Colors.aiPickText,
    lineHeight: 19,
    ...Fonts.regular,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    ...Fonts.regular,
  },
  sectionLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    ...Fonts.bold,
  },
  amenitiesWrap: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xs,
  },
  amenityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  flightDetails: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  flightInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  flightTime: {
    fontSize: 13,
    color: Colors.purple,
    marginTop: 4,
    ...Fonts.medium,
  },
  ctaRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.orange,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  addBtnLocked: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.orange,
  },
  addBtnText: {
    fontSize: 15,
    color: Colors.textWhite,
    ...Fonts.bold,
  },
  addBtnTextLocked: {
    color: Colors.orange,
  },
  fullDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  fullDetailsText: {
    fontSize: 15,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
});
