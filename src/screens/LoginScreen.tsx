import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, spacing } from '../theme';
import Input from '../components/Input';
import Button from '../components/Button';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('Stellakitou@mandarinorientalsavoy.ch');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement login logic
    navigation.replace('Main');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <View style={styles.logo} />
        </View>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>Hestia</Text>
        </View>
        
        <TouchableOpacity style={styles.languageSelector}>
          <Text style={styles.languageText}>
            Language <Text style={styles.languageValue}>EN</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Log in</Text>

      <View style={styles.form}>
        <Input
          label="Company email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          style={styles.loginButton}
        />

        <TouchableOpacity style={styles.recoverPassword}>
          <Text style={styles.recoverPasswordText}>Recover Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.customerService}>
        <View style={styles.serviceIcon} />
        <View style={styles.serviceContent}>
          <Text style={styles.serviceTitle}>Customer Service</Text>
          <Text style={styles.serviceSubtitle}>Having issues with the app?</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: 35,
    paddingTop: 85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    width: 35,
    height: 33,
    marginRight: 45,
  },
  logo: {
    width: 35,
    height: 33,
    backgroundColor: colors.primary.main,
    borderRadius: 4,
  },
  brandContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: 19,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular,
    color: colors.text.primary,
  },
  languageSelector: {
    position: 'absolute',
    right: 0,
    top: 12,
  },
  languageText: {
    fontSize: parseInt(typography.fontSizes['2xl']),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light,
    color: colors.primary.main,
  },
  languageValue: {
    fontWeight: typography.fontWeights.bold,
    color: colors.text.pink,
  },
  title: {
    fontSize: parseInt(typography.fontSizes['8xl']),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary.main,
    marginBottom: 30,
  },
  form: {
    marginBottom: 40,
  },
  input: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  recoverPassword: {
    alignItems: 'center',
    marginTop: 10,
  },
  recoverPasswordText: {
    fontSize: parseInt(typography.fontSizes['3xl']),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular,
    color: colors.primary.main,
  },
  customerService: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingLeft: 60,
  },
  serviceIcon: {
    width: 42,
    height: 40,
    backgroundColor: colors.primary.main,
    borderRadius: 4,
    marginRight: 15,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: parseInt(typography.fontSizes.lg),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary.main,
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: parseInt(typography.fontSizes.lg),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light,
    color: colors.text.primary,
  },
});

