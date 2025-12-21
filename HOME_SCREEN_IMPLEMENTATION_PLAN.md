# Home Screen Implementation Plan

## Design Analysis - Figma Node: 664:268

### Screen Overview
The Home Screen is a dashboard showing room status overview for housekeeping staff with real-time statistics and navigation.

---

## 1. Layout Structure

```
┌─────────────────────────────────┐
│  Header (178px)                 │
│  - Profile & User Info          │
│  - AM/PM Toggle                 │
│  - Date & Overview Title        │
│  - Search Bar                   │
├─────────────────────────────────┤
│  Content (Scrollable)           │
│  ┌─────────────────────────┐   │
│  │ Flagged Section (223px) │   │
│  │ - Purple left border    │   │
│  │ - 4 Status indicators   │   │
│  │ - Priority badge        │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Arrivals Section        │   │
│  │ - Green left border     │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ StayOvers Section       │   │
│  │ - Gray left border      │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  Bottom Navigation (152px)      │
│  - 5 Tab Items              │
└─────────────────────────────────┘
```

---

## 2. Component Breakdown

### A. Header Component (Height: 178px)
**Position:** Top fixed, white background with shadow

#### Components:
1. **Profile Section** (x: 22, y: 110)
   - Profile image: 51×51px circle
   - Name: "Stella Kitou" (17px, Light)
   - Role: "Executive Housekeeper" (14px, Regular)
   - Flag icon (30.708×30.708px) - overlaid on bottom-right of profile

2. **AM/PM Toggle** (x: 247, y: 118)
   - Container: 121×35.243px, rounded-[68px], bg: #f1f6fc
   - Active button: 64.612×30.544px, bg: #5a759d
   - Buttons: "AM" (white, bold), "PM" (gray, light)

3. **Overview Today** (x: 21, y: 194)
   - Title: "Overview Today" (18px, Light)
   - Date: "Mon 23 Feb 2025" (11px, Semi-Bold)

4. **Bell Icon** (Top-right, notification indicator)

5. **Search Bar** (x: 15, y: 252)
   - Container: 347×59px, rounded-[82px], bg: #f1f6fc
   - Placeholder: "Search Rooms, Guests, Floors etc" (13px)
   - Search icon (left)
   - Menu icon (right) - 3 horizontal lines

---

### B. Room Status Card Component (Reusable)
**Dimensions:** 422×223px, rounded-[12px]
**Background:** rgba(238,240,246,0.35)

#### Structure:
1. **Left Border** (5px wide, full height, colored by category)
   - Flagged: #6e1eee (purple)
   - Arrivals: #41d541 (green)
   - StayOvers: #8d908d (gray)

