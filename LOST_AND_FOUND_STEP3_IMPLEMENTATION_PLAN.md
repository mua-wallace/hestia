# Lost and Found - Step 3: Confirm Registration Implementation Plan

## Overview
This document outlines the implementation plan for Step 3 (Confirm Registration) of the Lost and Found registration form. This step displays a summary of all entered information and allows users to confirm and submit the registration.

## Design Analysis

### Layout Structure
The Step 3 screen follows a vertical scrollable layout with the following sections:

1. **Header** (same as previous steps)
   - Back arrow button
   - "Lost & Found" title

2. **Title Section**
   - "Confirm Registration" text
   - "Step 3" indicator
   - Progress bar (all 3 segments filled)

3. **Item Details Section**
   - Item image (left side)
   - Item description with edit icon
   - "Found in" section with checkbox and guest info
   - Email option checkbox

4. **Date and Time Section**
   - Label and values with edit icon

5. **Staff Information Sections**
   - "Founded by" with avatar, name, and department
   - "Registered by" with avatar, name, and department

6. **Status Section**
   - Status with icon
   - Stored location

7. **Action Button**
   - "Done" button at bottom

## Components to Create/Update

### 1. Update `RegisterLostAndFoundModal.tsx`
- Add `currentStep === 3` conditional rendering
- Display all collected form data from Steps 1 and 2
- Add edit functionality for editable fields
- Implement "Done" button handler

### 2. Design Tokens (Update `lostAndFoundStyles.ts`)
Add constants for Step 3:
- Item image dimensions and positioning
- Item description styling
- Edit icon styling and positioning
- Guest info section styling
- Email checkbox styling
- Date/time display section
- Staff info display sections
- Status display section
- Done button styling

### 3. New Components (if needed)
- `ConfirmRegistrationStep3.tsx` - Main component for Step 3 content (optional, can be inline)
- Edit icon component (reusable)

## Implementation Details

### Step 3 Content Structure

#### Item Image Section
- **Position**: Top of content (after progress bar)
- **Dimensions**: 214px × 140px (from Figma)
- **Border Radius**: 5px
- **Source**: Use selected image from Step 1 or placeholder
- **Styling**: Rounded corners, cover resize mode

#### Item Description Section
- **Label**: "Wrist watch found in guest bathroom whole cleaning"
- **Edit Icon**: Pencil icon positioned to the right
- **Action**: Clicking edit icon should navigate back to Step 1 or allow inline editing

#### Found In Section
- **Label**: "Found in" (bold)
- **Checkbox**: "Room" (checked if room was selected)
- **Guest Info**:
  - Arrow icon
  - Guest name: "Mr Mohamed B"
  - Room number: "Room 201"
  - Edit icon next to room number
- **Action**: Clicking edit icon should allow editing room selection

#### Email Option
- **Checkbox**: "Send Email to Guest for reclamation?"
- **State**: Checked/unchecked
- **Position**: Below "Found in" section

#### Date and Time Section
- **Label**: "Date and time" (bold)
- **Date Display**: "11 November 2025" (formatted from selected date)
- **Time Display**: "15:00" (formatted from selected time)
- **Edit Icon**: Positioned to the right
- **Action**: Clicking edit icon should open date/time pickers

#### Founded By Section
- **Label**: "Founded by" (bold)
- **Avatar**: 32px × 32px circular image
- **Name**: Staff member name
- **Department**: Staff department (e.g., "HSK")
- **Data Source**: From Step 2 `foundedBy` state

#### Registered By Section
- **Label**: "Registered by" (bold)
- **Avatar**: 32px × 32px circular image
- **Name**: Staff member name
- **Department**: Staff department (e.g., "HSK")
- **Data Source**: From Step 2 `registeredBy` state

#### Status Section
- **Label**: "Status" (bold)
- **Status Display**: 
  - Icon (yellow circle for "Stored", tick for "Shipped", etc.)
  - Status text: "Stored"
