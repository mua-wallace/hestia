export type LostAndFoundTab = 'created' | 'stored' | 'returned' | 'discarded';

export type LostAndFoundStatus = 'stored' | 'shipped' | 'returned' | 'discarded';

export interface LostAndFoundItem {
  id: string;
  itemName: string;
  itemId: string; // e.g., "FH31390"
  location: string; // e.g., "Room 201", "Brasserie"
  guestName?: string; // e.g., "Mr Mohamed. B"
  publicArea?: string; // e.g., "Public Area"
  roomNumber?: number; // e.g., 11
  storedLocation: string; // e.g., "HSK Office"
  registeredBy: {
    name: string;
    avatar?: any; // Image source
    timestamp: string; // e.g., "15:00, 11 November 2025"
  };
  image?: any; // Image source
  status: LostAndFoundStatus;
  createdAt: string; // ISO date string for filtering
  storedAt?: string; // ISO date string
  returnedAt?: string; // ISO date string
  discardedAt?: string; // ISO date string
}

