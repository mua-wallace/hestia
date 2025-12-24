# Create Ticket Screen - Design Specifications

## Overview
This document contains all design variables and styles extracted from the Figma design for the Create Ticket screen. This screen appears when the user clicks the "+ Create" button on the Tickets screen.

**Figma Design URL:** https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1085-2628

---

## Screen Dimensions
- **Design Width:** 440px
- **Screen Background:** White (#ffffff)

---

## Header Section

### Header Container
- **Height:** 133px
- **Background Color:** #e4eefe (Light blue)
- **Position:** Absolute, top: -6px (extends above screen)

### Back Button
- **Position:** 
  - Left: 27px
  - Top: 63px (relative to screen, accounting for -6px header offset)
- **Size:** 14px × 28px (rotated)
- **Rotation:** 270 degrees (pointing left)
- **Icon:** Vector arrow (back arrow icon)

### Title
- **Text:** "Create Ticket"
- **Position:**
  - Left: calc(50% - 151px) (centered with offset)
  - Top: 63px
- **Typography:**
  - Font Family: Helvetica Bold
  - Font Size: 24px
  - Color: #607aa1
  - Line Height: normal

---

## Main Content

### Heading
- **Text:** "Create a ticket"
- **Position:**
  - Left: calc(50% - 196px) (centered)
  - Top: 153px
- **Typography:**
  - Font Family: Helvetica Bold
  - Font Size: 20px
  - Color: #607aa1
  - Line Height: normal

### Select Department Label
- **Text:** "Select Department"
- **Position:**
  - Left: 24px
  - Top: 186px
- **Typography:**
  - Font Family: Inter Light
  - Font Size: 14px
  - Color: #000000 (black)
  - Line Height: normal

---

## Department Selection Grid

### Department Icon Container
- **Size:** 55.482px × 55.482px
- **Border Radius:** 37px (fully rounded)
- **Background Color:** #ffebeb (Light pink/red)
- **Layout:** 3 columns grid

### Department Positions

#### Row 1 (Top)
1. **Engineering**
   - Icon Position: Left: 50px, Top: 238px
   - Label Position: Left: 36px, Top: 306px
   - Label Text: "Engineering"
   - Label Width: 84px

2. **HSK Portier**
   - Icon Position: Left: 184px, Top: 241.26px
   - Label Position: Left: 172px, Top: 309px
   - Label Text: "HSK Portier"
   - Label Width: 79px

3. **In Room Dining**
   - Icon Position: Left: 332px, Top: 241.35px
   - Label Position: Left: 300px, Top: 309px
   - Label Text: "In Room Dining"
   - Label Width: 119.651px

#### Row 2 (Middle)
4. **Laundry**
   - Icon Position: Left: 50px, Top: 353.91px
   - Label Position: Left: 47px, Top: 422px
   - Label Text: "Laundry"
   - Label Width: 63px

5. **Concierge**
   - Icon Position: Left: 184px, Top: 353.91px
   - Label Position: Left: 174px, Top: 422px
   - Label Text: "Concierge"
   - Label Width: 75px

6. **Reception**
   - Icon Position: Left: 332px, Top: 353.91px
   - Label Position: Left: 322px, Top: 422px
   - Label Text: "Reception"
   - Label Width: 76px

#### Row 3 (Bottom)
7. **IT**
   - Icon Position: Left: 50px, Top: 468.68px
   - Label Position: Left: 71px, Top: 529px
   - Label Text: "IT"
   - Label Width: 15px

### Department Label Typography
- **Font Family:** Inter Light
- **Font Size:** 14px
- **Color:** #000000 (black)
- **Line Height:** normal
- **Text Alignment:** Left (varies by department)

---

## Divider

### Divider Line
- **Position:**
  - Left: calc(50% + 4px) (centered with slight offset)
  - Top: 586px
- **Width:** 448px
- **Height:** 1px (0.5px stroke)
- **Color:** #e3e3e3 (Light grey)

---

## AI Create Ticket Button Section

### Button Container
- **Position:**
  - Left: calc(50% - 76px) (centered: 152px width / 2)
  - Top: 618px
- **Width:** 152px
- **Height:** 74px (includes button + beta label)

### Create Ticket Button
- **Position:** Relative to container (left: 0, top: 0)
- **Size:**
  - Width: 152px
  - Height: 60px
- **Border:**
  - Width: 1px
  - Color: #ff4dd8 (Pink)
  - Style: Solid
- **Border Radius:** 45px (fully rounded)
- **Background:** Transparent

### Button Text
- **Text:** "Create Ticket"
- **Position:**
  - Left: 24px (relative to button)
  - Top: 22px (relative to button)
- **Typography:**
  - Font Family: Helvetica Bold
  - Font Size: 16px
  - Color: #5a759d
  - Width: 104px
  - Line Height: normal

### AI Badge
- **Position:**
  - Left: 99px (relative to button)
  - Top: 44px (relative to button)
- **Size:**
  - Width: 29px
  - Height: 30px
- **Border Radius:** 14.5px (circular)
- **Background:** #ffffff (white)

### AI Badge Text
- **Text:** "AI"
- **Position:**
  - Left: 106px (relative to button)
  - Top: 51px (relative to button)
- **Typography:**
  - Font Family: Helvetica Bold
  - Font Size: 12px
  - Width: 15px
  - **Gradient Colors:**
    - Start: #ff46a3 (Pink)
    - End: #4a91fc (Blue)
  - **Note:** Requires LinearGradient component for implementation

### Beta Label
- **Text:** "BETA"
- **Position:**
  - Left: calc(50% - 14px) (centered)
  - Top: 686px
- **Typography:**
  - Font Family: Helvetica Bold
  - Font Size: 9px
  - Color: #ff4dd8 (Pink)
  - Width: 28px
  - Line Height: normal

### Description Text
- **Text:** "AI detects issues and auto-creates tickets for the right department no manual reporting needed."
- **Position:**
  - Left: 220px (centered with translate-x: -50%)
  - Top: 722px
- **Typography:**
  - Font Family: Helvetica Light
  - Font Size: 14px
  - Color: #000000 (black)
  - Width: 318px
  - Text Alignment: Center
  - Line Height: normal
  - White Space: pre-wrap

---

## Color Palette

### Primary Colors
- **Background:** #ffffff (White)
- **Header Background:** #e4eefe (Light blue)

### Text Colors
- **Primary Text:** #000000 (Black)
- **Secondary Text:** #607aa1 (Blue-grey)
- **Heading Text:** #607aa1 (Blue-grey)
- **Button Text:** #5a759d (Blue-grey)

### Accent Colors
- **Department Icon Background:** #ffebeb (Light pink/red)
- **AI Button Border:** #ff4dd8 (Pink)
- **Beta Label:** #ff4dd8 (Pink)
- **AI Gradient Start:** #ff46a3 (Pink)
- **AI Gradient End:** #4a91fc (Blue)

### Border/Divider Colors
- **Divider:** #e3e3e3 (Light grey)

---

## Typography System

### Font Families
- **Primary:** Helvetica
  - Variants: Bold, Light
- **Secondary:** Inter
  - Variants: Light

### Font Sizes
- **Extra Small:** 9px (Beta label)
- **Small:** 12px (AI badge text)
- **Base:** 14px (Labels, descriptions)
- **Large:** 16px (Button text)
- **Extra Large:** 20px (Heading)
- **2X Large:** 24px (Header title)

### Font Weights
- **Light:** 300 (Inter Light, Helvetica Light)
- **Bold:** 700 (Helvetica Bold)

### Line Heights
- **Normal:** normal (default line height)

---

## Spacing & Layout

### Header
- **Height:** 133px
- **Back Button:** 27px from left, 63px from top
- **Title:** Centered with -151px offset

### Content Spacing
- **Heading Top:** 153px
- **Select Department Label Top:** 186px
- **First Department Row Top:** 238px
- **Second Department Row Top:** 353.91px
- **Third Department Row Top:** 468.68px

### Department Grid Spacing
- **Horizontal Spacing:** ~134px between columns (50px, 184px, 332px)
- **Vertical Spacing:** ~115px between rows
- **Icon Size:** 55.482px
- **Label to Icon Spacing:** ~68px vertical

### Button Section
- **Divider Top:** 586px
- **Button Top:** 618px
- **Beta Label Top:** 686px
- **Description Top:** 722px

---

## Border Radius

- **Department Icons:** 37px (fully rounded)
- **AI Button:** 45px (fully rounded)
- **AI Badge:** 14.5px (circular)

---

## Component Specifications

### Department Icon Component
```typescript
{
  size: 55.482px,
  borderRadius: 37px,
  backgroundColor: '#ffebeb',
  // Icon positioned within container
}
```

### AI Button Component
```typescript
{
  width: 152px,
  height: 60px,
  borderRadius: 45px,
  borderWidth: 1px,
  borderColor: '#ff4dd8',
  backgroundColor: 'transparent',
  // Contains text and AI badge
}
```

### AI Badge Component
```typescript
{
  width: 29px,
  height: 30px,
  borderRadius: 14.5px,
  backgroundColor: '#ffffff',
  // Contains gradient text "AI"
}
```

---

## Design Tokens Summary

### Colors
```json
{
  "background": "#ffffff",
  "headerBackground": "#e4eefe",
  "textPrimary": "#000000",
  "textSecondary": "#607aa1",
  "departmentIconBg": "#ffebeb",
  "aiButtonBorder": "#ff4dd8",
  "aiGradientStart": "#ff46a3",
  "aiGradientEnd": "#4a91fc",
  "divider": "#e3e3e3"
}
```

### Typography
```json
{
  "fontFamilies": {
    "primary": "Helvetica",
    "secondary": "Inter"
  },
  "fontSizes": {
    "xs": "9px",
    "sm": "12px",
    "base": "14px",
    "lg": "16px",
    "xl": "20px",
    "2xl": "24px"
  },
  "fontWeights": {
    "light": "300",
    "bold": "700"
  }
}
```

### Spacing
```json
{
  "headerHeight": "133px",
  "departmentIconSize": "55.482px",
  "departmentGridSpacing": {
    "horizontal": "134px",
    "vertical": "115px"
  }
}
```

### Border Radius
```json
{
  "departmentIcon": "37px",
  "aiButton": "45px",
  "aiBadge": "14.5px"
}
```

---

## Implementation Notes

1. **Responsive Scaling:** The design uses a 440px width. Implement scaling using `scaleX` factor based on actual screen width.

2. **Gradient Text:** The "AI" badge text uses a gradient from #ff46a3 to #4a91fc. This requires a LinearGradient component (e.g., `expo-linear-gradient` or `react-native-linear-gradient`).

3. **Absolute Positioning:** Most elements use absolute positioning. Consider using a container with relative positioning for easier layout management.

4. **Back Button Rotation:** The back arrow is rotated 270 degrees. Use `transform: [{ rotate: '270deg' }]` in React Native.

5. **Centered Elements:** Several elements use `calc(50% - offset)` for centering. In React Native, use `left: '50%'` with `marginLeft: -offset` or `transform: [{ translateX: -offset }]`.

6. **Department Icons:** Each department has a custom icon. Ensure icons are properly sized and centered within the 55.482px containers.

7. **Font Weights:** Use numeric font weights (300 for light, 700 for bold) in React Native.

---

## Assets Required

- Back arrow icon (vector)
- Engineering department icon
- HSK Portier department icon
- In Room Dining department icon
- Laundry department icon
- Concierge department icon
- Reception department icon
- IT department icon (computer desktop icon)

All icons should be provided as SVG or PNG with appropriate sizing for the 55.482px containers.

