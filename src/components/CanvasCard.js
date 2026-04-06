import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

/**
 * CanvasCard — Option card for the Master Trip Canvas.
 * Refined to match specific UI design references.
 */
export default function CanvasCard({ item, type = 'hotel', isLocked = false, onMoreDetails, onSelect }) {
  if (!item) return null;

  const title =
    type === 'flight'
      ? `${item.airline} ${item.flightNo}`
      : item.name;

  const priceLabel =
    type === 'hotel'
      ? `₹${(item.pricePerNight || 0).toLocaleString('en-IN')}`
      : item.price === 0
        ? 'Free'
        : `₹${(item.price || 0).toLocaleString('en-IN')}`;

  const taxAmount = type === 'hotel' ? Math.floor((item.pricePerNight || 0) * 0.18).toLocaleString('en-IN') : '';

  return (
    <View style={[styles.cardBorderWrap, isLocked && styles.cardBorderWrapLocked]}>
      <Pressable
        style={styles.cardShadow}
        onPress={onMoreDetails}
      >
        <View style={styles.cardInner}>
        {/* ── AI Top Pick Banner ────────────────────────────── */}
        {item.aiPick && (
          <View style={styles.aiBannerOuter}>
            <Text style={styles.aiPickBadgeText}>{item.aiBadge || 'AI PICK'}</Text>
            {item.aiReason ? (
              <Text style={styles.aiReason} numberOfLines={2}>{item.aiReason}</Text>
            ) : null}
          </View>
        )}

        {/* ── Image (Hides for flights and transit edge cases) ────────── */}
        {type !== 'flight' && type !== 'transit' && (item.image || (item.images && item.images[0])) && (() => {
          const img = item.image || item.images[0];
          return (
            <Image
              source={typeof img === 'string' ? { uri: img } : img}
              style={styles.image}
              resizeMode="cover"
            />
          );
        })()}

        {/* ── Content ────────────────────────────────────────── */}
        <View style={styles.body}>

          {/* Alert Banner for Edge Cases (like No Flights Found) */}
          {item.isAlert && (
            <View style={styles.alertBanner}>
              <Feather name="alert-circle" size={12} color="#D97706" />
              <Text style={styles.alertBannerText}>{item.alertTitle}</Text>
            </View>
          )}

          {/* Rating Row (Hotels & Activities) */}
          {(type === 'hotel' || type === 'activity') && item.rating && (
            <View style={styles.hotelRatingRow}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingNumber}>{item.rating}</Text>
              </View>
              <Text style={styles.ratingDesc}>
                <Text style={{ color: '#005CEE' }}>{item.rating > 4.5 ? 'Excellent' : 'Very Good'}</Text> ({item.reviews || '5.3k'} ratings)
              </Text>
            </View>
          )}

          {/* New Semantic Flight Journey Layout */}
          {type === 'flight' && (
            <View style={styles.flightJourneyWrap}>
              <View style={styles.flightTimeCol}>
                <Text style={styles.flightTimeMain}>{item.departTime}</Text>
                <Text style={styles.flightCityCode}>{item.from}</Text>
              </View>

              <View style={styles.flightDurationCol}>
                <View style={styles.flightLineWrap}>
                  <View style={styles.flightLine} />
                  <Ionicons name="airplane" size={14} color={Colors.textMuted} />
                  <View style={styles.flightLine} />
                </View>
                <Text style={styles.flightDurationLabel}>{item.duration}</Text>
                <Text style={styles.flightStopsLabel}>{item.stops}</Text>
              </View>

              <View style={[styles.flightTimeCol, { alignItems: 'flex-end' }]}>
                <Text style={styles.flightTimeMain}>{item.arriveTime}</Text>
                <Text style={styles.flightCityCode}>{item.to}</Text>
              </View>
            </View>
          )}

          {/* Title Row (Airline Info for Flights, Name for others) */}
          <View style={[styles.titleRow, type === 'flight' && { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 8 }]}>
            {type === 'flight' && item.airlineLogo && (
              <Image 
                source={{ uri: item.airlineLogo }} 
                style={{ width: 16, height: 16, marginRight: 6, borderRadius: 2 }} 
                resizeMode="contain" 
              />
            )}
            {type === 'transit' && (
              <Ionicons 
                name="car-sport" 
                size={16} 
                color={Colors.textPrimary} 
                style={{ marginRight: 6 }} 
              />
            )}
            <Text style={[styles.title, type === 'flight' && { fontSize: 13, color: Colors.textSecondary }]}>{title}</Text>
          </View>

        {/* Price Row (Hidden for activities) */}
        {type !== 'activity' ? (
          <View style={styles.priceRow}>
            <Text style={styles.price}>{priceLabel}</Text>
            {type === 'hotel' && (
              <Text style={styles.priceSub}>
                {' '} + ₹{taxAmount} taxes & fees / night
              </Text>
            )}
            {type === 'flight' && (
               <Text style={styles.priceSub}> per person</Text>
            )}
          </View>
        ) : (
          <View style={styles.captionRow}>
            <View style={[styles.activityMetaRow, { marginBottom: 6 }]}>
              <Feather name="clock" size={12} color={Colors.textSecondary} />
              <Text style={styles.activityMetaText}>
                {item.duration || 'Top Recommended'}
              </Text>
            </View>
            <Text style={styles.activityDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        )}

          {/* Location / Meta Row (Hotels/Activities/Transit) */}
          {type !== 'flight' && (item.location || item.duration || item.route) && (
            <View style={styles.locationRow}>
              {type === 'transit' ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                  {item.route && (
                    <Text style={styles.locationText}>
                      {item.route} <Text style={{ color: Colors.textMuted }}>•</Text> 
                    </Text>
                  )}
                  <Feather name="clock" size={12} color={Colors.textPrimary} style={{ marginHorizontal: 4 }} />
                  <Text style={styles.locationText}>{item.duration}</Text>
                </View>
              ) : (
                <>
                  <Feather name="map-pin" size={12} color={Colors.textPrimary} />
                  <Text style={styles.locationText}>
                    3.6 km from center · {item.location}
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Footer actions */}
          <View style={styles.footer}>
            <Pressable style={styles.detailsBtn} onPress={onMoreDetails}>
              <Text style={styles.detailsBtnText}>View Details</Text>
            </Pressable>

            <Pressable
              style={[styles.selectBtn, isLocked && styles.selectBtnLocked]}
              onPress={onSelect}
            >
              {isLocked && <View style={styles.innerBorder} />}
              {isLocked ? (
                <>
                  <MaterialIcons name="check" size={16} color={Colors.orange} />
                  <Text style={[styles.selectBtnText, styles.selectBtnTextLocked]}>Added</Text>
                </>
              ) : (
                <Text style={styles.selectBtnText}>Add</Text>
              )}
            </Pressable>
          </View>

        </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Border wrapper (outer — sits outside the shadow/overflow)
  cardBorderWrap: {
    borderRadius: Radius.lg + 2,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: Spacing.md,
    alignSelf: 'stretch',
  },
  cardBorderWrapLocked: {
    borderColor: 'transparent',
  },
  cardShadow: {
    width: 280,
    flex: 1,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  cardShadowLocked: {},
  lockedOverlay: {
    // Removed — border is now handled directly on cardShadow
  },
  cardInner: {
    flex: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden', // Needed to clip image to card radius
    // Note: borderWidth is on parent cardShadow, not here
  },
  cardInnerLocked: {
  },

  // AI Banner
  aiBannerOuter: {
    backgroundColor: '#F4F0FF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  aiPickBadgeText: {
    fontSize: 11,
    color: '#8A2BE2', // Deep purple
    letterSpacing: 0.8,
    fontFamily: 'Inter_800ExtraBold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  aiReason: {
    fontSize: 13,
    color: '#333333',
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },

  // Image
  image: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.cardBg,
  },

  // Body
  body: {
    flex: 1,
    padding: Spacing.lg,
  },

  // Hotel Rating
  // Flight specific styles
  flightJourneyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  flightTimeCol: {
    gap: 2,
  },
  flightTimeMain: {
    fontSize: 20,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    ...Fonts.bold,
  },
  flightCityCode: {
    fontSize: 12,
    color: Colors.textSecondary,
    ...Fonts.semibold,
  },
  flightDurationCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  flightLineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 4,
    marginBottom: 4,
  },
  flightLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  flightDurationLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    ...Fonts.medium,
  },
  flightStopsLabel: {
    fontSize: 10,
    color: '#10B981', // Emerald green for non-stop
    marginTop: 2,
    ...Fonts.bold,
  },

  // Alert Banner styles
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  alertBannerText: {
    fontSize: 11,
    color: '#B45309',
    ...Fonts.bold,
    textTransform: 'uppercase',
  },

  hotelRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
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
    flex: 1, // Allow text to wrap and stay within card bounds
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Inter_500Medium',
  },

  // Flight routing
  flightRouteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  flightRouteText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  flightDurationText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'Inter_500Medium',
  },

  // Title Row
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    marginRight: Spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    fontFamily: 'Inter_500Medium',
  },

  // Price Row
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap', // Prevent horizontal overflow
    gap: 4,
  },
  price: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  priceSub: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Inter_500Medium',
  },
  captionRow: {
    marginBottom: Spacing.md,
  },
  activityDescription: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
    marginBottom: 4,
  },
  activityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityMetaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: 'Inter_500Medium',
  },

  // Footer Actions
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: Spacing.xs,
  },
  detailsBtn: {
    paddingVertical: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 13,
    color: Colors.textSecondary,
    ...Fonts.medium,
    textDecorationLine: 'underline',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: Radius.full,
    backgroundColor: '#222222',
  },
  selectBtnLocked: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 14,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.7,
    borderColor: Colors.orange,
    borderRadius: Radius.full,
  },
  selectBtnText: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
  selectBtnTextLocked: {
    color: Colors.orange,
  },
});
