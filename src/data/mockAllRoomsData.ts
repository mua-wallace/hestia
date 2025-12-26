import { AllRoomsScreenData, RoomCardData } from '../types/allRooms.types';

export const mockAllRoomsData: AllRoomsScreenData = {
  selectedShift: 'AM',
  rooms: [
    {
      id: 'room-201',
      roomNumber: '201',
      roomType: 'ST2K - 1.4',
      category: 'Arrival/Departure',
      status: 'InProgress',
      isPriority: true,
      priorityCount: 11, // First guest has 11
      guests: [
        {
          name: 'Mr Mohamed. B',
          dateRange: '07/10-15/10',
          time: '17:00',
          timeLabel: 'ETA',
          guestCount: '2/2',
        },
        {
          name: 'Mr Felix. K',
          dateRange: '07/10-15/10',
          time: '12:00',
          timeLabel: 'EDT',
          guestCount: '2/2',
        },
      ],
      staff: {
        avatar: require('../../assets/icons/profile-avatar.png'),
        name: 'Etleva Hoxha',
        statusText: 'Started: 40 mins',
        statusColor: '#1e1e1e',
      },
      notes: {
        count: 3,
        hasRushed: true,
      },
      secondGuestPriorityCount: 22, // Second guest has 22
    },
    {
      id: 'room-202',
      roomNumber: '202',
      roomType: 'ST2K - 1.4',
      category: 'Departure',
      status: 'Dirty',
      isPriority: false,
      guests: [
        {
          name: 'Mr Mohamed. B',
          dateRange: '07/10-15/10',
          time: '12:00',
          timeLabel: 'EDT', // Departure cards should have EDT, not ETA
          guestCount: '2/2',
        },
      ],
      staff: {
        initials: 'Z',
        name: 'Zoe Tsakeri',
        statusText: 'Not Started',
        statusColor: '#1e1e1e',
        promiseTime: 'Promise time: 18:00',
      },
    },
    {
      id: 'room-203',
      roomNumber: '203',
      roomType: 'ST2K - 1.4',
      category: 'Arrival',
      status: 'Cleaned',
      isPriority: false,
      priorityCount: 11,
      guests: [
        {
          name: 'Mr Mohamed. B',
          dateRange: '07/10-15/10',
          time: '17:00',
          timeLabel: 'ETA',
          guestCount: '2/2',
        },
      ],
      staff: {
        avatar: require('../../assets/icons/profile-avatar.png'),
        name: 'Yenchai Moliao',
        statusText: 'Finished: 60 mins',
        statusColor: '#41d541',
      },
      notes: {
        count: 3,
        hasRushed: false,
      },
    },
    {
      id: 'room-204',
      roomNumber: '204',
      roomType: 'ST2K - 1.4',
      category: 'Arrival',
      status: 'Inspected',
      isPriority: false,
      guests: [
        {
          name: 'Mr Mohamed. B',
          dateRange: '07/10-15/10',
          time: '17:00',
          timeLabel: 'ETA',
          guestCount: '2/2',
        },
      ],
      staff: {
        avatar: require('../../assets/icons/profile-avatar.png'),
        name: 'Yenchai Moliao',
        statusText: 'Finished: 65 mins',
        statusColor: '#f92424',
      },
    },
    {
      id: 'room-205',
      roomNumber: '205',
      roomType: 'ST2K - 1.4',
      category: 'Stayover',
      status: 'Inspected',
      isPriority: false,
      guests: [
        {
          name: 'Mr Mohamed. B',
          dateRange: '07/10-15/10',
          time: '17:00',
          timeLabel: 'ETA',
          guestCount: '2/2',
        },
      ],
      staff: {
        avatar: require('../../assets/icons/profile-avatar.png'),
        name: 'Yenchai Moliao',
        statusText: 'Finished: 65 mins',
        statusColor: '#f92424',
      },
    },
    {
      id: 'room-206',
      roomNumber: '205',
      roomType: 'ST2K - 1.4',
      category: 'Turndown',
      status: 'Inspected',
      isPriority: false,
      guests: [
        {
          name: 'Mr Mohamed. B',
          dateRange: '07/10-15/10',
          time: '17:00',
          timeLabel: 'ETA',
          guestCount: '2/2',
        },
      ],
      staff: {
        avatar: require('../../assets/icons/profile-avatar.png'),
        name: 'Yenchai Moliao',
        statusText: 'Finished: 65 mins',
        statusColor: '#f92424',
      },
    },
  ],
};

