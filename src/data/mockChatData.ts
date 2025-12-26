import { ChatItemData } from '../components/chat/ChatItem';

export const mockChatData: ChatItemData[] = [
  {
    id: 'chat-1',
    name: 'House keeping Minions',
    lastMessage: 'I just checked the room',
    lastMessageSender: 'Zoe:',
    unreadCount: 11,
    avatar: require('../../assets/icons/profile-avatar.png'),
    isGroup: true,
  },
  {
    id: 'chat-2',
    name: 'Etleva Hoxha',
    lastMessage: 'Hello Stella',
    unreadCount: 1,
    avatar: require('../../assets/icons/profile-avatar.png'),
    isGroup: false,
  },
];

