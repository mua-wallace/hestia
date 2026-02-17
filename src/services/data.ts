/**
 * Data service layer
 * Uses Supabase when configured, otherwise mock data
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
import { fetchAllRoomsFromSupabase } from './allRooms';
import { getShiftFromTime } from '../utils/shiftUtils';

class DataService {
  /**
   * Get home screen data
   */
  async getHomeData(): Promise<HomeScreenData> {
    // TODO: Replace with actual API call when home data is in Supabase
    return Promise.resolve(mockHomeData);
  }

  /**
   * Get all rooms data from Supabase (rooms, reservations, guests) or mock
   */
  async getAllRoomsData(shift?: 'AM' | 'PM'): Promise<AllRoomsScreenData> {
    if (isSupabaseConfigured) {
      try {
        const currentShift = shift ?? getShiftFromTime();
        const data = await fetchAllRoomsFromSupabase(currentShift);
        return data;
      } catch (e) {
        console.warn('Supabase getAllRooms failed, using mock:', e);
        return Promise.resolve(mockAllRoomsData);
      }
    }
    return Promise.resolve(mockAllRoomsData);
  }

  /**
   * Get chat data
   */
  async getChatData(): Promise<ChatItemData[]> {
    // TODO: Replace with actual API call
    return Promise.resolve(mockChatData);
  }

  /**
   * Get tickets data
   */
  async getTicketsData(): Promise<TicketsScreenData> {
    // TODO: Replace with actual API call
    return Promise.resolve(mockTicketsData);
  }
}

export const dataService = new DataService();

