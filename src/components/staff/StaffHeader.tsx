import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, STAFF_HEADER } from '../../constants/staffStyles';

interface StaffHeaderProps {
  onBackPress?: () => void;
  onSearchPress?: () => void;
}

export default function StaffHeader({
  onBackPress,
  onSearchPress,
}: StaffHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />
      
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../../assets/icons/back-arrow.png')}
          style={styles.backArrow}
          resizeMode="contain"
          tintColor="#607aa1"
        />
      </TouchableOpacity>
      
      {/* Title */}
      <Text style={styles.title}>Staff</Text>
      
      {/* Search Icon */}
      {onSearchPress && (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/search-icon.png')}
            style={styles.searchIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STAFF_HEADER.height * scaleX,
    zIndex: 10,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STAFF_HEADER.height * scaleX,
    backgroundColor: STAFF_HEADER.background.backgroundColor,
  },
  backButton: {
    position: 'absolute',
    left: STAFF_HEADER.backButton.left * scaleX,
    top: STAFF_HEADER.backButton.top * scaleX,
    width: STAFF_HEADER.backButton.width * scaleX,
    height: STAFF_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: STAFF_HEADER.backButton.width * scaleX,
    height: STAFF_HEADER.backButton.height * scaleX,
  },
  title: {
    position: 'absolute',
    left: STAFF_HEADER.title.left * scaleX,
    top: STAFF_HEADER.title.top * scaleX,
    fontSize: STAFF_HEADER.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: STAFF_HEADER.title.color,
  },
  searchButton: {
    position: 'absolute',
    right: STAFF_HEADER.searchIcon.right * scaleX,
    top: STAFF_HEADER.searchIcon.top * scaleX,
    width: STAFF_HEADER.searchIcon.width * scaleX,
    height: STAFF_HEADER.searchIcon.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: STAFF_HEADER.searchIcon.width * scaleX,
    height: STAFF_HEADER.searchIcon.height * scaleX,
  },
});


