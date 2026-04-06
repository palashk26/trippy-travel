import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';

/** ─── Dummy Data ─────────────────────────────────────────── */
const DUMMY_HOTELS = [
  {
    id: 'h1', name: 'Taj Malabar Resort & Spa', location: 'Cochin, Kerala',
    stars: 5, rating: 4.7, reviews: '3.2k', price: 18500, perNight: 9250,
    nights: 2, tag: 'Breakfast Included', tagType: 'green',
    amenities: ['Pool', 'Spa', 'Free WiFi'],
  },
  {
    id: 'h2', name: 'Vivanta Kovalam, A Taj Hotel', location: 'Kovalam, Kerala',
    stars: 5, rating: 4.5, reviews: '2.1k', price: 14200, perNight: 7100,
    nights: 2, tag: 'Free Cancellation', tagType: 'green',
    amenities: ['Beachfront', 'Pool', 'Free WiFi'],
  },
  {
    id: 'h3', name: 'Kumarakom Lake Resort', location: 'Kumarakom, Kerala',
    stars: 5, rating: 4.8, reviews: '1.8k', price: 22000, perNight: 11000,
    nights: 2, tag: 'AI Top Pick', tagType: 'ai',
    amenities: ['Backwaters', 'Spa', 'Villas'],
  },
  {
    id: 'h4', name: 'CGH Earth Spice Village', location: 'Thekkady, Kerala',
    stars: 4, rating: 4.6, reviews: '4.5k', price: 11000, perNight: 5500,
    nights: 2, tag: 'Eco Certified', tagType: 'green',
    amenities: ['Eco Resort', 'Nature Walk', 'Pool'],
  },
  {
    id: 'h5', name: 'Coconut Lagoon by CGH Earth', location: 'Kumarakom, Kerala',
    stars: 4, rating: 4.4, reviews: '3.8k', price: 9600, perNight: 4800,
    nights: 2, tag: null, tagType: null,
    amenities: ['Backwaters', 'Pool', 'Ayurveda'],
  },
];

const DUMMY_FLIGHTS = [
  {
    id: 'f1', airline: 'IndiGo', flightNo: '6E 247', airlineLogo: 'https://ui-avatars.com/api/?name=IndiGo&background=00235D&color=fff&rounded=true&bold=true',
    from: 'BOM', fromCity: 'Mumbai', to: 'COK', toCity: 'Cochin',
    departTime: '06:05', arriveTime: '08:20', duration: '2h 15m',
    stops: 'Non-stop', price: 5420, tag: 'Cheapest', tagType: 'green',
  },
  {
    id: 'f2', airline: 'Air India', flightNo: 'AI 677', airlineLogo: 'https://ui-avatars.com/api/?name=Air+India&background=ED1C24&color=fff&rounded=true&bold=true',
    from: 'BOM', fromCity: 'Mumbai', to: 'COK', toCity: 'Cochin',
    departTime: '09:30', arriveTime: '11:50', duration: '2h 20m',
    stops: 'Non-stop', price: 6890, tag: 'Full Service', tagType: 'blue',
  },
  {
    id: 'f3', airline: 'IndiGo', flightNo: '6E 891', airlineLogo: 'https://ui-avatars.com/api/?name=IndiGo&background=00235D&color=fff&rounded=true&bold=true',
    from: 'BOM', fromCity: 'Mumbai', to: 'COK', toCity: 'Cochin',
    departTime: '14:15', arriveTime: '16:35', duration: '2h 20m',
    stops: 'Non-stop', price: 5890, tag: null, tagType: null,
  },
  {
    id: 'f4', airline: 'Vistara', flightNo: 'UK 843', airlineLogo: 'https://ui-avatars.com/api/?name=Vistara&background=5A2D81&color=fff&rounded=true&bold=true',
    from: 'BOM', fromCity: 'Mumbai', to: 'COK', toCity: 'Cochin',
    departTime: '17:40', arriveTime: '20:05', duration: '2h 25m',
    stops: 'Non-stop', price: 7350, tag: 'AI Top Pick', tagType: 'ai',
  },
  {
    id: 'f5', airline: 'SpiceJet', flightNo: 'SG 312', airlineLogo: 'https://ui-avatars.com/api/?name=SpiceJet&background=ED1B24&color=fff&rounded=true&bold=true',
    from: 'BOM', fromCity: 'Mumbai', to: 'COK', toCity: 'Cochin',
    departTime: '20:10', arriveTime: '23:55', duration: '3h 45m',
    stops: '1 Stop · Hyderabad', price: 4650, tag: 'Best Value', tagType: 'orange',
  },
];

