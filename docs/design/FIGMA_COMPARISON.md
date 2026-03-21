# Return Later Modal - Figma Comparison Checklist

## Figma Reference
https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1121-328&m=dev

---

## Please Check Each Item and Tell Me What's Wrong:

### 1. Modal Background
- [ ] **Expected**: White background covering screen from header bottom (232px)
- [ ] **What I see**: _____________________

### 2. Title "Return Later"
- [ ] **Expected**: Blue-gray color (#607aa1), 20px, Bold, Left aligned at 32px
- [ ] **What I see**: _____________________

### 3. Instruction Text
- [ ] **Expected**: "Add time slot for when the Guest wants you to return"
- [ ] **Color**: Dark gray (#1e1e1e), 14px, Light weight
- [ ] **What I see**: _____________________

### 4. Divider Line
- [ ] **Expected**: Thin horizontal gray line below instruction
- [ ] **What I see**: _____________________

### 5. "Suggestions" Label
- [ ] **Expected**: Small text "Suggestions", 14px, Light weight
- [ ] **What I see**: _____________________

### 6. Suggestion Buttons
- [ ] **Expected**: Four pill-shaped buttons: "10 mins", "20 mins", "30 mins", "1 Hour"
- [ ] **Style**: White background, black border (1px), rounded corners
- [ ] **What I see**: _____________________

### 7. AM/PM Toggle
- [ ] **Expected**: Centered toggle with light blue-gray background
- [ ] **Position**: Below suggestion buttons, horizontally centered
- [ ] **What I see**: _____________________

### 8. Time Picker
- [ ] **Expected**: Two scrollable columns (Hours | Minutes)
- [ ] **Style**: Selected item large/bold/blue, unselected items smaller/gray
- [ ] **What I see**: _____________________

### 9. Confirm Button
- [ ] **Expected**: Full-width blue-gray button, 107px height, white text "Confirm"
- [ ] **What I see**: _____________________

### 10. Assigned To Section
- [ ] **Expected**: "Assigned to" title, staff avatar/name, Reassign button
- [ ] **Position**: At bottom below confirm button
- [ ] **What I see**: _____________________

---

## Common Issues to Check:

### Issue A: Everything too small or too big
**Cause**: Screen size scaling issue
**Look for**: All elements proportionally wrong size

### Issue B: Elements overlapping
**Cause**: Positioning calculations wrong
**Look for**: Text on top of text, buttons covering other elements

### Issue C: Wrong colors
**Cause**: Color codes incorrect
**Look for**: Different blue, gray, or background colors

### Issue D: Modal starts at wrong position
**Cause**: Top offset wrong (should be 232px from screen top)
**Look for**: Modal covering header or too far down

### Issue E: AM/PM Toggle looks different
**Cause**: Using existing AMPMToggle component with different styling
**Look for**: Different colors, size, or position

### Issue F: Time Picker looks different
**Cause**: Using existing TimePickerWheel with different styling
**Look for**: Different font sizes, colors, or spacing

---

## Screenshot Comparison

### Take a screenshot of your app and compare with Figma:

1. Open Figma: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1121-328&m=dev
2. Take screenshot of your app's Return Later modal
3. Compare side by side

### Specific things to measure:

1. **Title position**: Should be 32px from left edge
2. **Button gaps**: Should be 12px between suggestion buttons
3. **AM/PM toggle**: Should be centered horizontally
4. **Confirm button**: Should span full width
5. **Colors**: 
   - Title: #607aa1 (blue-gray)
   - Instruction: #1e1e1e (dark gray)
   - Button borders: #000000 (black)
   - Selected button bg: #f5f5f5 (light gray)
   - Confirm button: #5a759d (blue-gray)

---

## Tell Me What's Different

Please describe what you see vs what Figma shows:

**Example responses:**
- "The title color is too dark, not blue-gray"
- "The suggestion buttons are square, not rounded"
- "The AM/PM toggle is too small"
- "Everything is shifted to the right"
- "The modal starts too high, covering the header"
- "The confirm button is not full width"
- "Time picker text is all the same size, not bold for selected"

---

**What specifically doesn't match Figma?**

