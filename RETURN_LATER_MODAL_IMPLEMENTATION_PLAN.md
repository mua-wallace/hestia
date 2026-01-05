# Return Later Modal - Implementation Plan

## Overview
This document outlines the implementation plan for the "Return Later" modal screen that appears when a user selects "Return Later" status in the room details screen.

**Figma Design:** https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1121-328&m=dev

## Design Analysis

### Screen Structure
The modal is a full-screen overlay that appears after the room header (starts at 232px from top). It contains:

1. **Header Section** (253px - 312px)
   - Title: "Return Later" (20px, Bold, #607aa1)
   - Instruction text: "Add time slot for when the Guest wants you to return" (14px, Light, #1e1e1e)
   - Divider line (1px, #c6c5c5)

2. **Suggestions Section** (336px - 371px)
   - Label: "Suggestions" (14px, Light, #1e1e1e)
   - Four suggestion buttons: "10 mins", "20 mins", "30 mins", "1 Hour"
   - Button style: Border (1px, black), Rounded (41px), Height (39px)

3. **AM/PM Toggle** (466px)
   - Toggle switch component (121px × 35.243px)
   - Background: rgba(100, 131, 176, 0.07)
   - Active slider: #5a759d (64.612px × 30.544px)
   - AM/PM text buttons

4. **Time Picker** (556px - 782px)
   - Two vertical scroll wheels
   - Left: Hours (12-hour format: 1-12)
   - Right: Minutes (00-59)
   - Selected items: 24px, Bold, #5a759d
   - Unselected items: 16px, Regular, #999999
   - Height: 226px

5. **Confirm Button** (848px - 955px)
   - Full-width button (441px × 107px)
   - Background: #5a759d
   - Text: "Confirm" (18px, Regular, white)

6. **Assigned To Section** (1185px - bottom)
   - Title: "Assigned to" (15px, Bold)
   - Profile picture (35px × 35px)
   - Staff name (13px, Bold)
   - Reassign button (122px × 49px, #f1f6fc background)

## Component Breakdown

### 1. Main Modal Component
**File:** `src/components/roomDetail/ReturnLaterModal.tsx`

**Responsibilities:**
- Full-screen modal overlay (starts at 232px from top)
- White background covering rest of screen
- Coordinates all sub-components
- Handles state management (selected time, period, suggestion)
- Manages confirm action

**Props:**
```typescript
interface ReturnLaterModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (returnTime: string, period: 'AM' | 'PM') => void;
  roomNumber?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: any;
  };
  onReassignPress?: () => void;
}
```

**State:**
- `selectedSuggestion`: string | null
- `selectedHour`: number (0-23)
- `selectedMinute`: number (0-59)
- `selectedPeriod`: 'AM' | 'PM'

---

### 2. Time Suggestion Buttons
**File:** `src/components/roomDetail/TimeSuggestionButton.tsx`

**Reusable Component** - Can be used for other time selection UIs

**Responsibilities:**
- Renders individual suggestion button
- Handles selection state
- Applies selected/unselected styles

**Props:**
```typescript
interface TimeSuggestionButtonProps {
  label: string; // "10 mins", "20 mins", "30 mins", "1 Hour"
  isSelected: boolean;
  onPress: () => void;
}
```

**Design Specs:**
- Border: 1px, black
- Border radius: 41px
- Height: 39px
- Min width: 74px
- Padding: 16px horizontal, 11px vertical
- Background: white (unselected), #f5f5f5 (selected)
- Text: 14px, Light (unselected), Bold (selected), black

---

### 3. Time Suggestions Container
**File:** `src/components/roomDetail/TimeSuggestionsContainer.tsx`

**Reusable Component** - Container for suggestion buttons

**Responsibilities:**
- Renders row of suggestion buttons
- Manages spacing (12px gap)
- Handles button selection logic

**Props:**
```typescript
interface TimeSuggestionsContainerProps {
  suggestions: string[]; // ["10 mins", "20 mins", "30 mins", "1 Hour"]
  selectedSuggestion: string | null;
  onSuggestionSelect: (suggestion: string) => void;
}
```

---

### 4. AMPM Toggle Component
**File:** `src/components/roomDetail/AMPMToggle.tsx` (or reuse existing `src/components/home/AMPMToggle.tsx`)

**Reusable Component** - Already exists, may need slight modification

**Responsibilities:**
- Toggle between AM and PM
- Animated slider background
- Visual feedback for selection

**Props:**
```typescript
interface AMPMToggleProps {
  selected: 'AM' | 'PM';
  onToggle: (period: 'AM' | 'PM') => void;
}
```

**Note:** The existing `AMPMToggle` component in `src/components/home/AMPMToggle.tsx` can be reused or adapted.

---

### 5. Time Picker Wheel
**File:** `src/components/shared/TimePickerWheel.tsx`

**Highly Reusable Component** - Can be used in other time selection scenarios

**Responsibilities:**
- Renders scrollable wheel for time values
- Handles snap-to-interval scrolling
- Highlights selected item
- Provides visual feedback

**Props:**
```typescript
interface TimePickerWheelProps {
  values: (string | number)[]; // Array of values to display
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  itemHeight?: number; // Default: 40px
  snapInterval?: number; // Default: 40px
  width?: number; // Default: 50px
}
```

**Design Specs:**
- Width: 50px
- Item height: 40px
- Selected text: 24px, Bold, #5a759d
- Unselected text: 16px, Regular, #999999
- Snap interval: 40px
- Deceleration: "fast"

---

### 6. Time Picker Container
**File:** `src/components/roomDetail/TimePickerContainer.tsx`

**Reusable Component** - Combines hour and minute wheels

**Responsibilities:**
- Renders two TimePickerWheel components side by side
- Manages hour and minute selection
- Handles 12-hour format conversion
- Coordinates between hours and minutes

**Props:**
```typescript
interface TimePickerContainerProps {
  selectedHour: number; // 0-23
  selectedMinute: number; // 0-59
  selectedPeriod: 'AM' | 'PM';
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
}
```

**Logic:**
- Convert 24-hour to 12-hour format for display
- Handle hour 0 → 12 (midnight)
- Handle hours > 12 → subtract 12 (afternoon)
- Generate hours array: [1, 2, 3, ..., 12]
- Generate minutes array: ['00', '01', '02', ..., '59']

---

### 7. Confirm Button
**File:** `src/components/roomDetail/ReturnLaterConfirmButton.tsx`

**Reusable Component** - Full-width action button

**Responsibilities:**
- Renders full-width confirm button
- Handles press action
- Provides visual feedback

**Props:**
```typescript
interface ReturnLaterConfirmButtonProps {
  onPress: () => void;
  disabled?: boolean;
}
```

**Design Specs:**
- Full width (441px)
- Height: 107px
- Background: #5a759d
- Text: "Confirm" (18px, Regular, white)
- Centered text

---

### 8. Assigned To Section
**File:** `src/components/roomDetail/AssignedToSection.tsx`

**Reusable Component** - Already exists, can be reused

**Note:** This component already exists at `src/components/roomDetail/AssignedToSection.tsx`. We can reuse it or create a variant if needed.

---

## File Structure

```
src/components/
├── roomDetail/
│   ├── ReturnLaterModal.tsx          # Main modal component
│   ├── TimeSuggestionButton.tsx     # Individual suggestion button
│   ├── TimeSuggestionsContainer.tsx # Container for suggestions
│   ├── TimePickerContainer.tsx      # Hour + Minute picker
│   └── ReturnLaterConfirmButton.tsx # Confirm button
│
└── shared/
    └── TimePickerWheel.tsx          # Reusable scroll wheel component
```

## Implementation Steps

### Phase 1: Base Components (2 hours)
1. ✅ Create `TimePickerWheel.tsx` - Reusable scroll wheel
   - Implement ScrollView with snap intervals
   - Add selected/unselected styling
   - Handle value selection

2. ✅ Create `TimeSuggestionButton.tsx`
   - Button with border and rounded corners
   - Selected/unselected states
   - Press handling

3. ✅ Create `TimeSuggestionsContainer.tsx`
   - Row layout with gap spacing
   - Manages suggestion selection
   - Maps suggestions to buttons

### Phase 2: Composite Components (2 hours)
4. ✅ Create `TimePickerContainer.tsx`
   - Two TimePickerWheel components
   - Hour and minute logic
   - 12-hour format conversion

5. ✅ Create `ReturnLaterConfirmButton.tsx`
   - Full-width button
   - Styling and press handling

### Phase 3: Main Modal (2 hours)
6. ✅ Create `ReturnLaterModal.tsx`
   - Modal structure and layout
   - State management
   - Integrate all sub-components
   - Handle confirm action
   - Position elements absolutely

### Phase 4: Integration (1 hour)
7. ✅ Integrate with `ArrivalDepartureDetailScreen.tsx`
   - Add state for modal visibility
   - Handle "Return Later" selection from status modal
   - Pass props to ReturnLaterModal
   - Handle confirm callback

### Phase 5: Testing & Polish (1 hour)
8. ✅ Test all interactions
   - Suggestion button selection
   - Time picker scrolling
   - AM/PM toggle
   - Confirm action
   - Close modal

9. ✅ Verify positioning
   - All elements match Figma positions
   - Responsive scaling
   - Proper spacing

## Styling Constants

Create constants file: `src/constants/returnLaterModalStyles.ts`

```typescript
export const RETURN_LATER_MODAL = {
  overlay: {
    top: 232, // Starts after header
    backgroundColor: '#ffffff',
  },
  title: {
    top: 253,
    fontSize: 20,
    color: '#607aa1',
  },
  instruction: {
    top: 280,
    fontSize: 14,
    color: '#1e1e1e',
  },
  divider: {
    top: 312,
    height: 1,
    color: '#c6c5c5',
  },
  suggestions: {
    labelTop: 336,
    buttonsTop: 371,
    gap: 12,
  },
  toggle: {
    top: 466,
  },
  timePicker: {
    top: 556,
    height: 226,
    gap: 15,
  },
  confirmButton: {
    top: 848,
    height: 107,
    backgroundColor: '#5a759d',
  },
  assignedTo: {
    top: 1185,
  },
} as const;
```

## Key Technical Considerations

### 1. Absolute Positioning
- All elements use absolute positioning based on Figma coordinates
- Modal starts at 232px (header height)
- All positions relative to modal top (0px = 232px screen position)

### 2. Time Format Conversion
- Store time in 24-hour format internally (0-23)
- Display in 12-hour format (1-12)
- Handle AM/PM conversion on confirm

### 3. Suggestion Button Logic
- When suggestion is selected, parse and set time
- "10 mins" → 0 hours, 10 minutes
- "20 mins" → 0 hours, 20 minutes
- "30 mins" → 0 hours, 30 minutes
- "1 Hour" → 1 hour, 0 minutes

### 4. Scroll Wheel Implementation
- Use ScrollView with `snapToInterval`
- Calculate scroll position based on selected value
- Handle momentum scrolling
- Ensure selected item is always visible

### 5. Responsive Scaling
- Use `scaleX` from `roomDetailStyles.ts`
- All dimensions scale proportionally
- Maintain aspect ratios

## Reusability Notes

### Components That Can Be Reused Elsewhere:

1. **TimePickerWheel** - Can be used for:
   - Date pickers
   - Duration selectors
   - Any numeric scroll selection

2. **TimeSuggestionButton** - Can be used for:
   - Quick action buttons
   - Tag selection
   - Filter buttons

3. **TimePickerContainer** - Can be used for:
   - Appointment scheduling
   - Time slot selection
   - Deadline setting

4. **AMPMToggle** - Already reusable (used in HomeHeader)

5. **AssignedToSection** - Already exists and reusable

## Testing Checklist

- [ ] Modal opens when "Return Later" is selected
- [ ] All elements positioned correctly
- [ ] Suggestion buttons work and update time
- [ ] AM/PM toggle switches correctly
- [ ] Time picker wheels scroll smoothly
- [ ] Selected time displays correctly
- [ ] Confirm button triggers callback with correct time
- [ ] Modal closes on confirm
- [ ] Assigned to section displays correctly
- [ ] Reassign button works (if implemented)
- [ ] Responsive on different screen sizes
- [ ] No layout issues or overlaps

## Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Base Components | 2 hours |
| 2 | Composite Components | 2 hours |
| 3 | Main Modal | 2 hours |
| 4 | Integration | 1 hour |
| 5 | Testing & Polish | 1 hour |
| **Total** | | **8 hours** |

## Next Steps

1. Review and approve this plan
2. Create component files with TypeScript interfaces
3. Implement base components first
4. Build up to main modal
5. Integrate with room detail screen
6. Test and refine