const HOTEL_FILTERS = ['Recommended', 'Price ↑', 'Price ↓', 'Rating', 'Top Rated'];
const FLIGHT_FILTERS = ['Recommended', 'Price ↑', 'Departure', 'Duration', 'Arrival'];

/** ─── Tag Badge ──────────────────────────────────────────── */
function TagBadge({ tag, tagType }) {
  if (!tag) return null;
  const isAI = tagType === 'ai';
  const isOrange = tagType === 'orange';
  const isBlue = tagType === 'blue';
  return (
    <View style={[
      styles.tag,
      isAI && styles.tagAI,
      isOrange && styles.tagOrange,
      isBlue && styles.tagBlue,
    ]}>
      {isAI && <Feather name="zap" size={10} color={Colors.textWhite} style={{ marginRight: 3 }} />}
      <Text style={[styles.tagText, (isAI || isOrange || isBlue) && { color: Colors.textWhite }]}>
        {tag}
      </Text>
    </View>
  );
}

/** ─── Rating Box ─────────────────────────────────────────── */
function RatingBox({ rating, reviews }) {
  return (
    <View style={styles.ratingRow}>
      <View style={styles.ratingBox}>
        <Text style={styles.ratingNum}>{rating}</Text>
      </View>
      <Text style={styles.ratingDesc}>
        <Text style={{ color: '#005CEE' }}>{rating >= 4.6 ? 'Excellent' : 'Very Good'}</Text>
        {reviews ? `  (${reviews} ratings)` : ''}
      </Text>
    </View>
  );
}

