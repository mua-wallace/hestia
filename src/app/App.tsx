/**
 * App shell: providers + navigation
 * Root component wired from project root App.tsx
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { MessageModalProvider } from '../contexts/MessageModalContext';
import { AIChatOverlayProvider } from '../contexts/AIChatOverlayContext';
import AppNavigator from './navigation/AppNavigator';
import { getFullRoomDetails } from '../services/rooms';
import * as Notifications from 'expo-notifications';
import { navigationRef } from './navigation/navigationRef';
import type { PushData } from '../services/notifications';
import { setupNotificationPresentation } from '../services/notifications';
import {
  incomingAlertDedupeKeyFromPushData,
  presentIncomingNotificationAlert,
  subscribeToIncomingNotificationRows,
} from '../services/notificationIncoming';

function navigateFromPushData(data: Partial<PushData> & Record<string, unknown>) {
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
    navigationRef.navigate('Main');
  }
}

/** Push + Realtime inbox alerts (toast, vibration, badges); must sit under Auth + Toast providers. */
function NotificationExperience() {
  const { session } = useAuth();

  useEffect(() => {
    void setupNotificationPresentation();
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const c = notification.request.content;
      const data = (c.data ?? {}) as Partial<PushData> & Record<string, unknown>;
      const key =
        incomingAlertDedupeKeyFromPushData(data) ??
        `push:${String(c.title ?? '')}:${String(c.body ?? '')}:${Date.now()}`;
      presentIncomingNotificationAlert(key, c.title ?? 'Notification', c.body ?? '');
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    return subscribeToIncomingNotificationRows(uid);
  }, [session?.user?.id]);

  return null;
}

export default function App() {
  const [navigationReady, setNavigationReady] = useState(false);
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const handledPushOpenId = useRef<string | null>(null);

  const openAppFromNotificationResponse = useCallback((response: Notifications.NotificationResponse) => {
    const id = response.notification.request.identifier;
    if (handledPushOpenId.current === id) return;
    handledPushOpenId.current = id;
    const data = (response.notification.request.content.data ?? {}) as Partial<PushData> & Record<string, unknown>;
    navigateFromPushData(data);
  }, []);

  useEffect(() => {
    getFullRoomDetails().catch((err) => console.warn('[getFullRoomDetails]', err));
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(openAppFromNotificationResponse);
    return () => sub.remove();
  }, [openAppFromNotificationResponse]);

  // Cold start: opening the app from a notification (iOS + Android) — listener alone is unreliable.
  useEffect(() => {
    if (!navigationReady || !lastNotificationResponse) return;
    openAppFromNotificationResponse(lastNotificationResponse);
    void Notifications.clearLastNotificationResponseAsync();
  }, [navigationReady, lastNotificationResponse, openAppFromNotificationResponse]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <NotificationExperience />
            <MessageModalProvider>
              <NavigationContainer ref={navigationRef} onReady={() => setNavigationReady(true)}>
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
