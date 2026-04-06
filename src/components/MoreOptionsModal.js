import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
// Removed react-native-modal for better Expo Web stability
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme/colors';
import { activities, hotels, transfers } from '../data/mockData';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * MoreOptionsModal — Bottom sheet that shows 5 more options
 * for a specific category (Hotel/Activity).
 */
export default function MoreOptionsModal({
  visible,
  onClose,
  type = 'activity',
  onSelect,
  alreadySelectedIds = [],
  context = null, // Added context (area or route)
}) {
  // Get potential options based on type
  let allOptions = [];
  if (type === 'hotel') allOptions = hotels;
  else if (type === 'activity') allOptions = activities;
  else if (type === 'transit') allOptions = transfers;

  // Filter by context if provided
  const filteredOptions = allOptions
    .filter((item) => {
      // Don't show already selected items
      if (alreadySelectedIds.includes(item.id)) return false;
      
      // If we have a context (e.g. "munnar" or "Alleppey -> Munnar"), filter by it
      if (context) {
        if (type === 'hotel' || type === 'activity') {
          return item.area === context;
        } else if (type === 'transit') {
          return item.route === context;
        }
      }
      return true;
    })
    .slice(0, 10); // Show up to 10 options now that we are filtering properly

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
        {/* Handle */}
        <View style={styles.handleBar}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {type === 'hotel' ? 'More Stays' : 
             type === 'activity' ? 'More Experiences' : 
             'Transport Alternatives'}
          </Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredOptions.length === 0 ? (
            <Text style={styles.emptyText}>No more options available.</Text>
          ) : (
            filteredOptions.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.cardHeader}>
                  {type !== 'transit' && (
                    <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.itemImage} />
                  )}
                  <View style={styles.itemInfo}>
                    <View style={styles.itemRowHeader}>
                      <Text style={styles.itemName}>
                        {item.name}
                      </Text>
                      {item.rating && (
                        <View style={styles.ratingBox}>
                          <Text style={styles.ratingNumber}>{item.rating}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.itemSubRow}>
                      {type === 'transit' ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {item.route && (
                            <Text style={styles.itemSub}>
                              {item.route} <Text style={{ color: Colors.textMuted }}>•</Text> 
                            </Text>
                          )}
                          <Feather name="clock" size={12} color={Colors.textSecondary} style={{ marginHorizontal: 4 }} />
                          <Text style={styles.itemSub}>{item.duration}</Text>
                        </View>
                      ) : (
                        <>
                          {(type === 'activity' || type === 'hotel') && (
                            <Feather name={type === 'activity' ? "clock" : "map-pin"} size={11} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                          )}
                          <Text style={styles.itemSub}>
                            {item.duration || item.location?.split(',')[0]}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                <Text style={styles.itemDescription}>
                  {item.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Pressable
                    style={styles.addBtn}
                    onPress={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                  >
                    <Feather name="plus" size={14} color={Colors.white} />
                    <Text style={styles.addBtnText}>Add to Trip</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingHorizontal: Spacing.xl,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 20,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: Spacing.xl,
    paddingBottom: 40,
    paddingTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 40,
    ...Fonts.medium,
  },
  itemCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: Radius.xs,
    backgroundColor: Colors.cardBg,
  },
  itemInfo: {
    flex: 1,
  },
  itemRowHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
    gap: 8,
  },
  itemName: {
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
    ...Fonts.bold,
  },
  ratingBox: {
    backgroundColor: '#005CEE',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginTop: 2,
  },
  ratingNumber: {
    color: Colors.white,
    fontSize: 10,
    ...Fonts.bold,
  },
  itemSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    ...Fonts.medium,
  },
  itemDescription: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: Spacing.lg, // Extra breathing space since divider is gone
    ...Fonts.regular,
  },
  cardFooter: {
    paddingTop: 4, // Reduced since border is gone
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.textPrimary,
    ...Fonts.bold,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.black,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  addBtnText: {
    color: Colors.white,
    fontSize: 13,
    ...Fonts.bold,
  },
});
