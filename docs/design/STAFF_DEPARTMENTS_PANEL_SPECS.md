# Staff Screen – Departments Tab & Panel (Figma)

**Figma file:** [HESTIA-APP-AND-DASHBOARD](https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1085-3083)  
**Departments layout:** [node 1085-3057](https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1085-3057) (name below icon)

This document is the single source of truth for the Staff screen (Departments tab) and the slide-in staff panel. All values below match the Figma design.

---

## 1. Screen background (Figma node 1085:3083)

- **Fill:** `#e4eefe` (full-bleed rectangle).
- **Usage:** Header/top area background for the Staff screen.

---

## 2. Header (Figma node 1085:3084)

- **Back arrow (node 1085:3086):**
  - Position: left `27px`, top `69px`.
  - Size: `14×28px` (container); chevron vector inside, rotated -90°.
  - Color: muted blue-gray (align with `#5a759d` or `#607aa1`).
- **Title “Staff” (node 1085:3085):**
  - Font: Helvetica Bold (`font-['Helvetica:Bold',sans-serif]`).
  - Size: `24px`.
  - Color: `#607aa1`.
  - Position: left `calc(50% - 151px)`, top `69px` (centered with back arrow).
  - Line height: normal, no italic, whitespace nowrap.
- **Tab row (below header):** On Shift | AM | PM | Departments | **Search icon** (right side; size `24px`, color `#5a759d`). When the search icon is tapped, the **entire tab row is replaced** by a **search input** (placeholder “Search staff and departments…”) and a **close (X)** button. Tapping X restores the tabs. The search runs across **all tabs**: staff (On Shift, AM, PM) and departments in one combined result list (sections “Staff” and “Departments”). Tapping a department in search results opens the department panel (triangle omitted when opened from search). `StaffTabs` props: `searchExpanded`, `searchQuery`, `onSearchQueryChange`, `onSearchPress`, `onSearchClose`.

---

## 3. Departments list (Figma node 1085-3057 – name below icon)

Departments are shown as a **vertical list**. Each item: **icon on top, department name directly below**. No full-width cards; icons sit directly on the screen.

- **Layout:** Single column, vertically aligned. Padding horizontal `24px`, top `12px`, bottom `24px`. Item margin bottom `20px`.
- **Each item:** Icon circle, then label **below** (left-aligned). No row layout; stacked vertically.
- **Department icon:**
  - Width: `55.482px`, height: `55.482px`, aspect-ratio: `1/1` (scale with design width 440).
  - Border radius: `37px` (full circle).
  - Background: `#ffebeb`.
  - Icon inside: ~55% of circle; tint `#F92424` where applicable (exceptions: HSK Portier, In Room Dining).
- **Department label (below icon):**
  - Font: Inter Light (300).
  - Size: `14px`.
  - Color: `#000000`.
  - Text align: left.
  - Margin top above label: `8px`.
- **Active department (when panel is open):** Same size and align; override to color `#F92424`, font Inter, font-weight `600`, line-height normal.
- **Constants:** `STAFF_DEPARTMENT_LIST` in `staffStyles.ts`.

---

## 4. Slide-in panel (below Departments tab)

Panel opens when a department is tapped. It appears **below the Departments tab** (not full height from top); triangle on the left edge points at the tapped row.

- **Panel container:**
  - Width: `280px` (scale with design width 440).
  - Background: `#ffffff`.
  - Border radius: `12px` on left only (top-left, bottom-left).
  - Shadow: `rgba(100, 131, 176, 0.4)`, offset `(-4, 0)`, blur `35px`, opacity `1`.
  - **Top:** Starts below the tab bar (e.g. `insets.top + (STAFF_TABS.container.top + height + divider) * scaleX`). Bottom: safe area inset.
- **Triangle (pointing at department name):**
  - On the left edge of the panel, vertically aligned with the **department name** (label below the icon), not the icon or row center.
  - Implementation: pass `namePosition` (measured label bounds) in `DepartmentRowPosition`; panel uses `namePosition.y + namePosition.height/2` for triangle vertical center.
  - Base (attached to panel): `12px` wide.
  - Top/bottom edges: `10px` each (left-pointing triangle).
  - Fill: `#ffffff` (same as panel).
  - Shadow: `rgba(100, 131, 176, 0.4)`, offset `(-2, 0)`, opacity `0.3`, radius `2px`.
- **Panel header:**
  - Padding: `24px` horizontal, `24px` top, `16px` bottom.
  - Divider: `1px` solid `#e3e3e3` below header.
  - Title: **"[Department name] Staff"** (e.g. "Engineering Staff", "Reception Staff"); font Helvetica Bold, `18px`, color `#1e1e1e`.
  - Right side: search icon (size `24px`, color `#5a759d`). No close (X); modal closes when user taps outside the panel (backdrop).
- **Search / filter:**
  - Search is hidden by default. Tapping the search icon **replaces** the header content: the department name is replaced by a **search input** (same position, placeholder “Search staff name”) and the search icon is replaced by a **close (X)**. Tapping X clears the search UI and restores the department name + search icon. Input focuses when shown. Filters the staff list by staff name (client-side).
- **Staff list rows:**
  - Row min height: `76px` (scaled).
  - Padding: vertical `20px`, left `37px`, right `20px`.
  - Avatar: `32×32px` circle; spacing so name starts at `83px` from panel left.
  - Name: Helvetica Bold, `16px`, color `#1e1e1e`.
  - Role/department line: Helvetica Regular, `14px`, color `#334866`, `2px` below name.
  - **Selection:** Tapping a row toggles that staff member’s selection (tick appears next to the name). **Multiple selection** is possible. A **selected count** row appears **below the header divider** when at least one staff is selected: “X staff selected” (e.g. “3 staff selected”). Styles: padding horizontal `24px`, top `10px`, bottom `12px`; font Inter Regular, `14px`, color `#334866`. Selection clears when the panel closes.

---

## 5. Figma node index

| Node ID   | Description |
|-----------|-------------|
| 1085:3057 | Staff screen with Departments tab – department list (icon, name below) |
| 1085:3083 | Screen background rectangle, fill `#e4eefe` |
| 1085:3084 | Header group (back + title) |
| 1085:3085 | Title text “Staff”, 24px, #607aa1, Helvetica Bold |
| 1085:3086 | Back chevron vector, 14×28 container at 27, 69 |

---

## 6. Implementation tokens

- **Constants:** `src/constants/staffStyles.ts` → `STAFF_HEADER`, `STAFF_DEPARTMENT_LIST`, `STAFF_DEPARTMENT_PANEL`.
- **Design width:** `440px` for scaling (`scaleX = SCREEN_WIDTH / 440`).
- **Cross-reference:** Triangle and panel shadow match InspectedStatusSlideModal (Figma node 2584-1276). Staff row layout matches Reassign modal (Figma node 1038-441).

When the build doesn’t match Figma, compare with the nodes above and this spec, then update `staffStyles.ts` and components accordingly.
