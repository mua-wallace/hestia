# Hestia - Housekeeping Management App

A mobile application for housekeeping management built with Expo and React Native.

## Project structure

```
hestia/
├── src/                 # App source (components, screens, services, store, etc.)
├── assets/              # Images, fonts, icons
├── docs/                # Documentation (design, implementation, guides, architecture)
├── data/                # Reference data (CSV, JSON, PDF extracts)
├── scripts/             # Build/seed/utility scripts
├── supabase/            # Supabase config and migrations
├── design-system.json   # Design tokens
├── app.json             # Expo config
└── App.tsx              # Root component
```

See **[docs/README.md](docs/README.md)** for the full documentation index.

## Design System

The design system is defined in `design-system.json` and includes:
- Colors (primary, status, background, text, borders)
- Typography (fonts, sizes, weights)
- Spacing scale
- Border radius values
- Component styles
- Room status definitions

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

## Features

### Implemented
- ✅ Design system with JSON configuration
- ✅ Project structure and navigation setup
- ✅ Base components (Button, Input, Card, StatusBadge)
- ✅ Splash screen
- ✅ Login screen
- ✅ Dashboard screen with overview cards

### In Progress
- 🔄 Room management screens
- 🔄 Chat functionality
- 🔄 Ticket system
- 🔄 Lost & Found module
- 🔄 Staff management

## Design Tokens

The app uses a comprehensive design system defined in `design-system.json`. Key design tokens include:

### Colors
- Primary: `#5a759d`
- Status colors:
  - Dirty: `#f92424` (Red)
  - In Progress: `#f0be1b` (Yellow)
  - Cleaned: `#4a91fc` (Blue)
  - Inspected: `#41d541` (Green)

### Typography
- Primary font: Helvetica (Light, Regular, Bold)
- Secondary font: Inter (Light, Semi_Bold)
- Font sizes: 11px - 39px

## Development

### Adding New Components
1. Create component in `src/components/`
2. Use design tokens from `src/theme/`
3. Follow existing component patterns

### Adding New Screens
1. Create screen in `src/screens/`
2. Add route to `src/navigation/AppNavigator.tsx`
3. Update navigation types if needed

## Documentation

- **Getting started / setup** → [docs/guides/](docs/guides/) (e.g. `START_HERE.md`, `SUPABASE_SETUP.md`)
- **Design specs & Figma** → [docs/design/](docs/design/)
- **Implementation plans** → [docs/implementation/](docs/implementation/)
- **Architecture & refactors** → [docs/architecture/](docs/architecture/)

Full index: [docs/README.md](docs/README.md).

## Project status

Active development. See [docs/implementation/IMPLEMENTATION_PLAN.md](docs/implementation/IMPLEMENTATION_PLAN.md) for the implementation roadmap.

## License

Private project

