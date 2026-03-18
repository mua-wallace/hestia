import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Design is based on iPhone 16 Pro Max (440px width, 956px height)
const DESIGN_WIDTH = 440;
const DESIGN_HEIGHT = 956;
// Uniform scaling so absolute-positioned splash elements stay on-screen
// across devices with different aspect ratios (iOS + Android).
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;
const scaleY = SCREEN_HEIGHT / DESIGN_HEIGHT;
const scale = Math.min(scaleX, scaleY);

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
      {/* Centered splash content (logo + copy) */}
      <View style={styles.centerContent}>
        <View style={styles.logoTitleGroup}>
          <Image
            source={require('../../assets/logos/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Hestia</Text>
        </View>

        <Text style={styles.subtitle}>Build by Housekeepers</Text>
        <Text style={styles.tagline}>For Housekeeping</Text>
      </View>

      {/* Pagination indicator - centered at bottom */}
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
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24 * scale,
  },

  // Group 524 container - row with logo + title
  logoTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 53 * scale,
    height: 50 * scale,
  },
  title: {
    marginLeft: 12 * scale,
    fontSize: 39 * scale,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as '400',
    color: '#fefeff', // Exact color from Figma
    lineHeight: 39 * scale * 1.147, // line-height: 1.147
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22 * scale,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as '300',
    color: colors.text.white,
    lineHeight: 22 * scale, // normal line height
    textAlign: 'center',
    marginTop: 24 * scale,
  },
  tagline: {
    fontSize: 21 * scale,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as '700',
    color: colors.text.white,
    lineHeight: 24 * scale,
    textAlign: 'center',
    marginTop: 6 * scale,
  },
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
    bottom: 80 * scale, // keep it near the original design while centered
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    width: 54 * scale,
    height: 8 * scale,
    backgroundColor: '#C0C0C0', // Exact color from Figma design
    borderRadius: 57 * scale, // Exact border radius from Figma
  },
});

