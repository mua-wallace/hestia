# All Rooms Screen - Design Specifications

## Extracted from Figma Design
**Design URL**: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1-1172&m=dev

## Header Section
- **Total Height**: 217px (133px blue background + 84px for search area)
- **Blue Background**: `#e4eefe`, height 133px
- **Back Arrow**: 
  - Position: left 27px, top 69px
  - Size: 14px × 28px
  - Rotation: 270deg (pointing left)
  - Color: `#607aa1` (tint)
- **Title "All Rooms"**:
  - Position: left 27px (+ 41px margin when back button shown), top 69px
  - Font: Helvetica Bold, 24px
  - Color: `#607aa1`
- **AM/PM Toggle**:
  - Position: right 32.5px, top 65px
  - Width: 121px, height 35.243px
  - Background: white, rounded 68px
  - Selected state: `#5a759d` background, 64.612px wide, 30.544px high
  - AM text: Helvetica Bold, 15px, white (when selected)
  - PM text: Helvetica Light, 15px, `#b1afaf` (when not selected)

## Search Bar Section
- **Position**: left 26px, top 158px (25px below blue header)
- **Search Bar**:
  - Width: 301px, height 59px
  - Background: `#f1f6fc`
  - Border radius: 82px
  - Padding: 20px horizontal
- **Search Placeholder**:
  - Text: "Search" (Semi Bold) + " Rooms, Guests, etc" (Light)
  - Font: Inter, 13px
  - Color: `#b1afaf`
  - Opacity: 0.36
- **Search Icon**:
  - Position: Right side inside search bar
  - Size: 19px × 19px
  - Rotation: 270deg
  - Color: `#b1afaf` (tint)
- **Filter Icon**:
  - Position: Right of search bar, with 12px gap
  - Size: 26px × 26px
  - Color: `#5a759d` (tint)

## Room Cards
### Card Container
- **Background**: 
  - Normal: `#f9fafc`
  - Priority: `rgba(249, 36, 36, 0.08)`
- **Border**: 
  - Normal: `#e3e3e3`, 1px
  - Priority: `#f92424`, 1px
- **Border Radius**: 9px
- **Margins**: 7px horizontal
- **Heights**:
  - Arrival/Departure with notes: 292px
  - Standard with notes: 222px
  - Standard without notes: 177px

### Card Header (Top Row)
- **Padding**: 14px horizontal, 17px top
- **Room Icon Badge**:
  - Position: left 14px, top 24.59px
  - Size: 22.581px × 29.348px
- **Room Number**:
  - Position: left 72px (from screen), top 17px (from card top)
  - Font: Helvetica Bold, 21px
  - Color: `#334866`
- **Room Type**:
  - Position: Next to room number
  - Font: Helvetica Light, 12px
  - Color: `#334866`
- **Priority Count**:
  - Font: Helvetica Light, 12px
  - Color: `#334866`
  - Position: Varies per guest row
- **Category Label**:
  - Position: left 70px, top 40px (from card top)
  - Font: Helvetica Bold, 16px
  - Color: `#334866`
- **Chevron Arrow**:
  - Position: right 15px, top 29px
  - Size: 7px × 14px

### Guest Information Section
- **Guest Icon**: 16px × 16px, color `#5a759d` (tint)
- **Guest Name**:
  - Font: Helvetica Bold, 14px
  - Color: `#1e1e1e` (black)
- **Date Range**:
  - Font: Helvetica Light, 14px
  - Color: `#1e1e1e`
- **Time (ETA/EDT)**:
  - Font: Helvetica Regular, 14px
  - Color: `#1e1e1e`
- **Guest Count**:
  - Font: Helvetica Light, 14px
  - Color: `#1e1e1e`
  - Icon: 16px × 16px
- **Divider** (for Arrival/Departure):
  - Position: After first guest, at top 75px
  - Height: 1px
  - Color: `#e3e3e3`

### Staff Section
- **Position**: left 245px, top 22px (absolute)
- **Avatar**:
  - Size: 35px × 35px
  - Border radius: 17.5px
