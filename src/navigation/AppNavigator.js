import React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import TripCanvasScreen from '../screens/TripCanvasScreen';
import NativePDPScreen from '../screens/NativePDPScreen';
import CleartripSearchScreen from '../screens/CleartripSearchScreen';

/**
 * AppNavigator – React Navigation v7 static API.
 * Screens: HomeScreen → TripCanvasScreen → NativePDPScreen
 * All headers are hidden (each screen has its own custom header).
 */
const RootStack = createNativeStackNavigator({
  initialRouteName: 'HomeScreen',
  screenOptions: {
    headerShown: false,
    animation: 'slide_from_right',
    contentStyle: { backgroundColor: '#FFFFFF' },
  },
  screens: {
    HomeScreen: {
      screen: HomeScreen,
      options: { animation: 'none' },
    },
    MyTripsScreen: {
      screen: MyTripsScreen,
      options: { animation: 'none' },
    },
    TripCanvasScreen: {
      screen: TripCanvasScreen,
    },
    NativePDPScreen: {
      screen: NativePDPScreen,
    },
    CleartripSearchScreen: {
      screen: CleartripSearchScreen,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function AppNavigator() {
  return <Navigation />;
}
