/**
 * Dashboard / screen data (Supabase + mock fallback)
 * Aggregates data for home, rooms, chat, tickets. Rooms come from Supabase via rooms service.
 */

import { mockHomeData } from '../data/mockHomeData';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { mockChatData } from '../data/mockChatData';
import { mockTicketsData } from '../data/mockTicketsData';
import type { HomeScreenData } from '../types/home.types';
import type { AllRoomsScreenData } from '../types/allRooms.types';
import type { TicketsScreenData } from '../types/tickets.types';
import type { ChatItemData } from '../components/chat/ChatItem';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchAllRooms, updateRoom, type RoomStateUpdate } from './rooms';
import { getShiftFromTime } from '../utils/shiftUtils';

export type { RoomStateUpdate } from './rooms';

const dashboard = {
  async getHomeData(): Promise<HomeScreenData> {
    return Promise.resolve(mockHomeData);
  },

  async getAllRoomsData(shift?: 'AM' | 'PM'): Promise<AllRoomsScreenData> {
    if (isSupabaseConfigured) {
      try {
        const currentShift = shift ?? getShiftFromTime();
        return await fetchAllRooms(currentShift);
      } catch (e) {
        console.warn('Supabase rooms failed, using mock:', e);
        return Promise.resolve(mockAllRoomsData);
      }
    }
    return Promise.resolve(mockAllRoomsData);
  },

  async updateRoomState(roomId: string, updates: RoomStateUpdate): Promise<void> {
    if (!isSupabaseConfigured) return;
    await updateRoom(roomId, updates);
  },

  async getChatData(): Promise<ChatItemData[]> {
    return Promise.resolve(mockChatData);
  },

  async getTicketsData(): Promise<TicketsScreenData> {
    return Promise.resolve(mockTicketsData);
  },
};

export const dashboardService = dashboard;
