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

### App Icon Requirements

**iOS Icon (`icon.png`):**
- **Size**: Must be exactly 1024x1024 pixels
- **Format**: PNG with transparency support
- **Padding**: The icon content should be centered with approximately 10-15% padding on all sides (safe zone: ~820x820px in the center)
- **Content**: Should not extend to the edges to prevent distortion and cropping

**Android Adaptive Icon (`adaptive-icon.png`):**
- **Size**: Must be exactly 1024x1024 pixels
- **Format**: PNG with transparency support
- **Padding**: The icon content should be in the safe zone (center 66% = ~675x675px), leaving 17% padding on each side
- **Background**: Configured in `app.json` as `#5a759d`
- **Content**: Should not extend beyond the safe zone to prevent clipping on different device shapes

**Current Status:**
- ⚠️ `icon.png` is currently 53x50px - needs to be resized to 1024x1024px with proper padding
- ✅ `adaptive-icon.png` is correctly sized at 1024x1024px

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

