import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { UserProfile, ShiftType } from '../../types/home.types';
import { colors, typography } from '../../theme';
import AMPMToggle from './AMPMToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface HomeHeaderProps {
  user: UserProfile;
  selectedShift: ShiftType;
  date: string;
  onShiftToggle: (shift: ShiftType) => void;
  onBellPress: () => void;
}

export default function HomeHeader({
  user,
  selectedShift,
  date,
  onShiftToggle,
  onBellPress,
}: HomeHeaderProps) {

  return (
    <View style={[
      styles.container,
      selectedShift === 'PM' && styles.containerPM
    ]}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../../assets/icons/profile-image.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          {user.hasFlag && (
            <View style={styles.flagContainer}>
              <View style={styles.flagCircle}>
                <Image
                  source={require('../../../assets/icons/flag-icon.png')}
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={[
            styles.userName,
            selectedShift === 'PM' && styles.userNamePM
          ]}>
            {user.name}
          </Text>
          <Text style={[
            styles.userRole,
            selectedShift === 'PM' && styles.userRolePM
          ]}>
            {user.role}
          </Text>
        </View>
      </View>

      {/* AM/PM Toggle */}
      <View style={styles.toggleContainer}>
        <AMPMToggle selected={selectedShift} onToggle={onShiftToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    height: 153 * scaleX,
    shadowColor: 'rgba(100,131,176,0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 105.1 * scaleX / 3,
    elevation: 8,
    zIndex: 100,
  },
  containerPM: {
    backgroundColor: '#38414F', // Dark slate gray for PM mode
  },
  profileSection: {
    position: 'absolute',
    left: 22 * scaleX,
    top: 74 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    width: 51 * scaleX,
    height: 51 * scaleX,
  },
  profileImage: {
    width: 51 * scaleX,
    height: 51 * scaleX,
    borderRadius: 25.5 * scaleX,
  },
  flagContainer: {
    position: 'absolute',
    right: -7 * scaleX,
    bottom: -3 * scaleX,
  },
  flagCircle: {
    width: 30.708 * scaleX,
    height: 30.708 * scaleX,
    borderRadius: 15.354 * scaleX,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f1f6fc',
  },
  flagIcon: {
    width: 11.071 * scaleX,
    height: 11.071 * scaleX,
  },
  profileInfo: {
    marginLeft: 25 * scaleX,
  },
  userName: {
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: colors.text.primary,
    marginBottom: 2 * scaleX,
  },
  userRole: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: colors.text.primary,
  },
  toggleContainer: {
    position: 'absolute',
    right: 59.5 * scaleX,
    top: 82 * scaleX,
  },
  userNamePM: {
    color: colors.text.white,
  },
  userRolePM: {
    color: colors.text.white,
  },
});

