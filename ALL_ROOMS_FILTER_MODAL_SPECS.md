# All Rooms Filter Modal - Design Specifications

## Extracted from Figma Design
**Design URL**: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1966-3906&m=dev

## Overview
The All Rooms Filter Modal is displayed in AM shift mode on the All Rooms screen. It provides comprehensive filtering options organized into three main sections.

## Modal Container
- **Position**: Centered on screen with blur overlay background
- **Width**: 90% of screen width, max 400px
- **Height**: 75% of screen height
- **Background**: White (`#FFFFFF`)
- **Border Radius**: 20px
- **Layout**: Flex column with header, scrollable content, and fixed footer

## Header Section
- **Title**: "Rooms Filter"
  - Font: Primary font family, Bold, 20px
  - Color: Primary text color
  - Padding: 24px horizontal, 24px top, 16px bottom
- **Border**: 1px solid `#E5E5E5` at bottom

## Scrollable Content Area
- **ScrollView**: 
  - Flex: 1 (takes available space)
  - Shows vertical scroll indicator: true
  - Nested scroll enabled: true
  - Content padding bottom: 12px
- **Sections**: Three main filter sections with spacing

## Section 1: Housekeeping Status
- **Title**: "Housekeeping Status"
  - Font: Primary font, Semi Bold, 16px
  - Color: Primary text color
  - Margin bottom: 16px

### Filter Options (5 total):
1. **Dirty**
   - Icon: Red circle (`#f92424`)
   - Label: "Dirty"
   - Count: "X Rooms" (displayed when count > 0)
   - Checkbox: Square, unchecked by default

2. **In Progress**
   - Icon: Yellow circle (`#f0be1b`)
   - Label: "In Progress"
   - Count: "X Rooms"
   - Checkbox: Square

3. **Cleaned**
   - Icon: Blue circle (`#4a91fc`)
   - Label: "Cleaned"
   - Count: "X Rooms"
   - Checkbox: Square

4. **Inspected**
   - Icon: Green circle (`#41d541`)
   - Label: "Inspected"
   - Count: "X Rooms"
   - Checkbox: Square

5. **Priority**
   - Icon: Red running person icon (no circular background)
   - Label: "Priority"
   - Count: "X Rooms"
   - Checkbox: Square

### See More/Less Toggle
- **Text**: "see more" (when collapsed) / "see less" (when expanded)
- **Icon**: Down arrow chevron (rotates 180deg when expanded)
- **Color**: `#4a91fc` (blue)
- **Font**: Primary font, Regular, 14px
- **Behavior**: 
  - Initially shows first 5 options
  - Clicking expands to show all options
  - Icon rotates to indicate expanded state
  - Text changes to "see less" when expanded

## Section 2: Front Office Status
- **Title**: "Front Office Status"
  - Font: Primary font, Semi Bold, 16px
  - Color: Primary text color
  - Margin bottom: 16px

### Filter Options (5 total):
1. **Arrivals**
   - Icon: Person with arrow pointing left
   - Icon Color: `#41d541` (green)
   - Label: "Arrivals"
   - Count: "X" (displayed when count > 0)
   - Checkbox: Square

2. **Departures**
   - Icon: Person with arrow pointing right
   - Icon Color: `#f92424` (red)
   - Label: "Departures"
   - Count: "X"
   - Checkbox: Square

3. **Stayover with linen**
   - Icon: Person with bedding symbol
   - Icon Color: `#1e1e1e` (dark)
   - Label: "Stayover with linen"
   - Count: Not displayed
   - Checkbox: Square

4. **Stayover no linen**
   - Icon: Person with padlock symbol
   - Icon Color: `#1e1e1e` (dark)
   - Label: "Stayover no linen"
   - Count: Not displayed
   - Checkbox: Square

5. **Turn Down**
   - Icon: Person with stars/sparkles
   - Icon Color: `#4a91fc` (blue)
   - Label: "Turn Down"
   - Count: "X"
   - Checkbox: Square

### See More/Less Toggle
- Same behavior as Housekeeping Status section
- Shows first 5 options initially
- Expands to show all when "see more" is clicked

## Section 3: Reservations Status
- **Title**: "Reservations Status"
  - Font: Primary font, Semi Bold, 16px
  - Color: Primary text color
  - Margin bottom: 16px

