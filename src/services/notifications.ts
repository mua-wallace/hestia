import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type PushData =
  | { type: 'chat_message'; chatId: string; messageId?: string }
  | { type: 'ticket_tag'; ticketId: string; roomId?: string | null }
  | { type: 'room_assignment'; roomId: string; shiftId?: string };

export function configureForegroundNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Registers for push notifications and persists the Expo push token to Supabase.
 * No-ops on simulators and when Supabase is not configured.
 */
export async function registerAndSyncPushToken(): Promise<{ token: string | null }> {
  if (!isSupabaseConfigured) return { token: null };
  configureForegroundNotifications();
  await ensureAndroidChannel();

  if (!Device.isDevice) {
    // Expo push tokens aren't available on iOS simulators; devs should test on device.
    return { token: null };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const finalStatus =
    existingStatus === 'granted'
      ? 'granted'
      : (await Notifications.requestPermissionsAsync()).status;

  if (finalStatus !== 'granted') return { token: null };

  const projectId =
    // EAS project id for Expo push tokens (SDK 49+).
    (Constants.expoConfig?.extra?.eas?.projectId as string | undefined) ??
    (Constants.easConfig?.projectId as string | undefined);

  const tokenResponse = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
  const token = tokenResponse.data;
  if (!token) return { token: null };

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id ?? null;
  if (!userId) return { token: null };

  // Upsert by token uniqueness (unique(expo_push_token)), and keep user_id updated.
  const device_os = Platform.OS;
  const device_name = Device.deviceName ?? null;

  // IMPORTANT: `.update(...).eq(...)` does NOT error when 0 rows match, so
  // "update then insert on error" will silently skip inserts.
  const upsert = await supabase.from('user_push_tokens').upsert(
    {
      user_id: userId,
      expo_push_token: token,
      device_os,
      device_name,
    },
    { onConflict: 'expo_push_token' },
  );
  if (upsert.error) {
    // Don't crash the app if token sync fails.
    console.warn('[push] Failed to persist push token', upsert.error.message, upsert.error.code);
  }

  return { token };
}

export async function notifyServer(payload: { type: 'chat_message'; messageId: string } | { type: 'ticket_tag'; ticketId: string; taggedUserIds: string[] } | { type: 'room_assignment'; roomId: string; shiftId: string; assignedUserId: string }) {
  if (!isSupabaseConfigured) return;
  try {
    // If the function is configured with `verify_jwt = false`, it can accept
    // requests without a session; still pass the JWT when available.
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? null;

    const res = await supabase.functions.invoke('notify', {
      body: payload,
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (res.error) {
      const ctx = (res.error as any)?.context as any;
      let responseBody: string | undefined;
      try {
        const r = ctx?.response;
        if (r && typeof r.text === 'function') {
          responseBody = await r.text();
        } else if (r && r._bodyInit && typeof r._bodyInit === 'string') {
          responseBody = r._bodyInit;
        }
      } catch {
        // ignore
      }
      console.warn(
        '[notifyServer] error',
        res.error.message,
        res.error.name,
        ctx?.status ?? (ctx?.response?.status as number | undefined),
        responseBody
      );
    }
  } catch (e) {
    console.warn('[notifyServer] failed', e);
  }
}

