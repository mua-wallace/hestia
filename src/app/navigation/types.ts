/**
 * Navigation type definitions
 * Centralized navigation types for type safety
 */

import type { RoomType } from '../../types/roomDetail.types';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  UserProfile: { user: import('../../types/home.types').UserProfile };
  AllRooms: { showBackButton?: boolean };
  RoomDetails: { roomId: string };
  RoomDetail: { room: any; roomType: RoomType };
  ArrivalDepartureDetail: { room: any };
  ChatDetail: { chatId: string; chat?: import('../../components/chat/ChatItem').ChatItemData };
  NewChat: undefined;
  CreateChatGroup: undefined;
  TicketDetail: { ticketId: string };
  CreateTicket: undefined;
  CreateTicketForm: { departmentId: string; departmentName?: string };
};

/** Tab/screen to return to when back is pressed */
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
