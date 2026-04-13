import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';
import { useAuth } from '../contexts/AuthContext';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const DESIGN_WIDTH = 440;
const DESIGN_HEIGHT = 956;
const MIN_SPLASH_DURATION_MS = 2000;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { session, hotelId, error, isLoading } = useAuth();
  const { width, height } = useWindowDimensions();
  const scale = useMemo(
    () => Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT),
    [width, height],
  );
  const styles = useMemo(() => buildSplashStyles(scale), [scale]);

  useEffect(() => {
    if (isLoading) return;
    if (session && !hotelId && !error) return;

    const timer = setTimeout(() => {
      if (session) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }, MIN_SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [isLoading, session, hotelId, error, navigation]);

  return (
    <View style={styles.container}>
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
        {!!error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}
      </View>

      <View style={styles.indicator} />
      {(isLoading || (session && !hotelId && !error)) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.text.white} />
        </View>
      )}
    </View>
  );
}

function buildSplashStyles(scale: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5D799B',
      alignItems: 'center',
    },
    centerContent: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24 * scale,
    },
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
      color: '#fefeff',
      lineHeight: 39 * scale * 1.147,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 22 * scale,
      fontFamily: typography.fontFamily.primary,
      fontWeight: typography.fontWeights.light as '300',
      color: colors.text.white,
      lineHeight: 22 * scale,
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
    errorText: {
      marginTop: 16 * scale,
      paddingHorizontal: 18 * scale,
      fontSize: 14 * scale,
      fontFamily: typography.fontFamily.primary,
      color: colors.text.white,
      textAlign: 'center',
      opacity: 0.95,
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
      bottom: 80 * scale,
      left: 0,
      right: 0,
      marginHorizontal: 'auto',
      width: 54 * scale,
      height: 8 * scale,
      backgroundColor: '#C0C0C0',
      borderRadius: 57 * scale,
    },
  });
}
