/**
 * Navigation type definitions
 * Centralized navigation types for type safety
 */

import type { RoomType } from '../types/roomDetail.types';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  AllRooms: { showBackButton?: boolean };
  RoomDetails: { roomId: string };
  RoomDetail: { room: any; roomType: RoomType }; // New reusable room detail screen
  ArrivalDepartureDetail: { room: any }; // RoomCardData - DEPRECATED: Use RoomDetail instead
  ChatDetail: { chatId: string };
  TicketDetail: { ticketId: string };
  CreateTicket: undefined;
  CreateTicketForm: { departmentId: string };
};

/** Tab/screen to return to when back is pressed (e.g. from Settings/Staff/LostAndFound). */
export type ReturnToTab = 'Home' | 'Rooms' | 'Chat' | 'Tickets' | 'LostAndFound' | 'Staff' | 'Settings';

export type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: { openRegisterModal?: boolean; returnToTab?: ReturnToTab } | undefined;
  Staff: { returnToTab?: ReturnToTab } | undefined;
  Settings: { returnToTab?: ReturnToTab } | undefined;
};

