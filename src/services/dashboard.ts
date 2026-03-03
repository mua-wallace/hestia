/**
 * Dashboard / screen data (Supabase + mock fallback)
 * Aggregates data for home, rooms, chat, tickets. Rooms come from Supabase via rooms service.
 */

import { mockHomeData } from '../data/mockHomeData';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { mockTicketsData } from '../data/mockTicketsData';
import type { HomeScreenData } from '../types/home.types';
import type { AllRoomsScreenData } from '../types/allRooms.types';
import type { TicketsScreenData } from '../types/tickets.types';
import type { ChatItemData } from '../components/chat/ChatItem';
import { isSupabaseConfigured } from '../lib/supabase';
import { fetchAllRooms, updateRoom, assignRoomToStaff as roomsAssignRoomToStaff, type RoomStateUpdate } from './rooms';
import type { StaffInfo } from '../types/allRooms.types';
import { mockStaffData } from '../data/mockStaffData';
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

  /**
   * Assign a room to a staff member for the current shift.
   * When Supabase is configured and userId is a valid UUID, persists to room_assignments and returns StaffInfo.
   * When using mock staff (non-UUID ids), returns StaffInfo from mock data for local-only update.
   */
  async assignRoomToStaff(roomId: string, userId: string, shift: 'AM' | 'PM'): Promise<StaffInfo | null> {
    const staffMember = mockStaffData.find((s) => s.id === userId);
    const mockStaffInfo: StaffInfo | null = staffMember
      ? {
          name: staffMember.name,
          initials: staffMember.initials ?? staffMember.name.charAt(0).toUpperCase(),
          avatar: staffMember.avatar,
          statusText: 'Not Started',
          statusColor: '#1e1e1e',
        }
      : null;

    if (isSupabaseConfigured && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      try {
        const info = await roomsAssignRoomToStaff(roomId, userId, shift);
        return info ?? mockStaffInfo;
      } catch (e) {
        console.warn('Assign room failed, using local update:', e);
        return mockStaffInfo;
      }
    }
    return mockStaffInfo;
  },

  async getChatData(): Promise<ChatItemData[]> {
    return Promise.resolve([]);
  },

  async getTicketsData(): Promise<TicketsScreenData> {
    return Promise.resolve(mockTicketsData);
  },
};

export const dashboardService = dashboard;