/** ─── Hotel Card ─────────────────────────────────────────── */
function HotelCard({ item }) {
  const [selected, setSelected] = useState(false);
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <TagBadge tag={item.tag} tagType={item.tagType} />

      <View style={styles.hotelLayout}>
        {/* Left: Info */}
        <View style={styles.hotelInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={11} color={Colors.textMuted} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <RatingBox rating={item.rating} reviews={item.reviews} />

          {/* Amenity chips */}
          <View style={styles.amenityRow}>
            {item.amenities.map((a) => (
              <View key={a} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right: Price + CTA */}
        <View style={styles.priceBlock}>
          <Text style={styles.cardPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
          <Text style={styles.priceNote}>₹{item.perNight.toLocaleString('en-IN')}/night</Text>
          <Text style={styles.taxNote}>+ taxes</Text>
          <Pressable
            style={[styles.cta, selected && styles.ctaSelected]}
            onPress={() => setSelected(!selected)}
          >
            {selected && <Feather name="check" size={13} color={Colors.white} style={{ marginRight: 4 }} />}
            <Text style={styles.ctaText}>{selected ? 'Added' : 'Select'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** ─── Flight Card ────────────────────────────────────────── */
function FlightCard({ item }) {
  const [selected, setSelected] = useState(false);
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <TagBadge tag={item.tag} tagType={item.tagType} />

      {/* Airline row */}
      <View style={styles.airlineRow}>
        <View style={styles.airlineBox}>
          {item.airlineLogo ? (
            <Image 
              source={{ uri: item.airlineLogo }} 
              style={{ width: 14, height: 14, borderRadius: 2 }} 
              resizeMode="contain" 
            />
          ) : (
            <Ionicons name="airplane" size={14} color={Colors.orange} />
          )}
        </View>
        <View>
          <Text style={styles.airlineName}>{item.airline}</Text>
          <Text style={styles.flightNo}>{item.flightNo}</Text>
        </View>
      </View>

      {/* Route timeline */}
      <View style={styles.routeRow}>
        <View style={styles.routeTime}>
          <Text style={styles.timeCode}>{item.departTime}</Text>
          <Text style={styles.cityCode}>{item.from}</Text>
        </View>
        <View style={styles.routeMiddle}>
          <Text style={styles.durationLabel}>{item.duration}</Text>
          <View style={styles.routeLine}>
            <View style={styles.routeDot} />
            <View style={styles.routeTrack} />
            <View style={styles.routeDot} />
          </View>
          <Text style={styles.stopsLabel}>{item.stops}</Text>
        </View>
        <View style={styles.routeTime}>
          <Text style={styles.timeCode}>{item.arriveTime}</Text>
          <Text style={styles.cityCode}>{item.to}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
          <Text style={styles.taxNote}>per person, incl. taxes</Text>
        </View>
        <Pressable
          style={[styles.cta, selected && styles.ctaSelected]}
          onPress={() => setSelected(!selected)}
        >
          {selected && <Feather name="check" size={13} color={Colors.white} style={{ marginRight: 4 }} />}
          <Text style={styles.ctaText}>{selected ? 'Added' : 'Select'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** ─── Main Screen ────────────────────────────────────────── */
export default function CleartripSearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { type = 'hotel' } = route.params || {};
  const [activeFilter, setActiveFilter] = useState('Recommended');

  const isHotel = type === 'hotel';
  const data = isHotel ? DUMMY_HOTELS : DUMMY_FLIGHTS;
  const filters = isHotel ? HOTEL_FILTERS : FLIGHT_FILTERS;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.searchPill}>
          <Feather name="search" size={13} color={Colors.textMuted} />
          <Text style={styles.searchText} numberOfLines={1}>
            {isHotel ? 'Kerala  ·  Mar 20–22  ·  1 Room' : 'Mumbai → Cochin  ·  Mar 20  ·  1 Adult'}
          </Text>
        </View>
        <Pressable style={styles.filterIconBtn}>
          <Feather name="sliders" size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      {/* ── Results count ──────────────────────────────── */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          {isHotel ? '5 hotels' : '5 flights'}{' '}
          <Text style={styles.countSub}>· sorted by {activeFilter}</Text>
        </Text>
        <Text style={styles.taxNote}>Prices incl. taxes</Text>
      </View>

      {/* ── Sort filters ───────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Results list ────────────────────────────────── */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {data.map((item) =>
          isHotel
            ? <HotelCard key={item.id} item={item} />
            : <FlightCard key={item.id} item={item} />
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  filterIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Count bar
  countBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  countText: {
    fontSize: 13,
    color: Colors.textPrimary,
    ...Fonts.semibold,
  },
  countSub: {
    color: Colors.textMuted,
    ...Fonts.regular,
  },

  // Filter chips
  filterRow: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    flexShrink: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    ...Fonts.semibold,
  },
  filterChipTextActive: {
    color: Colors.white,
  },

  // List
  list: { flex: 1 },
  listContent: { padding: Spacing.xl },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardSelected: {
    borderColor: Colors.orange,
  },

  // Tag
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.greenLight,
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginBottom: Spacing.sm,
  },
  tagAI: { backgroundColor: Colors.purple },
  tagOrange: { backgroundColor: Colors.orange },
  tagBlue: { backgroundColor: '#005CEE' },
  tagText: {
    fontSize: 10,
    color: Colors.green,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    ...Fonts.bold,
  },

  // Rating
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingBox: {
    backgroundColor: '#005CEE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  ratingNum: {
    color: Colors.white,
    fontSize: 11,
    ...Fonts.bold,
  },
  ratingDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },

  // Hotel card layout
  hotelLayout: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  hotelInfo: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 2,
    ...Fonts.bold,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
    ...Fonts.regular,
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: Spacing.sm,
  },
  amenityChip: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xs,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  amenityText: {
    fontSize: 10,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },

  // Price block
  priceBlock: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 100,
  },
  cardPrice: {
    fontSize: 18,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  priceNote: {
    fontSize: 10,
    color: Colors.textMuted,
    ...Fonts.regular,
    marginTop: 1,
  },
  taxNote: {
    fontSize: 10,
    color: Colors.textMuted,
    ...Fonts.regular,
  },

  // CTA
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.orange,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  ctaSelected: {
    backgroundColor: Colors.green,
  },
  ctaText: {
    fontSize: 13,
    color: Colors.white,
    ...Fonts.bold,
  },

  // Flight card
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  airlineBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.orangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  airlineName: {
    fontSize: 14,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  flightNo: {
    fontSize: 11,
    color: Colors.textMuted,
    ...Fonts.regular,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  routeTime: { alignItems: 'center', minWidth: 60 },
  timeCode: {
    fontSize: 17,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  cityCode: {
    fontSize: 11,
    color: Colors.textMuted,
    ...Fonts.semibold,
    marginTop: 2,
  },
  routeMiddle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  durationLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    ...Fonts.medium,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  routeTrack: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.border,
    marginHorizontal: 2,
  },
  stopsLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    ...Fonts.regular,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
