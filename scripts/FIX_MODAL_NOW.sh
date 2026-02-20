#!/bin/bash

echo "🔧 Fixing Return Later Modal Issue..."
echo ""

# Navigate to project directory
cd /Users/malambi/dev/projects/personal-projects/hestia

echo "1️⃣ Stopping all Node processes..."
killall node 2>/dev/null || echo "   No node processes running"

echo ""
echo "2️⃣ Clearing Metro cache..."
rm -rf node_modules/.cache
echo "   ✅ Cleared node_modules/.cache"

echo ""
echo "3️⃣ Clearing Metro temp files..."
rm -rf /tmp/metro-* 2>/dev/null
rm -rf /tmp/haste-* 2>/dev/null
rm -rf $TMPDIR/react-* 2>/dev/null
echo "   ✅ Cleared temp files"

echo ""
echo "4️⃣ Clearing Watchman..."
watchman watch-del-all 2>/dev/null || echo "   ⚠️  Watchman not available (OK)"

echo ""
echo "5️⃣ Verifying files exist..."
if [ -f "src/constants/returnLaterModalStyles.ts" ]; then
  echo "   ✅ returnLaterModalStyles.ts exists"
else
  echo "   ❌ returnLaterModalStyles.ts MISSING!"
fi

if [ -f "src/components/roomDetail/ReturnLaterModal.tsx" ]; then
  echo "   ✅ ReturnLaterModal.tsx exists"
else
  echo "   ❌ ReturnLaterModal.tsx MISSING!"
fi

if [ -f "src/components/roomDetail/TimeSuggestionButton.tsx" ]; then
  echo "   ✅ TimeSuggestionButton.tsx exists"
else
  echo "   ❌ TimeSuggestionButton.tsx MISSING!"
fi

echo ""
echo "6️⃣ Starting Metro with reset cache..."
echo ""
echo "=========================================="
echo "NEXT STEPS:"
echo "=========================================="
echo "1. Wait for Metro to fully start"
echo "2. In iOS Simulator, press Cmd + R"
echo "3. Navigate to All Rooms → Tap a room"
echo "4. Tap Status button → Select 'Return Later'"
echo "5. Check console for these messages:"
echo "   🔵 Return Later selected - opening modal..."
echo "   🔵 showReturnLaterModal set to TRUE"
echo "   🟢 ReturnLaterModal rendered, visible: true"
echo "=========================================="
echo ""

npm start -- --reset-cache
