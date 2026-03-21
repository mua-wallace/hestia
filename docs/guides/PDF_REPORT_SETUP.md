# PDF Report Generation Setup

## Required Packages

To enable PDF report generation, you need to install the following Expo packages:

```bash
npx expo install expo-print expo-file-system expo-sharing
```

## What's Implemented

1. **PDF Generation Utility** (`src/utils/generateHistoryReport.ts`)
   - Generates a beautifully formatted PDF report from history events
   - Includes room information, summary statistics, and timeline of events
   - Groups events by date (Today, Yesterday, formatted dates)

2. **Download Handler** (`src/screens/RoomDetailScreen.tsx`)
   - Handles the download report button click
   - Groups events and generates PDF
   - Shows loading state during generation
   - Handles errors gracefully

3. **UI Updates**
   - Download button shows "Generating..." during PDF creation
   - Button is disabled while generating to prevent multiple clicks

## PDF Report Features

The generated PDF includes:
- **Header**: Room number, room code, and generation date
- **Summary Section**: 
  - Total events count
  - Date range covered
  - Number of days
- **Activity Timeline**: 
  - Events grouped by date
  - Each event shows staff name, action, and timestamp
  - Visual timeline with left border for each event
  - Date separators matching the app design
- **Footer**: Copyright and generation info

## Usage

Once the packages are installed, clicking the "Download Report" button will:
1. Generate a PDF from the current history events
2. Save it with a filename like: `Room_201_History_Report_20250123.pdf`
3. Open the native share/download dialog
4. Allow users to save to files, share via email, etc.

## Notes

- The PDF uses HTML/CSS styling that's converted to PDF format
- All styling matches the app's design system
- The report is generated client-side, so no server is required
- File is saved to the device's document directory and can be shared
