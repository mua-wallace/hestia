export type MoreMenuItemId = 'lostAndFound' | 'staff' | 'settings';

export interface MoreMenuOption {
  id: MoreMenuItemId;
  label: string;
  icon: any;
  iconWidth: number;
  iconHeight: number;
  navigationTarget: 'LostAndFound' | 'Staff' | 'Settings';
}

export const MORE_MENU_OPTIONS: MoreMenuOption[] = [
  {
    id: 'lostAndFound',
    label: 'Lost & Found',
    icon: require('../../assets/icons/lost-found-icon.png'),
    iconWidth: 44,
    iconHeight: 48,
    navigationTarget: 'LostAndFound',
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: require('../../assets/icons/staff-icon.png'),
    iconWidth: 36,
    iconHeight: 32,
    navigationTarget: 'Staff',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: require('../../assets/icons/settings-icon.png'),
    iconWidth: 36,
    iconHeight: 39,
    navigationTarget: 'Settings',
  },
];

