# Filter Modal - Implementation Plan

## Overview
This document outlines the implementation plan for the Filter Modal overlay component based on the Figma design (node-id: 1386-312). The filter allows users to filter rooms by Room State and Guest categories.

---

## 1. Design Analysis

### A. Modal Structure
**Component:** `FilterModal.tsx` or `FilterOverlay.tsx`
- **Type:** Full-screen overlay with blurred background
- **Background:** Blurred backdrop (`backdrop-blur-[10.45px]`, `bg-[rgba(228,228,228,0.1)]`)
- **Modal Card:** White rounded rectangle with shadow
- **Height:** 855px (covers most of screen)
- **Width:** 440px (full screen width)
- **Position:** Centered overlay

### B. Header Section
**Position:** Top of modal
**Elements:**
1. **Title** (left: 59px, top: 222px)
   - Text: "Filter"
   - Font: Bold, 20px, `#1e1e1e`
   - Height: 21px

2. **Results Badge** (left: 279px, top: 216px)
   - Background: `rgba(181,207,246,0.37)`
   - Border Radius: 40px
   - Size: 115x33px
   - Text: "20 results"
   - Font: Light, 14px, Black
   - Position: Top right

### C. Filter Categories

#### Category 1: Room State
**Heading:**
- Text: "Room State"
- Font: Bold, 16px, `#1e1e1e`
- Position: left: 57px, top: 278px
- Height: 21px

**Filter Options (5 total):**
Each option has:
- **Checkbox:** Square border, 25x24px (or 25x25px/25x26px), border: `#c6c5c5`
- **Colored Indicator:** Circular dot or icon, 19x19px (or 19x20px)
- **Label:** Text, Light, 16px, Black
- **Count:** Text, Light, 11px, `#a9a9a9`, positioned right

1. **Dirty**
   - Checkbox: left: 59px, top: 318px, 25x24px
   - Indicator: Red circle (`#f92424`), left: 101px, top: 323px, 19x19px
   - Label: "Dirty", left: 132px, top: 323px
   - Count: "24 Rooms", left: 329px, top: 321px

2. **In Progress**
   - Checkbox: left: 59px, top: 363px, 25x26px
   - Indicator: Yellow circle (`#f0be1b`), left: 101px, top: 368px, 19x19px
   - Label: "In Progress", left: 132px, top: 366px
   - Count: "24 Rooms", left: 329px, top: 370px

3. **Cleaned**
   - Checkbox: left: 59px, top: 413px, 25x24px
   - Indicator: Blue circle (`#4a91fc`), left: 101px, top: 417px, 19x20px
   - Label: "Cleaned", left: 132px, top: 417px
   - Count: "24 Rooms", left: 329px, top: 422px

4. **Inspected**
   - Checkbox: left: 59px, top: 467px, 25x25px
   - Indicator: Green circle (`#41d541`), left: 101px, top: 471px, 19x19px
   - Label: "Inspected", left: 132px, top: 465px
   - Count: "24 Rooms", left: 329px, top: 480px

5. **Priority**
   - Checkbox: left: 59px, top: 516px, 25x25px
   - Indicator: Red icon (running person icon), left: 101px, top: 519px, 19.412x19.412px
   - Label: "Priority", left: 132px, top: 519px
   - Count: "24 Rooms", left: 329px, top: 523px

**Divider:**
- Horizontal line between Room State and Guest sections
- Position: left: 22px, top: 517px
- Width: 399px
- Height: 1px (or 0px with border)
- Color: `#c6c5c5` or similar

#### Category 2: Guest
**Heading:**
- Text: "Guest"
- Font: Bold, 16px, `#1e1e1e`
- Position: left: 59px, top: 565px
- Height: 24px

**Filter Options (4 total):**
Each option has same structure as Room State options:

1. **Arrivals**
   - Checkbox: left: 59px, top: 603px, 25x24px
   - Indicator: Green icon (arrival icon), left: 101px, top: 606px, 21x21px
   - Label: "Arrivals", left: 132px, top: 607px
   - Count: "18", left: 365px, top: 609px

2. **Departures**
   - Checkbox: left: 59px, top: 654px, 25x25px
   - Indicator: Red icon (departure icon), left: 101px, top: 658px, 21x21px
   - Label: "Departures", left: 132px, top: 661px
   - Count: "18", left: 365px, top: 662px