- **Stored Location Label**: "Stored Location"
- **Stored Location Value**: "HSK Office"
- **Data Source**: From Step 2 `status` and `storedLocation` states

#### Done Button
- **Position**: Bottom of screen (centered)
- **Dimensions**: 351px × 70px
- **Background**: #5a759d (blue)
- **Text**: "Done" (white, 18px)
- **Action**: 
  - Validate all required fields
  - Submit registration data
  - Close modal
  - Optionally call `onNext` callback

### State Management

#### Required State (already exists from Steps 1-2)
- `selectedDate` - Date from Step 1
- `selectedHour` - Hour from Step 1
- `selectedMinute` - Minute from Step 1
- `selectedLocation` - 'room' | 'publicArea' from Step 1
- `selectedRoom` - Room data from Step 1
- `notes` - Notes from Step 1
- `foundedBy` - Staff ID from Step 2
- `registeredBy` - Staff ID from Step 2
- `status` - Status from Step 2
- `storedLocation` - Location from Step 2
- `pictures` - Images from Step 1 (if implemented)

#### New State for Step 3
- `sendEmailToGuest` - Boolean for email checkbox
- `isEditing` - Object to track which field is being edited

### Edit Functionality

#### Editable Fields
1. **Item Description** - Navigate to Step 1 or show inline editor
2. **Room Selection** - Open room selector
3. **Date/Time** - Open date/time pickers
4. **Founded By** - Open staff selector
5. **Registered By** - Open staff selector
6. **Status** - Open status dropdown
7. **Stored Location** - Open location dropdown

#### Edit Flow
- Click edit icon → Open appropriate picker/modal
- User makes changes → Update state
- Close picker → Return to Step 3 with updated data

### Data Formatting

#### Date Formatting
- Format: "DD Month YYYY" (e.g., "11 November 2025")
- Use date formatting utility or library

#### Time Formatting
- Format: "HH:MM" (24-hour format, e.g., "15:00")
- Pad with zeros if needed

#### Staff Name Formatting
- Display full name from staff data
- Fallback to initials if name not available

### Validation

#### Before "Done" Button
- All required fields must be filled:
  - Date and time
  - Location (room or public area)
  - Founded by
  - Registered by
  - Status
  - Stored location (if status is "Stored")
- Show error messages if validation fails

### Styling Details

#### Typography
- Section labels: Bold, 16px, black
- Values: Regular, 16px, #5a759d (blue) or black
- Department text: Light, 14px, black

#### Spacing
- Use relative spacing (scaleX) for responsiveness
- Follow Figma spacing values
- Maintain consistent margins between sections

