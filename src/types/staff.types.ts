export type StaffTab = 'onShift' | 'am' | 'pm' | 'departments';

export interface StaffMember {
  id: string;
  name: string;
  avatar?: any; // Image source
  initials?: string; // Single letter for avatar
  avatarColor?: string; // Background color for initial circle
  progressRatio: {
    completed: number;
    total: number;
  };
  taskStats: {
    inProgress: number;
    cleaned: number;
    dirty: number;
  };
  currentTask?: {
    roomNumber: string;
    timer: string; // Format: "00:50:23"
    isActive: boolean; // If true, timer is red; if false, black
  };
}

export interface StaffScreenData {
  date: string; // Format: "Mon 23 Feb 2025"
  staffMembers: StaffMember[];
}
