import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing } from '../theme/colors';

const tabs = [
  { key: 'home',    label: 'Home',     icon: 'home' },
  { key: 'mytrips', label: 'My Trips', icon: 'ticket' },
  { key: 'work',    label: 'Work',     icon: 'briefcase' },
  { key: 'account', label: 'Account',  icon: 'person' },
  { key: 'offers',  label: 'Offers',   icon: 'pricetag' },
];

export default function BottomTabBar({ activeTab = 'home' }) {
  const navigation = useNavigation();

  const handlePress = (key) => {
    if (key === 'mytrips') navigation.navigate('MyTripsScreen');
    if (key === 'home') navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const iconName = isActive ? tab.icon : `${tab.icon}-outline`;
        const activeColor = '#FFFFFF';
        const inactiveColor = 'rgba(255, 255, 255, 0.45)';

        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => handlePress(tab.key)}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isActive ? activeColor : inactiveColor}
            />
            <Text style={[styles.label, { color: isActive ? activeColor : inactiveColor }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#121212', // Deep dark grey
    paddingBottom: 8,
    paddingTop: 12,
    borderTopWidth: 0, 
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    ...Fonts.medium,
  },
});
