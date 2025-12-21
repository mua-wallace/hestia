import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ShiftType } from '../../types/home.types';
import { colors, typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface AMPMToggleProps {
  selected: ShiftType;
  onToggle: (shift: ShiftType) => void;
}

export default function AMPMToggle({ selected, onToggle }: AMPMToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toggleBackground}>
        <View style={[
          styles.activeButton,
          selected === 'PM' && styles.activeButtonPM
        ]} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onToggle('AM')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            selected === 'AM' && styles.buttonTextActive
          ]}>
            AM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onToggle('PM')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.buttonText,
            selected === 'PM' && styles.buttonTextActive
          ]}>
            PM
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBackground: {
    width: 121 * scaleX,
    height: 35.243 * scaleX,
    backgroundColor: '#f1f6fc',
    borderRadius: 68 * scaleX,
    flexDirection: 'row',
    position: 'relative',
    padding: 2.35 * scaleX,
  },
  activeButton: {
    position: 'absolute',
    left: 2.35 * scaleX,
    top: 2.35 * scaleX,
    width: 64.612 * scaleX,
    height: 30.544 * scaleX,
    backgroundColor: colors.primary.main,
    borderRadius: 68 * scaleX,
  },
  activeButtonPM: {
    left: 'auto',
    right: 2.35 * scaleX,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  buttonText: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#b1afaf',
  },
  buttonTextActive: {
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.white,
  },
});

