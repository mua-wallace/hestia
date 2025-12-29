/**
 * Navigation type definitions
 * Centralized navigation types for type safety
 */

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  AllRooms: { showBackButton?: boolean };
  RoomDetails: { roomId: string };
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
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

