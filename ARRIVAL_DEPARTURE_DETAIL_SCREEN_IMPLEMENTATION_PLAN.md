# Arrival/Departure Detail Screen - Implementation Plan

## Overview
Implement a detail screen that displays comprehensive information about an Arrival/Departure room when users click on an Arrival/Departure card. The screen includes guest information, special instructions, notes, lost and found, and assignment details, with tab navigation for different views.

## Design Analysis

### Visual Structure

#### 1. Header Section (Yellow Background)
- **Background**: Yellow (#f0be1b) - height: 232px
- **Back Arrow**: Left side, top: 69px, left: 26px
- **Room Number**: "Room 201" - Bold, 24px, white, centered
- **Room Code**: "ST2K-1.4" - Light, 17px, white, below room number
- **Status Indicator**: 
  - "In Progress" text with icon
  - White text, 18px, bold
  - Dropdown arrow icon (right side)
  - Position: left: 131px, top: 176px
- **Profile Picture**: Top right, size: 54x54px, position: left: 352px, top: 56px

#### 2. Tab Navigation
- **Tabs**: "Overview", "Tickets", "Checklist", "History"
- **Active Tab**: "Overview" - Bold, 16px, #5a759d, with blue underline (4px height)
- **Inactive Tabs**: Light, 16px, #5a759d
- **Underline**: Blue (#5a759d), height: 4px, width: 92px, left: 15px, top: 281px
- **Position**: Below header, top: 252px

#### 3. Content Area (White Background)
Starts below tabs at y=285px

##### A. Guest Info Section
- **Title**: "Guest Info" - Bold, 15px, black, top: 303px
- **Divider**: Horizontal line, color: #c6c5c5, top: 510px

**Arrival Guest Entry:**
- **Icon**: Green arrow pointing left (arrival icon), left: 21px
- **Name**: "Mr Mohamed. B" - Bold, 14px, black, left: 77px, top: 349px
- **Number Badge**: "11" - Light, 12px, #334866, left: 189px, top: 350px
- **Dates**: "07/10-15/10" - Light, 14px, black, left: 79px, top: 377px
- **Occupancy**: Person icon with "2/2" - Light, 14px, black, left: 183px, top: 378px
- **ETA**: "ETA: 17:00" - Regular, 14px, black, left: 215px, top: 377px
- **Special Instructions**:
  - Title: "Special Instructions" - Bold, 13px, black, top: 417px
  - Text: Long paragraph - Light, 13px, black, top: 442px, width: 392px

**Departure Guest Entry:**
- **Icon**: Red arrow pointing right (departure icon), left: 21px
- **Name**: "Mr Felix. K" - Bold, 14px, black, left: 77px, top: 542px
- **Number Badge**: "22" - Light, 12px, #334866, left: 157px, top: 543px
- **Dates**: "07/10-15/10" - Light, 14px, black, left: 78px, top: 568px
- **Occupancy**: Person icon with "2/2" - Light, 14px, black, left: 182px, top: 566px
- **EDT**: "EDT: 12:00" - Regular, 14px, black, left: 222px, top: 567px
- **Divider**: Horizontal line, top: 625px

##### B. Notes Section
- **Title**: "Notes" with pencil icon and badge "2" - Bold, 18px, black, top: 652px
- **Add Button**: Border button, "Add" text - Light, 14px, black, right side, top: 657px
- **Note Items**:
  - Each note has:
    - Note text (Light, 13px, black)
    - Profile picture (25x25px)
    - Staff name (Regular, 11px, black)
  - **Note 1**: top: 711px
  - **Note 2**: top: 813px
- **Divider**: Horizontal line, top: 1171px

##### C. Lost and Found Section
- **Title**: "Lost and Found" - Bold, 15px, black, top: 934px
- **Add Photos Box**:
  - Dashed border rectangle
  - Border: #cbc7c7, dashed style
  - Border radius: 7px
  - Size: 384x180px
  - Icon: Box with items spilling out
  - Text: "Add Photos" - #5a759d, 19px, bold
  - Plus icon: "+" - #5a759d, 42px
  - Position: top: 973px

##### D. Assigned to Section
- **Title**: "Assigned to" - Bold, 15px, black, top: 1190px
- **Staff Info**:
  - Profile picture: 35x35px, left: 31px, top: 1239px
  - Name: "Etleva Hoxha" - Bold, 13px, #1e1e1e, left: 85px, top: 1240px
- **Reassign Button**:
  - Background: #f1f6fc
  - Border radius: 41px
  - Text: "Reassign" - Regular, 18px, #5a759d
  - Size: 122x49px
  - Position: left: 291px, top: 1231px

#### 4. Urgent Badge
- **Text**: "Urgent" - Bold, 13px, white
- **Position**: left: 376px, top: 870px
- **Background**: Likely red or priority color

### Component Structure

```
ArrivalDepartureDetailScreen
├── Header (Yellow Background)
│   ├── BackButton
│   ├── RoomNumber
│   ├── RoomCode
│   ├── StatusIndicator (with dropdown)
│   └── ProfilePicture
├── TabNavigation
│   ├── Overview (active)
│   ├── Tickets
│   ├── Checklist
│   └── History
├── ContentArea (ScrollView)
│   ├── GuestInfoSection
│   │   ├── ArrivalGuestCard
│   │   │   ├── ArrivalIcon
│   │   │   ├── GuestName
│   │   │   ├── NumberBadge
│   │   │   ├── Dates
│   │   │   ├── Occupancy
│   │   │   ├── ETA
│   │   │   └── SpecialInstructions
│   │   └── DepartureGuestCard
│   │       ├── DepartureIcon
│   │       ├── GuestName
│   │       ├── NumberBadge
│   │       ├── Dates
│   │       ├── Occupancy
│   │       └── EDT
│   ├── NotesSection
│   │   ├── SectionHeader (with badge)
│   │   ├── AddButton
│   │   └── NoteList
│   │       └── NoteItem[]
│   │           ├── NoteText
│   │           ├── ProfilePicture
│   │           └── StaffName
│   ├── LostAndFoundSection
│   │   ├── SectionTitle
│   │   └── AddPhotosBox
│   │       ├── Icon
│   │       ├── PlusIcon
│   │       └── AddPhotosText
│   └── AssignedToSection
│       ├── SectionTitle
│       ├── StaffInfo
│       │   ├── ProfilePicture
│       │   └── StaffName
│       └── ReassignButton
```

## Implementation Steps

### Step 1: Create Type Definitions
**File**: `src/types/roomDetail.types.ts`

```typescript
export interface GuestInfo {
  id: string;
  name: string;
  number: string; // Guest number badge
  dates: string; // Check-in/out dates
  occupancy: {
    current: number;
    total: number;
  };
  eta?: string; // Estimated Time of Arrival
  edt?: string; // Estimated Departure Time
  specialInstructions?: string;
}

export interface Note {
  id: string;
  text: string;
  staff: {
    name: string;
    avatar: any;
  };
  createdAt: string;
}

export interface RoomDetailData {
  roomNumber: string;
  roomCode: string;
  status: 'Dirty' | 'InProgress' | 'Cleaned' | 'Inspected';
  arrivalGuest?: GuestInfo;
  departureGuest?: GuestInfo;
  notes: Note[];
  assignedTo?: {
    id: string;
    name: string;
    avatar: any;
  };
  isUrgent?: boolean;
}

export type DetailTab = 'Overview' | 'Tickets' | 'Checklist' | 'History';
```

### Step 2: Create Detail Screen Component
**File**: `src/screens/ArrivalDepartureDetailScreen.tsx`

**Features**:
- Full-screen detail view
- Yellow header with room info
- Tab navigation
- Scrollable content area
- Multiple sections (Guest Info, Notes, Lost & Found, Assigned To)
- Handle tab switching
- Handle status change
- Handle note addition
- Handle reassignment

**Props**:
```typescript
interface ArrivalDepartureDetailScreenProps {
  route: {
    params: {
      room: RoomCardData;
    };
  };
  navigation: any;
}
```

### Step 3: Create Header Component
**File**: `src/components/roomDetail/RoomDetailHeader.tsx`

**Features**:
- Yellow background
- Back button
- Room number and code
- Status indicator with dropdown
- Profile picture

### Step 4: Create Tab Navigation Component
**File**: `src/components/roomDetail/DetailTabNavigation.tsx`

**Features**:
- Four tabs: Overview, Tickets, Checklist, History
- Active tab indicator (blue underline)
- Tab switching functionality

### Step 5: Create Guest Info Component
**File**: `src/components/roomDetail/GuestInfoCard.tsx`

**Features**:
- Arrival or Departure icon
- Guest name with number badge
- Dates, occupancy, ETA/EDT
- Special instructions (for arrival)

### Step 6: Create Notes Section Component
**File**: `src/components/roomDetail/NotesSection.tsx`

**Features**:
- Section header with badge count
- Add button
- List of notes
- Note item with text, profile, and name

### Step 7: Create Lost and Found Component
**File**: `src/components/roomDetail/LostAndFoundSection.tsx`

**Features**:
- Section title
- Dashed border box
- Add photos functionality
- Icon and text

### Step 8: Create Assigned To Component
**File**: `src/components/roomDetail/AssignedToSection.tsx`

**Features**:
- Section title
- Staff profile and name
- Reassign button

### Step 9: Create Style Constants
**File**: `src/constants/roomDetailStyles.ts`

**Contains**:
- Header dimensions and colors
- Tab navigation styles
- Guest info card styles
- Notes section styles
- Lost and found styles
- Assigned to styles
- All positioning constants

### Step 10: Navigation Integration
**File**: `src/navigation/AppNavigator.tsx`

**Changes**:
- Add `ArrivalDepartureDetail` to navigation stack
- Add route params type

**File**: `src/navigation/types.ts`

**Changes**:
- Add `ArrivalDepartureDetail` to `RootStackParamList`

### Step 11: Integrate with AllRoomsScreen
**File**: `src/screens/AllRoomsScreen.tsx`

**Changes**:
- Update `handleRoomPress` to navigate to detail screen
- Pass room data as route params

## Technical Details

### Positioning Strategy
- All positions are absolute, relative to screen (0,0)
- Header: height 232px, yellow background
- Tabs: start at y=252px
- Content: starts at y=285px, scrollable
- Use `scaleX` for responsive scaling (design width: 440px)

### Colors
- **Header Background**: #f0be1b (yellow)
- **Text (Header)**: White
- **Active Tab**: #5a759d (blue)
- **Tab Underline**: #5a759d (blue)
- **Content Background**: White
- **Text (Content)**: Black (#000000, #1e1e1e)
- **Secondary Text**: #334866, #5a759d
- **Borders**: #c6c5c5, #cbc7c7
- **Button Background**: #f1f6fc

### Typography
- **Room Number**: Helvetica Bold, 24px
- **Room Code**: Helvetica Light, 17px
- **Status**: Helvetica Bold, 18px
- **Tab Labels**: Helvetica Bold/Light, 16px
- **Section Titles**: Helvetica Bold, 15px
- **Guest Names**: Helvetica Bold, 14px
- **Note Text**: Helvetica Light, 13px
- **Staff Names**: Helvetica Regular, 11px

### Icons Required
- Back arrow icon
- Arrival icon (green arrow left)
- Departure icon (red arrow right)
- Person/occupancy icon
- Pencil icon (for notes)
- Status indicator icon
- Dropdown arrow icon
- Lost and found box icon
- Profile/avatar images

### State Management

```typescript
const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
const [roomDetail, setRoomDetail] = useState<RoomDetailData | null>(null);
const [showStatusDropdown, setShowStatusDropdown] = useState(false);
```

## File Structure

```
src/
├── screens/
│   └── ArrivalDepartureDetailScreen.tsx
├── components/
│   └── roomDetail/
│       ├── RoomDetailHeader.tsx
│       ├── DetailTabNavigation.tsx
│       ├── GuestInfoCard.tsx
│       ├── NotesSection.tsx
│       ├── NoteItem.tsx
│       ├── LostAndFoundSection.tsx
│       └── AssignedToSection.tsx
├── types/
│   └── roomDetail.types.ts
└── constants/
    └── roomDetailStyles.ts
```

## Implementation Order

1. Create type definitions
2. Create style constants
3. Create RoomDetailHeader component
4. Create DetailTabNavigation component
5. Create GuestInfoCard component
6. Create NotesSection and NoteItem components
7. Create LostAndFoundSection component
8. Create AssignedToSection component
9. Create main ArrivalDepartureDetailScreen component
10. Add navigation route
11. Integrate with AllRoomsScreen
12. Test navigation and data flow

## Key Features to Implement

1. **Header**
   - Yellow background with room info
   - Status indicator with dropdown
   - Back navigation

2. **Tab Navigation**
   - Four tabs with active state
   - Blue underline for active tab
   - Tab switching (initially only Overview tab has content)

3. **Guest Info**
   - Display arrival and departure guests
   - Show dates, occupancy, ETA/EDT
   - Special instructions for arrival

4. **Notes**
   - Display list of notes
   - Show staff info for each note
   - Add note functionality (future)

5. **Lost and Found**
   - Dashed border box
   - Add photos functionality (future)

6. **Assigned To**
   - Display assigned staff
   - Reassign button functionality (future)

## Testing Checklist

- [ ] Screen opens when clicking Arrival/Departure card
- [ ] Room data displays correctly
- [ ] Back button navigates correctly
- [ ] Tabs switch correctly
- [ ] Guest info displays for both arrival and departure
- [ ] Notes display correctly
- [ ] Lost and found section displays
- [ ] Assigned to section displays
- [ ] Status dropdown works (future)
- [ ] All positions match Figma design
- [ ] Responsive scaling works
- [ ] Scrollable content works

## Future Enhancements

1. **Tab Content**
   - Implement Tickets tab content
   - Implement Checklist tab content
   - Implement History tab content

2. **Interactions**
   - Status change functionality
   - Add note functionality
   - Edit note functionality
   - Add photos to Lost and Found
   - Reassign staff functionality

3. **Data Integration**
   - Connect to backend API
   - Real-time updates
   - Photo upload functionality



