# Hestia App Implementation Plan

## Overview
This document outlines the implementation plan for the Hestia housekeeping management app based on Figma designs.

## Project Structure
```
hestia/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── theme/           # Theme and design system utilities
│   ├── utils/           # Helper functions
│   └── types/           # TypeScript type definitions
├── assets/              # Images, fonts, etc.
├── design-system.json   # Design tokens
└── App.tsx             # Root component
```

## Design System
The design system is defined in `design-system.json` and includes:
- Colors (primary, status, background, text, borders)
- Typography (fonts, sizes, weights)
- Spacing scale
- Border radius values
- Component styles
- Room status definitions

## Implementation Phases

### Phase 1: Foundation Setup ✅
- [x] Create design system JSON
- [x] Set up Expo project structure
- [x] Configure TypeScript
- [x] Set up navigation
- [ ] Create theme utilities
- [ ] Create base components

### Phase 2: Core Components
- [ ] Button component (primary, secondary, status buttons)
- [ ] Input/TextInput component
- [ ] Card component
- [ ] StatusBadge component
- [ ] SearchBar component
- [ ] Navigation bar component
- [ ] Header component
- [ ] Avatar component
- [ ] Badge component

### Phase 3: Authentication Screens
- [ ] Splash Screen
  - Logo and branding
  - "Build by Housekeepers" text
  - "For Housekeeping" text
  - Pagination indicator
- [ ] Login Screen
  - Company email input
  - Password input
  - Sign In button
  - Recover Password link
  - Language selector
  - Customer Service section

### Phase 4: Dashboard
- [ ] Dashboard Screen
  - Header with user profile
  - AM/PM toggle
  - Search bar
  - Overview Today section
  - Flagged section with status breakdown
  - StayOvers section
  - Arrivals section
  - Navigation menu (Home, Rooms, Chat, Tickets, More)

### Phase 5: Rooms Module
- [ ] Rooms List Screen
  - Search functionality
  - Room cards with status
  - Filter by type (Arrival, Departure, Stayover, Turndown)
  - Status indicators
- [ ] Room Details Screen
  - Guest information
  - Special instructions
  - Status change options
  - Notes section
  - Lost & Found section
  - Tabs (Overview, Tickets, Checklist, History)
- [ ] Status Change Modal
  - Status options (Cleaned, Inspected, Dirty, Priority, etc.)
  - Promise time selector
  - Refuse Service options

### Phase 6: Chat Module
- [ ] Chat List Screen
  - Conversation list
  - Group chats
  - Unread message indicators
  - New chat button
- [ ] Chat Detail Screen
  - Message list
  - Input field
  - Send button

### Phase 7: Tickets Module
- [ ] Tickets List Screen
  - Filter tabs (My Tickets, All, Open, Closed)
  - Ticket cards
  - Create button
- [ ] Create Ticket Screen
  - Department selection
  - Issue details
  - Location input
  - Photo upload
  - Assignment options
  - Priority selection
- [ ] Ticket Detail Screen
  - Ticket information
  - Status updates
  - Comments

### Phase 8: Additional Features
- [ ] Lost & Found Module
  - Item list
  - Register item flow
  - Status tracking
- [ ] Staff Module
  - Staff list
  - On shift view
  - Department filtering
  - Auto assign functionality
- [ ] Settings Screen
- [ ] More Menu

## Key Design Patterns

### Status Colors
- Dirty: Red (#f92424)
- In Progress: Yellow (#f0be1b)
- Cleaned: Blue (#4a91fc)
- Inspected: Green (#41d541)
- Priority: Light red background (#ffebeb) with red text

### Typography
- Primary font: Helvetica (Light, Regular, Bold)
- Secondary font: Inter (Light, Semi_Bold)
- Font sizes range from 11px to 39px

### Spacing
- Consistent spacing scale (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px)

### Components
- Cards: White/light gray background with subtle borders
- Buttons: Primary blue (#5a759d) with white text
- Inputs: White background with light gray borders
- Navigation: Bottom tab bar with icons and labels

## Technical Considerations

### Navigation
- Use React Navigation with:
  - Native Stack Navigator for main screens
  - Bottom Tab Navigator for main navigation
  - Modal presentations for overlays

### State Management
- Consider using Context API or Zustand for global state
- Local state with useState for component-specific state

### Image Assets
- Download and store Figma assets locally
- Use expo-image for optimized image loading

### Responsive Design
- Design is for iPhone 16 Pro Max (440px width)
- Ensure components scale appropriately

## Next Steps
1. Install dependencies: `npm install`
2. Create theme utilities to load design system
3. Build base components
4. Implement authentication flow
5. Build dashboard
6. Implement remaining modules