### Filter Options (2 total):
1. **Occupied**
   - Icon: Person with checkmark
   - Icon Color: `#1e1e1e` (dark)
   - Label: "Occupied"
   - Count: Not displayed
   - Checkbox: Square

2. **Vacant**
   - Icon: Person with 'x' mark
   - Icon Color: `#1e1e1e` (dark)
   - Label: "Vacant"
   - Count: Not displayed
   - Checkbox: Square

**Note**: This section does NOT have a "see more" toggle (only 2 options)

## Filter Row Layout
Each filter option row contains:
- **Checkbox**: Left side, square, 22px size
- **Icon Container**: 
  - 24px × 24px
  - Circular background for colored icons (status indicators)
  - Icon size: 16px × 16px for circular, 24px × 24px for regular
  - White tint for circular icons, colored tint for regular icons
- **Label**: 
  - Font: Primary font, Regular, 16px
  - Color: Primary text color
  - Flex: 1 (takes remaining space)
  - Margin left: 12px from icon
- **Count** (when applicable):
  - Font: Primary font, Regular, 16px
  - Color: `#A9A9A9` (gray)
  - Format: "X Rooms" or "X"
  - Margin left: 8px from label

## Footer Section
- **Border**: 1px solid `#E5E5E5` at top
- **Padding**: 20px horizontal, 24px bottom, 20px top
- **Alignment**: Center

### See Rooms Button
- **Component**: SeeRoomsButton (reusable)
- **Width**: 231px
- **Height**: 66.287px
- **Border Radius**: 40px
- **Background**: `#5A759D` (blue-gray)
- **Text**: "See Rooms"
  - Font: Primary font, Bold, 18px
  - Color: White
- **Badge**: 
  - Position: Bottom right, overlapping button edge
  - Background: White
  - Border: 2px solid `#5A759D`
  - Border Radius: 12px
  - Min Width: 24px
  - Height: 24px
  - Padding: 8px horizontal
  - Text: Filtered room count
    - Font: Primary font, Bold, 12px
    - Color: `#5A759D`
  - Shadow: rgba(0, 0, 0, 0.1), offset (0, 2), radius 4, elevation 3

## Interaction Behavior
1. **Scroll**: Content area is scrollable when content exceeds available height
2. **See More/Less**: 
   - Toggles between showing first 5 items and all items
   - Icon rotates 180 degrees when expanded
   - Text changes between "see more" and "see less"
3. **Filter Selection**: 
   - Checkboxes toggle filter state
   - Filters are applied when "See Rooms" button is clicked
4. **Modal Close**: 
   - Click outside modal (blur overlay)
   - Click filter icon (hamburger menu) in top right
   - Back button (if applicable)

## Colors Used
- Background: `#FFFFFF` (white)
- Border: `#E5E5E5` (light gray)
- Text Primary: Primary text color from theme
- Text Secondary: `#A9A9A9` (gray for counts)
- See More Text/Icon: `#4a91fc` (blue)
- Status Colors:
  - Dirty: `#f92424` (red)
  - In Progress: `#f0be1b` (yellow)
  - Cleaned: `#4a91fc` (blue)
  - Inspected: `#41d541` (green)
  - Arrivals: `#41d541` (green)
  - Departures: `#f92424` (red)
  - Turn Down: `#4a91fc` (blue)

## Typography
- **Primary Font**: Theme primary font family
- **Weights**:
  - Regular: 400 (labels, counts)
  - Semi Bold: 600 (section titles)
  - Bold: 700 (header title, button text, badge text)

## Spacing
- **Section Padding**: 20px horizontal, 20px top, 12px bottom
- **Row Padding**: 12px vertical
- **Icon Margin**: 12px left from checkbox
- **Label Margin**: 12px left from icon
- **Count Margin**: 8px left from label
- **See More Padding**: 12px vertical, 4px gap between text and icon

## Implementation Notes
1. Modal is only shown in AM shift mode on AllRoomsScreen
2. PM shift uses the standard HomeFilterModal
3. All measurements use `scaleX` (SCREEN_WIDTH / 440) for responsive scaling
4. ScrollView enables vertical scrolling when content exceeds modal height
5. "See more" functionality collapses/expands sections to manage content visibility
6. Filter counts are calculated from actual room data
7. Badge count shows actual filtered room count when filters are applied