- **Initials Circle** (when no avatar):
  - Size: 35px × 35px
  - Background: `#5a759d` (primary.main)
  - Text: Helvetica Bold, 17px, white
- **Staff Name**:
  - Font: Helvetica Bold, 13px
  - Color: `#1e1e1e`
  - Width: 104px (max)
- **Status Text**:
  - Font: Helvetica Light, 12px
  - Color: Dynamic based on status
    - Not Started: `#1e1e1e`
    - Started: `#1e1e1e`
    - Finished (green): `#41d541`
    - Finished (red): `#f92424`
- **Promise Time**:
  - Font: Helvetica Bold, 13px
  - Color: `#1e1e1e`
  - Text: "Promise time: HH:MM"
- **Vertical Divider**:
  - Position: left 227px, top 11px
  - Size: 1px × 50.5px
  - Color: `#e3e3e3`

### Status Button
- **Position**: right 14px, top 50px (absolute)
- **Size**: 134px × 70px
- **Border Radius**: 35px
- **Background Colors**:
  - Dirty: `#f92424` (red)
  - In Progress: `#ffc107` (yellow/orange)
  - Cleaned: `#5a759d` (blue)
  - Inspected: `#41d541` (green)
- **Icon**: 30px × 30px, white tint
- **Chevron**: right 12px, 7px × 14px

### Notes Section
- **Position**: bottom 12px, left 19px (absolute)
- **Container**:
  - Height: 54px
  - Background: white (`#ffffff`)
  - Border radius: 10px
  - Padding: 8px vertical, 12px horizontal
- **Notes Icon**: 31.974px × 31.974px
- **Rushed Icon**: 31.974px × 31.974px (when applicable)
- **Count Badge**:
  - Position: left 50px, top 12px (absolute within notes section)
  - Size: 20.455px × 20.455px
  - Background: `#f92424` (red circle)
  - Text: Helvetica Light, 15px, white
- **Notes Text**:
  - Font: Helvetica Bold, 14px
  - Color: `#5a759d`
  - Text: "Rushed and notes" or "X notes"

## Colors Used
- Background Primary: `#ffffff` (white)
- Background Secondary: `#f9fafc` (light gray)
- Background Blue: `#e4eefe` (light blue for header)
- Background Input: `#f1f6fc` (light blue for search)
- Border Normal: `#e3e3e3` (light gray)
- Border Priority: `#f92424` (red)
- Priority Background: `rgba(249, 36, 36, 0.08)` (light red overlay)
- Text Primary: `#1e1e1e` (almost black)
- Text Secondary: `#334866` (dark blue-gray)
- Text Tertiary: `#607aa1` (medium blue-gray)
- Text Light: `#b1afaf` (light gray)
- Primary Blue: `#5a759d`
- Success Green: `#41d541`
- Warning Yellow: `#ffc107`
- Danger Red: `#f92424`

## Typography
- **Primary Font**: Helvetica (with fallback to Inter for certain elements)
- **Weights**:
  - Light: 300
  - Regular: 400
  - Semi Bold: 600 (for search placeholder)
  - Bold: 700

## Spacing Scale
- **Margins**: 7px (card horizontal), 16px (card bottom)
- **Padding**: 14px (card horizontal), 17px (card top), 20px (search bar)
- **Gaps**: 12px (search to filter), 8px (icon to text)
- **Border Radius**: 9px (card), 35px (status button), 82px (search bar)

## Implementation Notes
1. All measurements use `scaleX` (SCREEN_WIDTH / 440) for responsive scaling
2. Design width reference: 440px (iPhone 16 Pro Max width)
3. Back button is conditional based on navigation source:
   - Show when navigating from Home category cards
   - Hide when accessing from Rooms tab
4. Search placeholder uses custom Text overlay to support bold/light formatting
5. Priority rooms have both red border and light red background overlay
6. Arrival/Departure cards are taller (292px) to accommodate two guest sections
7. Cards with notes have additional height (222px vs 177px)