3. **Turn Down**
   - Checkbox: left: 59px, top: 707px, 25x24px
   - Indicator: Dark blue circle (`#5a759d`), left: 101px, top: 711px, 19x20px
   - Label: "Turn Down", left: 132px, top: 711px
   - Count: None (no count displayed)

4. **StayOver**
   - Checkbox: left: 59px, top: 758px, 25x25px
   - Indicator: Black circle, left: 101px, top: 763px, 19x19px
   - Label: "StayOver", left: 132px, top: 765px
   - Count: None (no count displayed)

### D. Action Buttons (Bottom)

1. **Go to Results Button**
   - Text: "Go to Results"
   - Font: Bold, 16px, `#5a759d`
   - Position: left: 62px, top: 838px
   - Width: 109px
   - Height: 21px
   - Arrow Icon: Right-pointing arrow, 25x12.765px, positioned right of text
   - Color: `#5a759d` (blue)

2. **Advance Filter Link**
   - Text: "Advance Filter"
   - Font: Light, 13px, Black
   - Position: left: 62px, top: 869px
   - Width: 91px
   - Height: 19px

---

## 2. Component Structure

### A. Main Component: `FilterModal.tsx`
```typescript
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onGoToResults: () => void;
  onAdvanceFilter: () => void;
  resultCount?: number;
}
```

### B. Filter State Type
```typescript
interface FilterState {
  roomState: {
    dirty: boolean;
    inProgress: boolean;
    cleaned: boolean;
    inspected: boolean;
    priority: boolean;
  };
  guest: {
    arrivals: boolean;
    departures: boolean;
    turnDown: boolean;
    stayOver: boolean;
  };
}
```

### C. Filter Option Component: `FilterOption.tsx`
```typescript
interface FilterOptionProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  indicatorColor?: string;
  indicatorIcon?: any;
  count?: number;
  position: { top: number };
}
```

---

## 3. Design Tokens & Constants

### Colors
- **Background Overlay:** `rgba(228,228,228,0.1)` with blur
- **Modal Background:** White (`#ffffff`)
- **Checkbox Border:** `#c6c5c5`
- **Text Primary:** `#1e1e1e`
- **Text Secondary:** `#a9a9a9`
- **Results Badge BG:** `rgba(181,207,246,0.37)`
- **Go to Results:** `#5a759d`

### Indicator Colors
- **Dirty:** `#f92424` (red)
- **In Progress:** `#f0be1b` (yellow)
- **Cleaned:** `#4a91fc` (blue)
- **Inspected:** `#41d541` (green)
- **Priority:** Red icon
- **Arrivals:** Green icon
- **Departures:** Red icon
- **Turn Down:** `#5a759d` (dark blue)
- **StayOver:** Black

### Typography
- **Title:** Bold, 20px, `#1e1e1e`
- **Category Heading:** Bold, 16px, `#1e1e1e`
- **Option Label:** Light, 16px, Black
- **Count:** Light, 11px, `#a9a9a9`
- **Results Badge:** Light, 14px, Black
- **Go to Results:** Bold, 16px, `#5a759d`
- **Advance Filter:** Light, 13px, Black

### Spacing & Dimensions
- **Modal Width:** 440px (full screen)
- **Modal Height:** 855px
- **Checkbox Size:** 25x24px (varies: 25x25px, 25x26px)
- **Indicator Size:** 19x19px (varies: 19x20px, 21x21px)
- **Results Badge:** 115x33px
- **Border Radius:** 40px (results badge), 12px (modal)

---

## 4. Icons Required

### Status Icons
- `dirty-state-icon.png` - For Dirty indicator
- `in-progess-state-icon.png` - For In Progress indicator
- `cleaned-state-icon.png` - For Cleaned indicator
- `inspected-status-icon.png` - For Inspected indicator
- `priority-icon.png` or running person icon - For Priority indicator

### Guest Icons
- `arrival-icon.png` or `guest-arrival-icon.png` - For Arrivals indicator
- `departure-icon.png` or `guest-departure-icon.png` - For Departures indicator
- (Turn Down and StayOver use colored circles, no icons)

### Other Icons
- `forward-arrow-icon.png` - For "Go to Results" button (right-pointing)

---

## 5. Implementation Steps

### Phase 1: Create Filter Types & Constants
**File:** `src/types/filter.types.ts`
- Define `FilterState` interface
- Define `FilterCategory` type
- Define filter option types

**File:** `src/constants/filterStyles.ts`
- Extract all positioning constants
- Define colors, typography, spacing
- Define checkbox and indicator sizes