#### Colors
- Primary text: #000000 (black)
- Secondary text: #5a759d (blue)
- Department text: #000000 (black)
- Status icon: Yellow (#f0be1b) for "Stored"
- Button background: #5a759d (blue)
- Button text: #ffffff (white)

#### Icons
- Edit icons: Pencil icon, grey color
- Arrow icons: For guest info navigation
- Status icons: Yellow circle, tick, etc.
- Avatar images: 32px × 32px, circular

## Implementation Steps

### Phase 1: Basic Layout
1. Add Step 3 conditional rendering in `RegisterLostAndFoundModal.tsx`
2. Create basic layout structure with all sections
3. Display static data from Steps 1-2 states

### Phase 2: Data Display
1. Format and display date/time
2. Display staff information with avatars
3. Display status and location
4. Display item description and guest info

### Phase 3: Edit Functionality
1. Add edit icons to editable fields
2. Implement edit handlers
3. Connect to existing pickers/modals from Steps 1-2

### Phase 4: Email Option
1. Add email checkbox
2. Add state management
3. Style checkbox

### Phase 5: Done Button
1. Create button component
2. Add validation logic
3. Implement submission handler
4. Add loading state (optional)

### Phase 6: Polish
1. Add dividers between sections
2. Ensure proper spacing
3. Test all edit flows
4. Verify responsive behavior

## Design Tokens to Add

```typescript
step3: {
  itemImage: {
    width: 214,
    height: 140,
    borderRadius: 5,
    left: 29,
    top: 243,
  },
  itemDescription: {
    left: 36,
    top: 406,
    fontSize: 16,
    fontWeight: 'light',
    color: '#000000',
    width: 262,
  },
  editIcon: {
    size: 28,
    // Positioned relative to parent
  },
  foundIn: {
    label: {
      left: 36,
      top: 466,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
    },
    checkbox: {
      left: 37,
      top: 507,
      size: 28,
    },
    guestInfo: {
      left: 40,
      top: 573,
    },
  },
  emailCheckbox: {
    left: 84,
    top: 659,
    fontSize: 16,
    color: '#5a759d',
  },
  dateTime: {
    label: {
      left: 45,
      top: 731,
      fontSize: 16,
      fontWeight: 'regular',
      color: '#000000',
    },
    date: {
      left: 45,
      top: 763,
      fontSize: 16,
      color: '#5a759d',
    },
    time: {
      left: 202,
      top: 763,
      fontSize: 16,
      color: '#5a759d',
    },
  },
  foundedBy: {
    label: {
      left: 45,
      top: 821,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
    },
    avatar: {
      left: 46,
      top: 857,
      size: 32,
    },
    name: {
      left: 92,
      top: 857,
      fontSize: 16,
      color: '#1e1e1e',
    },
    department: {
      left: 93,
      top: 876,
      fontSize: 14,
      fontWeight: 'light',
      color: '#000000',
    },
  },
  registeredBy: {
    label: {
      left: 47,
      top: 927,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
    },
    avatar: {
      left: 45,
      top: 961,
      size: 32,
    },
    name: {
      left: 91,
      top: 961,
      fontSize: 16,
      color: '#1e1e1e',
    },
    department: {
      left: 92,
      top: 980,
      fontSize: 14,
      fontWeight: 'light',
      color: '#000000',
    },
  },
  status: {
    label: {
      left: 47,
      top: 1042,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
    },
    value: {
      left: 78,
      top: 1078,
      fontSize: 16,
      color: '#5a759d',
    },
    icon: {
      left: 51,
      top: 1078,
      size: 18,
    },
  },
  storedLocation: {
    label: {
      left: 55,
      top: 1137,
      fontSize: 16,
      fontWeight: 'regular',
      color: '#000000',
    },
    value: {
      left: 56,
      top: 1161,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1e1e1e',
    },
  },
  doneButton: {
    left: 44.5, // Centered: (440 - 351) / 2
    top: 1223,
    width: 351,
    height: 70,
    backgroundColor: '#5a759d',
    borderRadius: 0, // Check Figma
    fontSize: 18,
    fontWeight: 'regular',
    color: '#ffffff',
  },
  divider: {
    height: 1,
    color: '#c6c5c5',
    // Positioned between sections
  },
}
```

## Assets Needed

### Icons
- Edit icon (pencil) - Already available or need to add
- Arrow icon for guest info - Already available or need to add
- Status icons - Already available (tick, down-arrow, etc.)

### Images
- Item image - From Step 1 selection or placeholder
- Staff avatars - From Step 2 selection

## Testing Checklist

- [ ] All data from Steps 1-2 displays correctly
- [ ] Date and time formatting is correct
- [ ] Staff information displays with avatars
- [ ] Status and location display correctly
- [ ] Edit icons are positioned correctly
- [ ] Edit functionality works for all fields
- [ ] Email checkbox works
- [ ] Done button validates required fields
- [ ] Done button submits data correctly
- [ ] Responsive behavior on different screen sizes
- [ ] Navigation back to previous steps works
- [ ] Progress bar shows all 3 steps completed

## Notes

- All spacing should use `scaleX` for responsiveness
- Follow existing component patterns from Steps 1-2
- Reuse existing pickers/modals for edit functionality
- Ensure consistent styling with previous steps
- Consider adding loading state during submission
- Add error handling for submission failures

