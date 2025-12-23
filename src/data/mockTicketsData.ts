import { TicketsScreenData } from '../types/tickets.types';

export const mockTicketsData: TicketsScreenData = {
  selectedTab: 'myTickets',
  tickets: [
    {
      id: 'ticket-1',
      title: 'TV not working',
      description: 'Guess could not connect the TV with chrome cast, kindly assist',
      roomNumber: '201',
      dueTime: '10 mins',
      createdBy: {
        name: 'Stella Kitou',
        avatar: require('../../assets/icons/home/profile-avatar.png'),
      },
      status: 'unsolved',
      locationIcon: require('../../assets/icons/home/menu-icon.png'), // Placeholder for location pin icon
    },
    {
      id: 'ticket-2',
      title: 'Deliver Laundry',
      description: 'Guest wants his laundry back',
      roomNumber: '301',
      category: 'Laundry',
      categoryIcon: require('../../assets/icons/tickets/laundry-icon.png'),
      createdBy: {
        name: 'Stella Kitou',
        avatar: require('../../assets/icons/home/profile-avatar.png'),
      },
      status: 'done',
      locationIcon: require('../../assets/icons/home/menu-icon.png'), // Placeholder for location pin icon
    },
  ],
};