### Phase 2: Create Filter Option Component
**File:** `src/components/filter/FilterOption.tsx`
- Reusable component for each filter option
- Checkbox with toggle functionality
- Colored indicator (circle or icon)
- Label and count display
- Proper spacing and alignment

### Phase 3: Create Filter Category Section
**File:** `src/components/filter/FilterCategorySection.tsx`
- Section header
- List of filter options
- Divider between sections

### Phase 4: Create Main Filter Modal
**File:** `src/components/filter/FilterModal.tsx`
- Modal overlay with blurred background
- Header with title and results badge
- Two category sections (Room State, Guest)
- Action buttons at bottom
- State management for filter selections
- Close functionality

### Phase 5: Integrate with All Rooms Screen
**File:** `src/screens/AllRoomsScreen.tsx`
- Add state for filter modal visibility
- Connect filter button to open modal
- Apply filters to room list
- Update result count

### Phase 6: Styling & Polish
- Ensure exact positioning from Figma
- Add animations (fade in/out, blur)
- Add touch feedback
- Test checkbox interactions
- Verify all icons and colors

---

## 6. Detailed Component Specifications

### FilterOption Component
**Props:**
```typescript
interface FilterOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
  indicatorType: 'circle' | 'icon';
  indicatorColor?: string;
  indicatorIcon?: any;
  count?: number;
  top: number; // Position from top of modal
}
```

**Layout:**
- Row layout: Checkbox | Indicator | Label | Count (optional)
- Checkbox: 25x24px (or variant), left: 59px
- Indicator: 19x19px (or variant), left: 101px
- Label: left: 132px
- Count: right-aligned, left: 329px or 365px

### FilterModal Component
**State:**
```typescript
const [filters, setFilters] = useState<FilterState>({
  roomState: {
    dirty: false,
    inProgress: false,
    cleaned: false,
    inspected: false,
    priority: false,
  },
  guest: {
    arrivals: false,
    departures: false,
    turnDown: false,
    stayOver: false,
  },
});
```

**Layout Structure:**
```
<BlurView> (background)
  <ModalContainer>
    <Header>
      <Title>Filter</Title>
      <ResultsBadge>20 results</ResultsBadge>
    </Header>
    
    <FilterCategorySection title="Room State">
      <FilterOption ... /> (Dirty)
      <FilterOption ... /> (In Progress)
      <FilterOption ... /> (Cleaned)
      <FilterOption ... /> (Inspected)
      <FilterOption ... /> (Priority)
    </FilterCategorySection>
    
    <Divider />
    
    <FilterCategorySection title="Guest">
      <FilterOption ... /> (Arrivals)
      <FilterOption ... /> (Departures)
      <FilterOption ... /> (Turn Down)
      <FilterOption ... /> (StayOver)
    </FilterCategorySection>
    
    <Actions>
      <GoToResultsButton />
      <AdvanceFilterLink />
    </Actions>
  </ModalContainer>
</BlurView>
```

---

## 7. Positioning Constants

### Header
- Title: left: 59px, top: 222px
- Results Badge: left: 279px, top: 216px

### Room State Section
- Heading: left: 57px, top: 278px
- Dirty: top: 318px
- In Progress: top: 363px
- Cleaned: top: 413px
- Inspected: top: 467px
- Priority: top: 516px

### Divider
- left: 22px, top: 517px, width: 399px

### Guest Section
- Heading: left: 59px, top: 565px
- Arrivals: top: 603px
- Departures: top: 654px
- Turn Down: top: 707px
- StayOver: top: 758px

### Actions
- Go to Results: left: 62px, top: 838px
- Advance Filter: left: 62px, top: 869px

---

## 8. Interaction Behavior

### Checkbox Toggle
- Clicking checkbox toggles the filter state
- Visual feedback on toggle
- Checkbox shows checked state (filled or checkmark)

### Go to Results
- Applies current filter selections
- Closes modal
- Navigates to filtered results (or updates current view)

### Advance Filter
- Opens additional filter options (future implementation)
- May navigate to separate screen

### Close Modal
- Click outside modal (on backdrop)
- Swipe down gesture
- Back button (Android)

---

## 9. Integration Points

### AllRoomsScreen Integration
1. Add filter button in header (already exists: `onFilterPress`)
2. Add state for modal visibility
3. Add state for filter selections
4. Filter room list based on selections
5. Update result count badge
6. Pass filters to modal component