2. **Header Row**
   - Category name (20px, Bold) - left
   - Total count (24px, Bold) - next to name
   - Priority badge (if applicable) - right
     - Background: #ffebeb
     - Icon + "Priority" text (13px, Semi-Bold, #f92424)
     - Count (20px, Bold, #f92424)

3. **Status Indicators Grid** (4 items)
   Each indicator (50.017×50.017px):
   - **Dirty**: Red (#f92424) circle with icon
   - **In Progress**: Yellow (#f0be1b) circle with icon
   - **Cleaned**: Blue (#4a91fc) circle with icon
   - **Inspected**: Green (#41d541) circle with icon
   
   Each has:
   - Count badge (34×34px circle, overlaid bottom-right)
   - Label below (14px, Light)

---

### C. Bottom Navigation Component (Height: 152px)
**Position:** Fixed bottom
**Background:** White with top border (#e6e6e6) and shadow

#### Nav Items (5 total):
1. **Home** (x: 34, y: 43, 47×60px)
   - Icon: House icon (26.372×24.545px)
   - Label: "Home" (15px, Regular, #5a759d)

2. **Rooms** (x: 115, y: 43, 50.546×60px)
   - Icon: Room/bed icon
   - Label: "Rooms"

3. **Chat** (x: 205, y: 42, 43.138×61px)
   - Icon: Chat bubble
   - Badge: Red circle with "3" (20.455×20.455px, white text)
   - Label: "Chat"

4. **Tickets** (x: 290, y: 43, 52×60px)
   - Icon: Ticket icon
   - Label: "Tickets"

5. **More** (x: 374, y: 44, 40×57px)
   - Icon: Three horizontal lines
   - Label: "More"

---

## 3. Data Structure

```typescript
interface RoomStatus {
  dirty: number;
  inProgress: number;
  cleaned: number;
  inspected: number;
}

interface CategorySection {
  id: string;
  name: 'Flagged' | 'Arrivals' | 'StayOvers';
  total: number;
  priority?: number;
  borderColor: string;
  status: RoomStatus;
}

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  hasFlag: boolean;
}

interface HomeScreenData {
  user: UserProfile;
  selectedShift: 'AM' | 'PM';
  date: string;
  categories: CategorySection[];
  notifications: {
    chat: number;
  };
}
```

---

## 4. Assets Required

### Icons to Download/Create:
1. **Status Icons:**
   - `dirty-icon.png` - Red circular icon
   - `in-progress-icon.png` - Yellow circular icon
   - `cleaned-icon.png` - Blue checkmark icon
   - `inspected-icon.png` - Green checkmark icon

2. **Navigation Icons:**
   - `home-icon.png` - House icon
   - `rooms-icon.png` - Bed/room icon
   - `chat-icon.png` - Chat bubble
   - `tickets-icon.png` - Ticket icon
   - `more-icon.png` - Three lines menu

3. **Other Icons:**
   - `bell-icon.png` - Notification bell
   - `search-icon.png` - Search magnifier
   - `menu-icon.png` - Hamburger menu
   - `flag-icon.png` - Flag overlay on profile
   - `priority-icon.png` - Priority warning icon

4. **Images:**
   - Profile placeholder or avatar system

---

## 5. Component Files to Create

```
src/
├── screens/
│   └── HomeScreen.tsx          # Main screen component
├── components/
│   ├── home/
│   │   ├── HomeHeader.tsx      # Header with profile, toggle, search
│   │   ├── CategoryCard.tsx    # Reusable room status card
│   │   ├── StatusIndicator.tsx # Status circle with count
│   │   ├── PriorityBadge.tsx   # Priority indicator
│   │   └── AMPMToggle.tsx      # AM/PM switch component
│   └── navigation/
│       ├── BottomTabBar.tsx    # Bottom navigation
│       └── TabBarItem.tsx      # Individual tab item
├── types/
│   └── home.types.ts           # TypeScript interfaces
└── hooks/
    └── useHomeData.ts          # Data fetching hook
```

---

## 6. Styling Specifications

### Colors:
```typescript
{
  background: {
    primary: '#ffffff',
    card: 'rgba(238,240,246,0.35)',
    searchBar: '#f1f6fc',
    priorityBadge: '#ffebeb',
  },
  border: {
    flagged: '#6e1eee',
    arrivals: '#41d541',
    stayovers: '#8d908d',
    nav: '#e6e6e6',
  },
  status: {
    dirty: '#f92424',
    inProgress: '#f0be1b',
    cleaned: '#4a91fc',
    inspected: '#41d541',
  },
  toggle: {
    active: '#5a759d',
    inactive: '#f1f6fc',
  },
  text: {
    primary: '#1e1e1e',
    secondary: '#5a759d',
    priority: '#f92424',
    placeholder: 'rgba(0,0,0,0.36)',
  }
}
```

### Typography:
- **Category Title:** 20px, Bold, Helvetica
- **Total Count:** 24px, Bold, Helvetica
- **Labels:** 14px, Light, Inter
- **User Name:** 17px, Light, Helvetica
- **User Role:** 14px, Regular, Helvetica
- **Nav Labels:** 15px, Regular, Helvetica
- **Status Count:** 20px, Bold, Helvetica

### Spacing:
- Screen padding: 10px horizontal
- Card gap: 26px vertical
- Status indicators gap: 10-15px
- Header height: 178px
- Nav height: 152px
- Card height: 223px (Flagged), 208px (others)

---

## 7. Implementation Steps

### Phase 1: Setup (30 min)
1. Create component structure
2. Download/prepare all icons from Figma
3. Organize assets in `assets/icons/home/` and `assets/icons/navigation/`
4. Define TypeScript interfaces
5. Set up color constants in theme

### Phase 2: Bottom Navigation (1 hour)
1. Create `BottomTabBar.tsx` component
2. Create `TabBarItem.tsx` with icon + label
3. Add notification badge support (for Chat)
4. Implement navigation logic
5. Add active/inactive states
6. Test navigation flow

### Phase 3: Header Component (1.5 hours)
1. Create `HomeHeader.tsx`
2. Add profile section with avatar and info
3. Implement AM/PM toggle component
4. Add date display
5. Create search bar with icons
6. Add notification bell
7. Handle profile flag overlay

### Phase 4: Category Cards (2 hours)
1. Create `CategoryCard.tsx` reusable component
2. Implement colored left border logic
3. Add header with title, count, priority badge
4. Create `StatusIndicator.tsx` component
5. Add status grid layout
6. Implement count badges
7. Test with different data

### Phase 5: Main Screen Assembly (1 hour)
1. Create `HomeScreen.tsx`
2. Assemble header, cards, navigation
3. Add ScrollView for content
4. Implement data fetching hook
5. Handle loading/error states
6. Add pull-to-refresh

### Phase 6: Interactions & Polish (1 hour)
1. Add press handlers for all touchable elements
2. Implement AM/PM toggle functionality
3. Add search functionality
4. Smooth scroll animations
5. Test on different screen sizes
6. Fix any styling issues

### Phase 7: Data Integration (30 min)
1. Connect to API/state management
2. Implement real-time updates
3. Add data refresh logic
4. Handle empty states

---

## 8. Key Technical Considerations

### Responsive Design:
- Use scale factor based on design width (440px)
- Test on iPhone 16 Pro Max dimensions
- Ensure touch targets are at least 44×44px

### Performance:
- Memoize category cards
- Optimize re-renders
- Lazy load icons if needed

### Accessibility:
- Add proper labels for screen readers
- Ensure sufficient color contrast
- Make all interactive elements accessible

### State Management:
- Consider using Context or Redux for global state
- Cache data locally for offline support
- Implement optimistic updates

---

## 9. Testing Checklist

- [ ] Header displays correctly
- [ ] Profile info renders properly
- [ ] AM/PM toggle works
- [ ] Search bar is functional
- [ ] All category cards render
- [ ] Status counts display correctly
- [ ] Priority badges show when needed
- [ ] Bottom navigation works
- [ ] Chat badge displays notification count
- [ ] All icons load properly
- [ ] Scroll behavior is smooth
- [ ] Pull-to-refresh works
- [ ] Responsive on different screens
- [ ] Navigation between tabs works
- [ ] Data updates in real-time

---

## 10. Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Setup & Assets | 30 min |
| 2 | Bottom Navigation | 1 hour |
| 3 | Header Component | 1.5 hours |
| 4 | Category Cards | 2 hours |
| 5 | Main Screen Assembly | 1 hour |
| 6 | Interactions & Polish | 1 hour |
| 7 | Data Integration | 30 min |
| **Total** | | **~7.5 hours** |

---

## 11. Mock Data Example

```typescript
const mockHomeData: HomeScreenData = {
  user: {
    name: 'Stella Kitou',
    role: 'Executive Housekeeper',
    avatar: 'https://...',
    hasFlag: true,
  },
  selectedShift: 'AM',
  date: 'Mon 23 Feb 2025',
  categories: [
    {
      id: 'flagged',
      name: 'Flagged',
      total: 8,
      priority: 4,
      borderColor: '#6e1eee',
      status: { dirty: 4, inProgress: 2, cleaned: 1, inspected: 1 }
    },
    {
      id: 'arrivals',
      name: 'Arrivals',
      total: 30,
      priority: 2,
      borderColor: '#41d541',
      status: { dirty: 20, inProgress: 5, cleaned: 3, inspected: 2 }
    },
    {
      id: 'stayovers',
      name: 'StayOvers',
      total: 28,
      borderColor: '#8d908d',
      status: { dirty: 15, inProgress: 5, cleaned: 8, inspected: 0 }
    }
  ],
  notifications: { chat: 3 }
};
```

---

## Next Steps

1. **Review this plan** and confirm approach
2. **Download assets** from Figma
3. **Create component structure**
4. **Begin implementation** starting with Phase 1

Would you like me to proceed with implementation?

