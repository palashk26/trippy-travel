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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import BottomTabBar from '../components/BottomTabBar';
import ChatModal from '../components/ChatModal';
import CleartripLogo from '../components/CleartripLogo';
import TrippyAvatar from '../components/TrippyAvatar';
import { heroImages } from '../data/mockData';

const { width } = Dimensions.get('window');

/**
 * HomeScreen
 * Pixel-perfect clone of the Cleartrip homepage mockup
 */
export default function HomeScreen() {
  const navigation = useNavigation();
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.contentSheet}>
          {/* Scrollable content */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header - Now inside ScrollView */}
            <View style={styles.header}>
              <CleartripLogo size={45} />
              <View style={styles.walletPill}>
                <View style={styles.coin}>
                  <Feather name="zap" size={10} color={Colors.white} />
                </View>
                <Text style={styles.walletText}>0</Text>
              </View>
            </View>
            {/* Main big cards */}
            <View style={styles.topCardsRow}>
              {/* Hotels Card */}
              <Pressable style={styles.mainCard}>
                <View style={styles.iconWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=150&h=150' }}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.mainCardTitle}>Hotels</Text>
                <Text style={styles.mainCardSub}>Up to 60% off</Text>

                <LinearGradient
                  colors={['#FFE6DF', '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.lowestPriceBadge}
                >
                  <Text style={styles.lowestPriceText}>Lowest Prices</Text>
                </LinearGradient>
              </Pressable>

              {/* Flights Card */}
              <Pressable style={styles.mainCard}>
                <View style={styles.iconWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=150&h=150' }}
                    style={styles.iconImage}
                  />
                </View>
                <Text style={styles.mainCardTitle}>Flights</Text>
                <Text style={styles.mainCardSub}>Up to 25% off</Text>
              </Pressable>
            </View>

            {/* Secondary tiles */}
            <View style={styles.secondaryTilesRow}>
              {/* Buses Tile */}
              <Pressable style={styles.tileCard}>
                <View style={styles.smallIconWrap}>
                  <Text style={{ fontSize: 24 }}>🚌</Text>
                </View>
                <Text style={styles.tileTitle}>Buses</Text>
              </Pressable>

              {/* Trains Tile */}
              <Pressable style={styles.tileCard}>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>COMING SOON</Text>
                </View>
                <View style={styles.smallIconWrap}>
                  <Text style={{ fontSize: 24 }}>🚆</Text>
                </View>
                <Text style={styles.tileTitle}>Trains</Text>
              </Pressable>

              {/* Holidays Tile */}
              <Pressable style={styles.tileCard}>
                <View style={styles.smallIconWrap}>
                  <Text style={{ fontSize: 24 }}>🏖️</Text>
                </View>
                <Text style={styles.tileTitle}>Holidays</Text>
              </Pressable>
            </View>

            {/* TRIPPY AI TILE ROW (Full Width) */}
            <Pressable style={styles.trippyFullCard} onPress={() => setChatVisible(true)}>
              <View style={styles.aiPickBadge2}>
                <Text style={styles.aiPickBadgeText2}>NEW</Text>
              </View>
              <View style={styles.trippyIconBlock}>
                <TrippyAvatar size={48} />
              </View>
              <View style={styles.trippyTextBlock}>
                <Text style={styles.trippyTitle}>Trippy AI Planner</Text>
                <Text style={styles.trippyDesc}>Get a custom trip plan made for you in seconds.</Text>
              </View>
              <Feather name="arrow-right" size={20} color="#8A2BE2" />
            </Pressable>

            {/* Banner Block */}
            <View style={styles.bannerBlock}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800' }}
                style={styles.bannerImage}
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerSubtitle}>HELLO</Text>
                <Text style={styles.bannerTitle}>Summer Exclusive</Text>
                <Text style={styles.bannerDesc}>Unlock up to 20% off</Text>
                <Text style={styles.bannerSubdesc}>on premium flights, hotels & travel</Text>
              </View>
              <View style={styles.bannerFooter}>
                <Text style={styles.bannerFooterTitle}>SBI Card</Text>
                <View style={styles.bannerFooterDivider} />
                <Text style={styles.bannerFooterDesc}>Valid on Credit Card Transactions*</Text>
              </View>
            </View>

            {/* Optional bottom row of small vertical cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomCardsScroll}>
              <View style={styles.bottomCard}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=400' }} style={styles.bottomCardImg} />
                <View style={styles.bottomCardOverlay}>
                  <Text style={styles.bottomCardTitle}>Fly Home to India</Text>
                  <Text style={styles.bottomCardSub}>Up to ₹11,000 off</Text>
                </View>
              </View>
              <View style={styles.bottomCard}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=400' }} style={styles.bottomCardImg} />
                <View style={styles.bottomCardOverlayWhite}>
                  <Text style={styles.bottomCardTitleDark}>Brand of the day</Text>
                  <Text style={styles.bottomCardSubBrand}>Min. 25% off</Text>
                </View>
              </View>
              <View style={styles.bottomCard}>
                <LinearGradient colors={['#9B5DE5', '#F15BB5']} style={styles.bottomCardGradient}>
                  <Text style={styles.bottomCardGradientTitle}>euphoria</Text>
                  <Text style={styles.bottomCardGradientSub}>Click to earn up to 11.5% CASHBACK!*</Text>
                </LinearGradient>
              </View>
            </ScrollView>

          </ScrollView>

        </View>

        <BottomTabBar activeTab="home" />

        <ChatModal
          visible={chatVisible}
          onClose={() => setChatVisible(false)}
          onTripCreated={(tripId) => {
            setChatVisible(false);
            // Small delay to let modal close animation finish smoothly
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
    backgroundColor: '#121212', // Keep bottom dark for the rounding to show
  },
  contentSheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginLeft: -12, // Aggressive nudge to overcome asset whitespace and align with cards
    marginBottom: Spacing.md,
    backgroundColor: 'transparent',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    color: '#F04C22',
    letterSpacing: -0.8,
    fontFamily: 'Inter_700Bold',
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  coin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    paddingBottom: 60,
  },
  topCardsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  mainCard: {
    flex: 1,
    height: 155,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden', // to bound the badge
  },
  iconWrap: {
    width: 60,
    height: 60,
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Make circular
  },
  mainCardTitle: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  mainCardSub: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: 'Inter_500Medium',
  },
  lowestPriceBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 20,
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 24,
  },
  lowestPriceText: {
    fontSize: 11,
    color: Colors.orange,
    fontFamily: 'Inter_600SemiBold',
  },
  secondaryTilesRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  tileCard: {
    flex: 1,
    height: 95,
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#FF4E00',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 10,
  },
  comingSoonText: {
    fontSize: 9,
    color: Colors.white,
    fontFamily: 'Inter_800ExtraBold',
  },
  smallIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tileTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  trippyFullCard: {
    width: '100%',
    backgroundColor: '#F4F0FF',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingVertical: 16,
    marginBottom: Spacing.xl,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2D4FF',
  },
  aiPickBadge2: {
    position: 'absolute',
    top: -8,
    left: 30,
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  aiPickBadgeText2: {
    fontSize: 9,
    color: Colors.white,
    fontFamily: 'Inter_800ExtraBold',
  },
  trippyIconBlock: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  trippyTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  trippyTitle: {
    fontSize: 18,
    color: '#4A00A0',
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 4,
  },
  trippyDesc: {
    fontSize: 12,
    color: '#663B9E',
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
  },
  bannerBlock: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: Spacing.xl,
  },
  bannerImage: {
    width: '100%',
    height: 140,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: Spacing.lg,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: 'Inter_800ExtraBold',
    lineHeight: 24,
  },
  bannerDesc: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: 'Inter_700Bold',
    marginTop: 12,
  },
  bannerSubdesc: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: 'Inter_500Medium',
  },
  bannerCoupon: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bannerCouponText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter_800ExtraBold',
  },
  bannerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
  },
  bannerFooterTitle: {
    fontSize: 12,
    color: '#0066CC',
    fontFamily: 'Inter_800ExtraBold',
  },
  bannerFooterDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.border,
    marginHorizontal: 10,
  },
  bannerFooterDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
  bottomCardsScroll: {
    gap: Spacing.md,
  },
  bottomCard: {
    width: 130,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bottomCardImg: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: Spacing.md,
  },
  bottomCardTitle: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: 'Inter_700Bold',
    lineHeight: 20,
  },
  bottomCardSub: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
  },
  bottomCardOverlayWhite: {
    ...StyleSheet.absoluteFillObject,
    padding: Spacing.md,
  },
  bottomCardTitleDark: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  },
  bottomCardSubBrand: {
    fontSize: 14,
    color: Colors.orange,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 8,
  },
  bottomCardGradient: {
    flex: 1,
    padding: Spacing.md,
  },
  bottomCardGradientTitle: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
  },
  bottomCardGradientSub: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 8,
  },
});
