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

export type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: { openRegisterModal?: boolean } | undefined;
  Staff: undefined;
  Settings: undefined;
};

