import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, spacing } from '../theme';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder - replace with actual logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo} />
        </View>
        <Text style={styles.title}>Hestia</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.subtitle}>Build by Housekeepers</Text>
        <Text style={styles.tagline}>For Housekeeping</Text>
      </View>

      {/* Pagination indicator */}
      <View style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 53,
    height: 50,
    backgroundColor: colors.text.white,
    borderRadius: 8,
  },
  title: {
    fontSize: parseInt(typography.fontSizes['9xl']),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular,
    color: colors.text.white,
    lineHeight: parseInt(typography.fontSizes['9xl']) * parseFloat(typography.lineHeights.tight),
    marginLeft: 66,
  },
  footer: {
    position: 'absolute',
    bottom: 200,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: parseInt(typography.fontSizes['6xl']),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light,
    color: colors.text.white,
    marginBottom: 11,
  },
  tagline: {
    fontSize: parseInt(typography.fontSizes['5xl']),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.white,
  },
  indicator: {
    position: 'absolute',
    bottom: 100,
    width: 54,
    height: 8,
    backgroundColor: colors.border.medium,
    borderRadius: parseInt(typography.fontSizes['9xl']),
  },
});

