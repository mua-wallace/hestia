/**
 * Staff Type Definitions
 */

export interface StaffMember {
  id: string;
  name: string;
  department: string; // "HSK", "F&B", etc.
  avatar?: any;
  initials?: string; // First letter of name if no avatar
  workload: number; // Current workload (e.g., 200)
  maxWorkload?: number; // Max capacity (default: 200)
  onShift: boolean;
  shift?: 'AM' | 'PM'; // Which shift they're on
}

export type ReassignTab = 'OnShift' | 'AM' | 'PM';

