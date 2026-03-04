/**
 * App shell: providers + navigation
 * Root component wired from project root App.tsx
 */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { MessageModalProvider } from '../contexts/MessageModalContext';
import { AIChatOverlayProvider } from '../contexts/AIChatOverlayContext';
import AppNavigator from './navigation/AppNavigator';
import { getFullRoomDetails } from '../services/rooms';

export default function App() {
  useEffect(() => {
    getFullRoomDetails().catch((err) => console.warn('[getFullRoomDetails]', err));
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <MessageModalProvider>
              <NavigationContainer>
                <AIChatOverlayProvider>
                  <StatusBar style="auto" />
                  <AppNavigator />
                </AIChatOverlayProvider>
              </NavigationContainer>
            </MessageModalProvider>
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
