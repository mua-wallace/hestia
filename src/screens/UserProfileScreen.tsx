/**
 * User Profile Screen
 * Shows logged-in user details, allows avatar update and logout
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { colors, typography, components } from '../theme';
import { getInitialsFromFullName } from '../utils/formatting';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/useUserStore';
import { isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile } from '../types/home.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

type UserProfileRouteParams = {
  UserProfile: { user: UserProfile };
};

const DEFAULT_USER: UserProfile = { name: 'User', role: 'Staff', department: undefined, hasFlag: false };

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<UserProfileRouteParams, 'UserProfile'>>();
  const { signOut, session } = useAuth();
  const initialUser = route.params?.user;
  const { profile, setProfile, updateAvatarUrl } = useUserStore();
  React.useEffect(() => {
    if (initialUser) setProfile(initialUser);
  }, [initialUser, setProfile]);
  const user = profile ?? initialUser ?? DEFAULT_USER;
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library to change your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const userId = session?.user?.id;
    if (!userId || !isSupabaseConfigured) {
      Alert.alert('Update unavailable', 'Profile update requires an active session and backend.');
      return;
    }

    setIsUpdatingAvatar(true);
    try {
      const uri = result.assets[0].uri;
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      await updateAvatarUrl(userId, base64, fileExt);
    } catch (err: unknown) {
      console.error('[UserProfile] Avatar update failed:', err);
      Alert.alert(
        'Update failed',
        (err instanceof Error ? err.message : null) || 'Could not update avatar. Ensure the avatars storage bucket exists and has correct policies.'
      );
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            (navigation as any).reset?.({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      (navigation as any).navigate?.('Main', { screen: 'Home' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header strip - project header color */}
      <View style={styles.headerStrip}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Circular avatar with frame */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarFrame}
            onPress={handleChangeAvatar}
            disabled={isUpdatingAvatar}
            activeOpacity={0.85}
          >
            {isUpdatingAvatar ? (
              <View style={[styles.avatarCircle, styles.avatarPlaceholder]}>
                <ActivityIndicator size="large" color={colors.text.white} />
              </View>
            ) : user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <View style={[styles.avatarCircle, styles.avatarPlaceholder]}>
                <Text style={styles.initialsText}>{getInitialsFromFullName(user.name)}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changePhotoLink}
            onPress={handleChangeAvatar}
            disabled={isUpdatingAvatar}
          >
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        {/* Name & Role */}
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>

        {/* Info card: Department */}
        {user.department != null && user.department !== '' && (
          <View style={styles.infoCard}>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{user.department}</Text>
            </View>
          </View>
        )}

        {/* Log out */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  headerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scaleX,
    paddingTop: 56 * scaleX,
    paddingBottom: 20 * scaleX,
    backgroundColor: components.header.backgroundColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.medium,
    shadowColor: 'rgba(100, 131, 176, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    paddingVertical: 8 * scaleX,
    paddingHorizontal: 4 * scaleX,
  },
  backButtonText: {
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.primary.main,
  },
  headerTitle: {
    fontSize: 20 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24 * scaleX,
    paddingTop: 24 * scaleX,
    paddingBottom: 48 * scaleX,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20 * scaleX,
  },
  avatarFrame: {
    width: 128 * scaleX,
    height: 128 * scaleX,
    borderRadius: 64 * scaleX,
    padding: 4 * scaleX,
    backgroundColor: colors.background.primary,
    borderWidth: 3 * scaleX,
    borderColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(100, 131, 176, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarCircle: {
    width: 114 * scaleX,
    height: 114 * scaleX,
    borderRadius: 57 * scaleX,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 114 * scaleX,
    height: 114 * scaleX,
    borderRadius: 57 * scaleX,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 38 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.white,
  },
  changePhotoLink: {
    marginTop: 12 * scaleX,
    paddingVertical: 6 * scaleX,
    paddingHorizontal: 12 * scaleX,
  },
  changePhotoText: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.primary.main,
  },
  userName: {
    fontSize: 24 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
    marginBottom: 6 * scaleX,
    textAlign: 'center',
  },
  userRole: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.secondary,
    marginBottom: 24 * scaleX,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    marginBottom: 28 * scaleX,
    backgroundColor: colors.background.primary,
    borderRadius: 12 * scaleX,
    borderWidth: 1,
    borderColor: colors.border.medium,
    overflow: 'hidden',
    shadowColor: 'rgba(100, 131, 176, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16 * scaleX,
    paddingHorizontal: 20 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.text.primary,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16 * scaleX,
    paddingHorizontal: 32 * scaleX,
    borderRadius: 10 * scaleX,
    backgroundColor: colors.background.primary,
    borderWidth: 1.5,
    borderColor: '#c53030',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semibold as any,
    color: '#c53030',
  },
});
