import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
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
  onSearch: (text: string) => void;
  onMenuPress: () => void;
  onBellPress: () => void;
}

export default function HomeHeader({
  user,
  selectedShift,
  date,
  onShiftToggle,
  onSearch,
  onMenuPress,
  onBellPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../../../assets/icons/home/profile-image.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          {user.hasFlag && (
            <View style={styles.flagContainer}>
              <View style={styles.flagCircle}>
                <Image
                  source={require('../../../assets/icons/home/flag-icon.png')}
                  style={styles.flagIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>
      </View>

      {/* AM/PM Toggle */}
      <View style={styles.toggleContainer}>
        <AMPMToggle selected={selectedShift} onToggle={onShiftToggle} />
      </View>

      {/* Overview Today Section */}
      <View style={styles.overviewSection}>
        <Text style={styles.overviewTitle}>Overview Today</Text>
        <Text style={styles.overviewDate}>{date}</Text>
      </View>

      {/* Search Bar and Menu */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Rooms, Guests, Floors etc"
            placeholderTextColor="rgba(0,0,0,0.36)"
            onChangeText={onSearch}
          />
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={() => {/* Search action */}}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/home/search-icon.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/home/menu-icon.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
    backgroundColor: colors.background.primary,
    height: 334 * scaleX, // Increased to accommodate search bar (252 + 59 + padding)
    shadowColor: 'rgba(100,131,176,0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 105.1 * scaleX / 3,
    elevation: 8,
    zIndex: 100,
  },
  profileSection: {
    position: 'absolute',
    left: 22 * scaleX,
    top: 110 * scaleX,
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
    top: 118 * scaleX,
  },
  overviewSection: {
    position: 'absolute',
    left: 21 * scaleX,
    top: 194 * scaleX,
  },
  overviewTitle: {
    fontSize: 18 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: colors.text.primary,
    marginBottom: 2 * scaleX,
  },
  overviewDate: {
    fontSize: 11 * scaleX,
    fontFamily: 'Inter',
    fontWeight: '600' as any,
    color: colors.text.primary,
  },
  searchBarContainer: {
    position: 'absolute',
    left: 15 * scaleX,
    top: 252 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    height: 59 * scaleX,
    width: 347 * scaleX,
    backgroundColor: '#f1f6fc',
    borderRadius: 82 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
  },
  searchInput: {
    flex: 1,
    fontSize: 13 * scaleX,
    fontFamily: 'Inter',
    fontWeight: '300' as any, // Light weight for placeholder
    color: colors.text.primary,
  },
  searchIconButton: {
    width: 26 * scaleX,
    height: 26 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10 * scaleX,
  },
  searchIcon: {
    width: 19 * scaleX,
    height: 19 * scaleX,
    tintColor: colors.primary.main,
  },
  menuButton: {
    width: 24.545 * scaleX,
    height: 15.545 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18 * scaleX, // Gap between search bar and menu icon
  },
  menuIcon: {
    width: 24.545 * scaleX,
    height: 15.545 * scaleX,
    tintColor: colors.primary.main,
  },
});

