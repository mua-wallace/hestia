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
  onFilterPress?: () => void; // Optional - filter handler
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
              tintColor="#5A759D"
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
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={() => {/* Search action */}}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/search-icon.png')}
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <SearchInput
            placeholder={searchPlaceholder}
            onSearch={handleSearchChange}
            inputStyle={styles.searchInput}
            placeholderStyle={styles.placeholderText}
            placeholderBoldStyle={styles.placeholderBold}
            placeholderNormalStyle={styles.placeholderNormal}
            inputWrapperStyle={styles.searchInputContainer}
          />
        </View>
        {onFilterPress && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onFilterPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/menu-icon.png')}
              style={styles.filterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
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
    width: 14 * scaleX, // Figma: 14px width
    height: 28 * scaleX, // Figma: 28px height
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: 14 * scaleX, // Figma: 14px × 28px
    height: 28 * scaleX,
    // No rotation - using back-arrow.png directly as it already points left
  },
  title: {
    fontSize: 24 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700' as any,
    fontStyle: 'normal',
    color: '#607AA1',
    lineHeight: undefined, // normal line height
    position: 'absolute',
    left: 69 * scaleX, // Figma: 69px (27px arrow start + 14px arrow width + 28px gap = 69px)
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
    paddingHorizontal: 15 * scaleX,
    marginTop: 25 * scaleX,
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
  searchInputContainer: {
    height: '100%',
  },
  searchInput: {
    fontFamily: 'Inter',
    fontWeight: '300' as any,
    padding: 0,
    height: '100%',
    backgroundColor: 'transparent',
  },
  placeholderText: {
    fontFamily: 'Inter',
    color: 'rgba(0,0,0,0.6)',
    includeFontPadding: false,
  },
  placeholderBold: {
    fontWeight: '700' as any, // Bold for "Search"
  },
  placeholderNormal: {
    fontWeight: '400' as any, // Regular for rest of text
  },
  searchIconButton: {
    width: 26 * scaleX,
    height: 26 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10 * scaleX,
  },
  searchIcon: {
    width: 19 * scaleX,
    height: 19 * scaleX,
    tintColor: colors.primary.main,
  },
  filterButton: {
    width: 26 * scaleX,
    height: 12 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18 * scaleX, // Gap between search bar and filter icon
  },
  filterIcon: {
    width: 26,
    height: 12,
    tintColor: colors.primary.main,
  },
});

