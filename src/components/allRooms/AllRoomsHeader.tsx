import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { scaleX } from '../../constants/allRoomsStyles';
import AMPMToggle from '../home/AMPMToggle';
import SearchInput from '../SearchInput';
import type { ShiftType } from '../../types/home.types';

interface AllRoomsHeaderProps {
  selectedShift: ShiftType;
  onShiftToggle: (shift: ShiftType) => void;
  onSearch: (text: string) => void;
  onFilterPress: () => void;
  onBackPress?: () => void; // Optional - navigation handler
  searchPlaceholder?: string | { bold: string; normal: string }; // Optional dynamic placeholder
}

export default function AllRoomsHeader({
  selectedShift,
  onShiftToggle,
  onSearch,
  onFilterPress,
  onBackPress,
  searchPlaceholder = { bold: 'Search ', normal: 'Rooms, Guests, etc' },
}: AllRoomsHeaderProps) {
  const handleSearchChange = (text: string) => {
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      {/* Blue gradient background */}
      <View style={styles.headerBackground} />
      
      {/* Top section with back button, title, and AM/PM toggle */}
      <View style={styles.topSection}>
        {/* Back arrow - always visible as per Figma design */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBackPress || (() => {})} 
          activeOpacity={0.7}
        >
            <Image
              source={require('../../../assets/icons/back-arrow.png')}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
        
        <Text style={styles.title}>All Rooms</Text>
        
        <View style={styles.toggleContainer}>
          <AMPMToggle
            selected={selectedShift}
            onToggle={onShiftToggle}
          />
        </View>
      </View>
      
      {/* Search bar section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <SearchInput
            placeholder={searchPlaceholder}
            onSearch={handleSearchChange}
            inputStyle={styles.searchInput}
            placeholderStyle={styles.placeholderText}
            placeholderBoldStyle={styles.placeholderBold}
            placeholderNormalStyle={styles.placeholderText}
            inputWrapperStyle={styles.searchInputWrapper}
          />
          
          <TouchableOpacity
            style={styles.searchIconContainer}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/search-icon.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress} activeOpacity={0.7}>
          <Image
            source={require('../../../assets/icons/menu-icon.png')}
            style={styles.filterIcon}
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
    height: 217 * scaleX, // Adjusted to fit search bar
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 133 * scaleX,
    backgroundColor: '#e4eefe', // Light blue background
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 27 * scaleX,
    paddingTop: 69 * scaleX,
    height: 133 * scaleX,
  },
  backButton: {
    position: 'absolute',
    left: 27 * scaleX,
    top: 69 * scaleX,
    width: 32 * scaleX, // Increased size for better visibility
    height: 32 * scaleX, // Increased size for better visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 32 * scaleX, // Increased icon size to match Figma visual appearance
    height: 32 * scaleX, // Increased icon size to match Figma visual appearance
    transform: [{ rotate: '270deg' }], // Rotate to point left (as per Figma)
  },
  title: {
    fontSize: 24 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#607aa1',
    position: 'absolute',
    left: 69 * scaleX, // Exact position from Figma: 69px (27px arrow start + 14px arrow width + 28px spacing)
    top: 69 * scaleX,
  },
  toggleContainer: {
    position: 'absolute',
    right: 32.5 * scaleX,
    top: 65 * scaleX,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26 * scaleX,
    marginTop: 25 * scaleX,
    gap: 12 * scaleX,
  },
  searchBar: {
    flex: 1,
    height: 59 * scaleX,
    backgroundColor: '#f1f6fc',
    borderRadius: 82 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20 * scaleX,
    paddingRight: 20 * scaleX,
    position: 'relative',
  },
  searchInputWrapper: {
    justifyContent: 'center',
  },
  searchInput: {
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    height: 59 * scaleX,
  },
  placeholderText: {
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#b1afaf',
    opacity: 0.36,
  },
  placeholderBold: {
    fontWeight: typography.fontWeights.semiBold as any,
  },
  searchIconContainer: {
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
  filterButton: {
    width: 26 * scaleX,
    height: 26 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 26 * scaleX,
    height: 26 * scaleX,
  },
});

