/**
 * Data service layer
 * Handles mock data and will be replaced with real API calls
 */

import { mockHomeData } from '../data/mockHomeData';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { mockChatData } from '../data/mockChatData';
import { mockTicketsData } from '../data/mockTicketsData';
import type { HomeScreenData } from '../types/home.types';
import type { AllRoomsScreenData } from '../types/allRooms.types';
import type { TicketsScreenData } from '../types/tickets.types';
import type { ChatItemData } from '../components/chat/ChatItem';

class DataService {
  /**
   * Get home screen data
   */
  async getHomeData(): Promise<HomeScreenData> {
    // TODO: Replace with actual API call
    return Promise.resolve(mockHomeData);
  }

  /**
   * Get all rooms data
   */
  async getAllRoomsData(): Promise<AllRoomsScreenData> {
    // TODO: Replace with actual API call
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

