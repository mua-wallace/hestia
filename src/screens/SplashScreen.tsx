import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Design is based on iPhone 16 Pro Max (440px width, 956px height)
const DESIGN_WIDTH = 440;
const DESIGN_HEIGHT = 956;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

const MIN_SPLASH_DURATION_MS = 2000;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (session) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }, MIN_SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isLoading, session, navigation]);

  return (
    <View style={styles.container}>
      {/* Logo and Title Group (Group 524) */}
      <View style={styles.logoTitleGroup}>
        {/* Logo (Group 207) - absolute position: x=124, y=376 */}
        <Image 
          source={require('../../assets/logos/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Hestia Text - absolute position: x=190, y=386 */}
        <Text style={styles.title}>Hestia</Text>
      </View>
      
      {/* Build by Housekeepers - absolute position: x=98, y=534 */}
      <Text style={styles.subtitle}>Build by Housekeepers</Text>
      
      {/* For Housekeeping - absolute position: x=123, y=565 */}
      <Text style={styles.tagline}>For Housekeeping</Text>

      {/* Pagination indicator - absolute position: x=193, y=909, centered */}
      <View style={styles.indicator} />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.text.white} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5D799B', // Exact color from Figma design
  },
  // Group 524 container - positioned at x=124, y=376, width=177, height=55
  logoTitleGroup: {
    position: 'absolute',
    left: 124 * scaleX,
    top: 376 * scaleX,
    width: 177 * scaleX,
    height: 55 * scaleX,
  },
  // Logo (Group 207) - absolute position within frame: x=124, y=376 (relative to group: x=0, y=0)
  logo: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 53 * scaleX,
    height: 50 * scaleX,
  },
  // Hestia text - absolute position: x=190, y=386 (relative to group: x=66, y=10)
  title: {
    position: 'absolute',
    left: 66 * scaleX, // 190 - 124 = 66px
    top: 10 * scaleX, // 386 - 376 = 10px
    width: 120 * scaleX, // Increased width to ensure "Hestia" displays fully
    height: 45 * scaleX,
    fontSize: 39 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as '400',
    color: '#fefeff', // Exact color from Figma
    lineHeight: 39 * scaleX * 1.147, // line-height: 1.147
    textAlign: 'left',
  },
  // Build by Housekeepers - absolute position: x=98, y=534, width=243, height=22
  subtitle: {
    position: 'absolute',
    left: 98 * scaleX,
    top: 534 * scaleX,
    width: 243 * scaleX,
    height: 22 * scaleX,
    fontSize: 22 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as '300',
    color: colors.text.white,
    lineHeight: 22 * scaleX, // normal line height
    textAlign: 'left',
  },
  // For Housekeeping - absolute position: x=123, y=565, width=193, height=24
  tagline: {
    position: 'absolute',
    left: 123 * scaleX,
    top: 565 * scaleX,
    width: 193 * scaleX,
    height: 24 * scaleX,
    fontSize: 21 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as '700',
    color: colors.text.white,
    lineHeight: 24 * scaleX,
    textAlign: 'left',
  },
  // Pagination indicator - absolute position: x=193, y=909, width=54, height=8
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(93, 121, 155, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    left: 193 * scaleX, // Centered: (440 - 54) / 2 = 193
    top: 909 * scaleX,
    width: 54 * scaleX,
    height: 8 * scaleX,
    backgroundColor: '#C0C0C0', // Exact color from Figma design
    borderRadius: 57 * scaleX, // Exact border radius from Figma
  },
});

