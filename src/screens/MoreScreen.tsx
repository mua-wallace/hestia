import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>More Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  text: {
    fontSize: parseInt(typography.fontSizes['4xl']),
    color: colors.text.primary,
  },
});

