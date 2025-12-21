# Assets Structure

This directory contains all static assets for the Hestia application, organized by type for better maintainability and navigation.

## Directory Structure

```
assets/
├── app/               # App configuration assets
│   ├── icon.png       # App icon (used in Expo config)
│   ├── adaptive-icon.png  # Android adaptive icon
│   ├── splash.png     # Splash screen image
│   └── favicon.png    # Web favicon
│
├── icons/             # UI icons
│   ├── dropdown-arrow.png   # Dropdown/chevron arrow icon (18x9px)
│   ├── recover-arrow.png    # Recovery/navigation arrow (8x17px)
│   └── phone-icon.png       # Phone/call icon
│
└── logos/             # Brand logos
    ├── logo.png                    # Main Hestia logo (used on splash screen)
    ├── header-logo.png             # Header logo variant
    └── customer-service-logo.png   # Customer service section logo
```

## Usage Guidelines

### Importing Assets

**Icons:**
```typescript
import { Image } from 'react-native';
<Image source={require('../assets/icons/dropdown-arrow.png')} />
```

**Logos:**
```typescript
<Image source={require('../assets/logos/header-logo.png')} />
```

**App Assets:**
These are primarily referenced in `app.json` configuration:
```json
"icon": "./assets/app/icon.png"
```

## Adding New Assets

1. **Icons**: Place small UI icons in `assets/icons/`
2. **Logos**: Place brand/company logos in `assets/logos/`
3. **App Config**: Place app-level assets (splash, icon) in `assets/app/`

## File Naming Convention

- Use kebab-case: `dropdown-arrow.png`, `customer-service-logo.png`
- Be descriptive: Name files based on their purpose, not appearance
- Include dimensions in comments when relevant for developer reference

## Maintenance

- Keep assets optimized (compressed) for better app performance
- Use appropriate formats: PNG for transparency, JPG for photos
- Document any special requirements or dimensions in this README

