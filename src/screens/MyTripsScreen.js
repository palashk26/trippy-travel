import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import TabPills from '../components/TabPills';
import BottomTabBar from '../components/BottomTabBar';
import ChatModal from '../components/ChatModal';
import TrippyAvatar from '../components/TrippyAvatar';
import useTripStore from '../store/tripStore';
import { heroImages } from '../data/mockData';

const { width } = Dimensions.get('window');

/**
 * HomeScreen
 * - Shows "My trips" header + horizontal tab pills (only Planning is functional)
 * - Empty state: "Let's Get Going" card with [Start Planning] CTA
 * - Populated state: Saved Trip Cards under the Planning tab
 * - Bottom tab bar (only "My Trips" is functional)
 */
export default function MyTripsScreen() {
  const navigation = useNavigation();
  const [chatVisible, setChatVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const savedTrips = useTripStore((s) => s.savedTrips);
  const setActiveTrip = useTripStore((s) => s.setActiveTrip);

  const visibleTrips = savedTrips.filter((t) => t.status === activeTab);

  const handleTripCardPress = (tripId) => {
    setActiveTrip(tripId);
    navigation.navigate('TripCanvasScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.contentSheet}>
          {/* Header */}
          <Text style={styles.header}>My trips</Text>

        {/* Tab pills */}
        <TabPills activeKey={activeTab} onTabPress={(key) => setActiveTab(key)} />

        {/* Scrollable content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {visibleTrips.length === 0 ? (
            /* ─── Empty State ──────────────────────────────────── */
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Let's Get Going</Text>
              <Text style={styles.emptyDesc}>
                Plan your perfect trip with Trippy AI in seconds. Tell us your preferences and we'll handle the rest.
              </Text>

              {/* Trippy Visual */}
              <View style={styles.mapContainer}>
                <TrippyAvatar size={80} animated={true} />
              </View>

              {/* Start Planning CTA */}
              <Pressable
                style={styles.startBtn}
                onPress={() => setChatVisible(true)}
              >
                <Text style={styles.startBtnText}>Start Planning</Text>
              </Pressable>
            </View>
          ) : (
            /* ─── Populated State — Saved Trip Cards ───────────── */
            <View style={styles.tripsContainer}>
              {visibleTrips.map((trip) => (
                <Pressable
                  key={trip.id}
                  style={styles.tripCard}
                  onPress={() => handleTripCardPress(trip.id)}
                >
                  {/* Cover image */}
                  <Image
                    source={{ uri: trip.coverImage }}
                    style={styles.tripCover}
                    resizeMode="cover"
                  />

                  {/* Status badge */}
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{trip.status === 'active' ? 'Active' : 'Planning'}</Text>
                  </View>

                  {/* Trip info */}
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripDuration}>{trip.duration}</Text>
                    <Text style={styles.tripTitle}>{trip.title}</Text>
                    <Text style={styles.tripMeta}>
                      {trip.dates}
                    </Text>

                    {/* Tags */}
                    <View style={styles.tagsRow}>
                      {trip.tags &&
                        trip.tags.map((tag, i) => (
                          <View key={i} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                    </View>

                    {/* Resume CTA */}
                    <View style={styles.resumeBtn}>
                      <Text style={styles.resumeText}>
                        Resume Planning
                      </Text>
                      <Feather
                        name="arrow-right"
                        size={14}
                        color={Colors.white}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}

              {/* Add another trip */}
              <Pressable
                style={styles.addTripBtn}
                onPress={() => setChatVisible(true)}
              >
                <View style={{ marginRight: 8 }}>
                  <TrippyAvatar size={32} animated={false} />
                </View>
                <Text style={styles.addTripText}>Plan another trip with Trippy</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
        </View>

        {/* Bottom Tab Bar */}
        <BottomTabBar activeTab="mytrips" />

        {/* Chat Modal */}
        <ChatModal
          visible={chatVisible}
          onClose={() => setChatVisible(false)}
          onTripCreated={(tripId) => {
            setChatVisible(false);
            setTimeout(() => {
              navigation.navigate('TripCanvasScreen', { tripId });
            }, 50);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white, // Status bar area
  },
  container: {
    flex: 1,
    backgroundColor: '#121212', // Deep dark grey for rounding
  },
  contentSheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    fontSize: 24,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    ...Fonts.bold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // ─── Empty State ────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    ...Fonts.bold,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
    ...Fonts.regular,
  },
  mapContainer: {
    width: '100%',
    height: 160,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  mapOverlay: {
    fontSize: 28,
    color: Colors.textMuted,
    fontStyle: 'italic',
    ...Fonts.bold,
  },
  startBtn: {
    width: '100%',
    backgroundColor: Colors.orange,    // primary transactional CTA
    paddingVertical: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: 16,
    color: Colors.white,
    ...Fonts.bold,
  },

  // ─── Populated State ───────────────────────────────────────────
  tripsContainer: {
    gap: Spacing.lg,
  },
  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tripCover: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.cardBg,
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E676', // Bright green for active
  },
  statusText: {
    fontSize: 10,
    color: Colors.textPrimary,
    ...Fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tripInfo: {
    padding: Spacing.lg,
  },
  tripDuration: {
    fontSize: 11,
    color: Colors.textSecondary,
    ...Fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  tripTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 6,
    ...Fonts.bold,
  },
  tripMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    ...Fonts.regular,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xs,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.orange,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
  },
  resumeText: {
    fontSize: 14,
    color: Colors.white,
    ...Fonts.bold,
  },
  addTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.purpleSoft, // AI Brand Background
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.purple,   // AI Brand Color
    borderStyle: 'dashed',
    marginTop: Spacing.sm,
  },
  addTripText: {
    fontSize: 14,
    color: Colors.purple,
    ...Fonts.bold,
    letterSpacing: 0.3,
  },
});