### Data Flow
```
AllRoomsScreen
  ├── Filter Button (in header)
  │   └── Opens FilterModal
  ├── FilterModal
  │   ├── Receives current filters
  │   ├── Allows user to toggle filters
  │   └── Calls onApply with new filters
  └── Applies filters to room list
      └── Updates displayed rooms
```

---

## 10. Files to Create

### Components
1. `src/components/filter/FilterModal.tsx` - Main modal component
2. `src/components/filter/FilterOption.tsx` - Individual filter option
3. `src/components/filter/FilterCategorySection.tsx` - Category section wrapper
4. `src/components/filter/FilterCheckbox.tsx` - Custom checkbox component (optional)

### Types
5. `src/types/filter.types.ts` - Filter-related TypeScript types

### Constants
6. `src/constants/filterStyles.ts` - Filter styling constants

### Updates
7. `src/screens/AllRoomsScreen.tsx` - Integrate filter modal
8. `src/components/allRooms/AllRoomsHeader.tsx` - Connect filter button (if needed)

---

## 11. Implementation Checklist

### Phase 1: Setup
- [ ] Create filter types (`filter.types.ts`)
- [ ] Create filter constants (`filterStyles.ts`)
- [ ] Define filter state structure

### Phase 2: Components
- [ ] Create `FilterCheckbox` component (if custom needed)
- [ ] Create `FilterOption` component
- [ ] Create `FilterCategorySection` component
- [ ] Create `FilterModal` component

### Phase 3: Styling
- [ ] Implement blurred background overlay
- [ ] Style modal container
- [ ] Style header section
- [ ] Style filter options
- [ ] Style action buttons
- [ ] Add dividers

### Phase 4: Functionality
- [ ] Implement checkbox toggle logic
- [ ] Implement filter state management
- [ ] Implement "Go to Results" action
- [ ] Implement "Advance Filter" action
- [ ] Implement close/backdrop dismiss

### Phase 5: Integration
- [ ] Integrate with AllRoomsScreen
- [ ] Connect filter button
- [ ] Implement filter application logic
- [ ] Update result count
- [ ] Test filter combinations

### Phase 6: Polish
- [ ] Add animations (fade, blur)
- [ ] Add touch feedback
- [ ] Verify all positioning
- [ ] Test on different screen sizes
- [ ] Verify all icons and colors

---

## 12. Key Implementation Details

### Blur Effect
- Use `BlurView` from `expo-blur` (already used in AllRoomsScreen)
- Intensity: ~10.45px (or equivalent)
- Background: `rgba(228,228,228,0.1)`

### Checkbox Implementation
- Custom checkbox with border
- Checked state: filled or checkmark icon
- Border color: `#c6c5c5`
- Size: 25x24px (with variations)

### Indicator Types
- **Circle:** Colored circle for status filters
- **Icon:** Custom icon for Priority, Arrivals, Departures
- Size: 19x19px (with variations)

### Positioning Strategy
- Use absolute positioning for all elements
- Calculate positions relative to modal container (0,0 at top-left)
- Use `scaleX` for responsive scaling

### State Management
- Local state in FilterModal for UI
- Pass selected filters to parent via `onApply` callback
- Parent (AllRoomsScreen) manages actual filtering logic

---

## 13. Testing Checklist

- [ ] Modal opens/closes correctly
- [ ] Backdrop blur works
- [ ] All checkboxes toggle correctly
- [ ] Filter state persists during modal open
- [ ] "Go to Results" applies filters
- [ ] Result count updates correctly
- [ ] All icons display correctly
- [ ] All colors match Figma
- [ ] Positioning matches Figma exactly
- [ ] Text is readable and properly aligned
- [ ] Touch targets are adequate
- [ ] Modal dismisses on backdrop tap
- [ ] Works on different screen sizes

---

## Summary

The Filter Modal is a full-screen overlay that allows users to filter rooms by:
- **Room State:** Dirty, In Progress, Cleaned, Inspected, Priority
- **Guest:** Arrivals, Departures, Turn Down, StayOver

Each filter option has a checkbox, colored indicator, label, and optional count. The modal includes a results badge showing filtered count and action buttons at the bottom.

**Key Features:**
- Blurred background overlay
- Two filter categories
- 9 total filter options
- Checkbox toggles
- Result count display
- "Go to Results" button
- "Advance Filter" link

**Implementation Priority:**
1. Create types and constants
2. Build FilterOption component
3. Build FilterModal component
4. Integrate with AllRoomsScreen
5. Add styling and polish

