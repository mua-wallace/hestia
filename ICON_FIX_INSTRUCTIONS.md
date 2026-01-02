# App Icon Fix Instructions

## Problem
The current `icon.png` is only 53x50 pixels, which causes distortion and no padding when installed on devices. App icons need to be 1024x1024 pixels with proper padding.

## Solution

### Option 1: Use Image Editing Software (Recommended)

1. **Open your icon design** in an image editor (Photoshop, GIMP, Figma, etc.)

2. **Create a new canvas** that is 1024x1024 pixels

3. **Add padding around your icon:**
   - For iOS: Place your icon content in the center, leaving approximately 10-15% padding on all sides
   - Safe zone: ~820x820px in the center of the 1024x1024 canvas
   - This ensures the icon won't be cropped or distorted

4. **Export as PNG** with transparency support

5. **Replace** `assets/app/icon.png` with your new 1024x1024 icon

### Option 2: Use Online Tools

1. Visit an app icon generator like:
   - https://www.appicon.co/
   - https://www.makeappicon.com/
   - https://icon.kitchen/

2. Upload your current icon (53x50px)

3. The tool will generate a properly sized icon with padding

4. Download and replace `assets/app/icon.png`

### Option 3: Use the Adaptive Icon Temporarily

If `adaptive-icon.png` already has proper padding, you can temporarily copy it:

```bash
cp assets/app/adaptive-icon.png assets/app/icon.png
```

**Note:** Make sure `adaptive-icon.png` has proper padding (icon content in center 66% safe zone) before using this option.

## Verification

After updating the icon, verify the size:

```bash
file assets/app/icon.png
```

Should show: `1024 x 1024`

## Rebuild Required

After updating the icon, you'll need to:

1. **Clear build cache:**
   ```bash
   npx expo prebuild --clean
   ```

2. **Rebuild the app:**
   - For iOS: Build in Xcode or run `npx expo run:ios`
   - For Android: Build in Android Studio or run `npx expo run:android`

## Current Configuration

The `app.json` has been updated with:
- iOS icon: `./assets/app/icon.png`
- Android icon: `./assets/app/icon.png`
- Android adaptive icon: `./assets/app/adaptive-icon.png` with background color `#5a759d`

