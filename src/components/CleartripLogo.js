import { View, Image, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme/colors';

/**
 * CleartripLogo — Renders the official brand logo with a clean background.
 * width/height ratio is roughly 3.5:1
 */
export default function CleartripLogo({ size = 28 }) {
  const height = size;
  const width = size * 3.5;
  
  return (
    <Image
      source={require('../../assets/images/cleartrip_logo.png')}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logoBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
