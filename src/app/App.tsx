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
import * as Notifications from 'expo-notifications';
import { navigationRef } from './navigation/navigationRef';
import type { PushData } from '../services/notifications';

export default function App() {
  useEffect(() => {
    getFullRoomDetails().catch((err) => console.warn('[getFullRoomDetails]', err));
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = (response.notification.request.content.data ?? {}) as Partial<PushData> & Record<string, unknown>;
      if (!navigationRef.isReady()) return;

      if (data.type === 'chat_message' && typeof data.chatId === 'string') {
        navigationRef.navigate('ChatDetail', { chatId: data.chatId });
        return;
      }

      if (data.type === 'room_assignment' && typeof data.roomId === 'string') {
        navigationRef.navigate('RoomDetail', { roomId: data.roomId, initialTab: 'Overview' });
        return;
      }

      if (data.type === 'ticket_tag') {
        // Ticket detail screen isn't wired yet; take user to Tickets.
        navigationRef.navigate('Main');
        return;
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <MessageModalProvider>
              <NavigationContainer ref={navigationRef}>
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
