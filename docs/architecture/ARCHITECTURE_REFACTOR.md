# Hestia – Architecture Refactor Proposal

## 1. Current State Analysis

### 1.1 Folder Structure (Current)

```
/src
  /config          → supabase.config.ts
  /contexts        → AuthContext.tsx
  /lib             → supabase.ts (single client)
  /navigation      → AppNavigator.tsx, types.ts
  /screens         → 18 screens (flat)
  /components      → mixed: shared/, roomDetail/, allRooms/, home/, navigation/, staff/, more/, lostAndFound/, chat/, tickets/ + root
  /services        → api.ts, auth.ts, data.ts, allRooms.ts, users.ts, index.ts
  /hooks           → useHomeFilters.ts only
  /utils           → shiftUtils, formatting, defaultTasks, etc.
  /constants       → allRoomsStyles, roomTypeConfigs, staffStyles, checklistStyles, etc.
  /types           → allRooms, roomDetail, staff, supabase, filter, home, etc. + index.ts
  /data            → mock* (mockAllRoomsData, mockHomeData, mockChatData, mockTicketsData, etc.)
  /theme           → index.ts (design-system.json)
```

### 1.2 Findings

| Area | Status | Notes |
|------|--------|--------|
| **Supabase** | Partially centralized | Client in `lib/supabase.ts`; queries in `services/allRooms.ts` and `services/auth.ts`. **UI still calls Supabase**: `HomeScreen` (user profile fetch), `UserProfileScreen` (avatar upload + user update). |
| **Screens** | Too large, logic in UI | `AllRoomsScreen` ~1007 lines, `CreateTicketFormScreen` ~1084, `ArrivalDepartureDetailScreen` ~842, `ChatDetailScreen` ~839, `HomeScreen` ~715, `RoomDetailScreen` ~726. Business logic and state live inside screens. |
| **Data** | Mock + Supabase mix | `dataService` uses Supabase when configured and falls back to mock. Screens still import mock data for initial state (e.g. `mockHomeData`, `mockAllRoomsData`). |
| **Hooks** | Minimal | Only `useHomeFilters`. No `useAuth` export from a hooks layer (auth lives in context), no `useUser`, no generic `useFetch`. |
| **Types** | Scattered | Feature types in `/types`; `types/index.ts` re-exports from `@navigation/types` and core domain types. |
| **Theme** | Single file | `theme/index.ts` + `design-system.json`; no `/constants` for theme/colors (constants are style/config snippets). |
| **Navigation** | React Navigation | No Expo Router; stack + bottom tabs in `AppNavigator.tsx`. |

### 1.3 Supabase Usage in UI (to move)

- **HomeScreen**: `supabase.from('users').select(...)` for profile (full_name, avatar_url, roles, departments). Should use a **user service** + **useUser** hook.
- **UserProfileScreen**: `supabase.storage.from('avatars').upload`, `getPublicUrl`, `supabase.from('users').update`, `supabase.auth.updateUser`. Should use **user service** (e.g. `updateAvatar(userId, file)`).

---

## 2. Target Architecture

### 2.1 Folder Structure (Target)

```
/src
  /app
    App.tsx                    → Root component (providers + navigator)
    navigation/
      AppNavigator.tsx
      types.ts
    providers.tsx              → SafeAreaProvider, AuthProvider, etc. (optional wrapper)
  /features
    /auth
      components/              → (none or minimal)
      screens/
        LoginScreen.tsx
        SplashScreen.tsx
      hooks/                   → (useAuth stays in context, re-exported from hooks)
      services/                → auth already in global services
      types.ts
    /dashboard                  (home)
      components/               → HomeHeader, CategoryCard, HomeFilterModal, etc.
      screens/
        HomeScreen.tsx
      hooks/
        useHomeFilters.ts
      services/                 → (home data via dataService)
      types.ts                  → re-export or extend home.types
    /rooms
      components/               → AllRooms*, RoomCard, StatusChangeModal, etc. + roomDetail/*
      screens/
        AllRoomsScreen.tsx
        RoomDetailScreen.tsx
        ArrivalDepartureDetailScreen.tsx
      hooks/
        useAllRooms.ts          → fetch rooms, refresh, filters
      services/                 → allRooms service (or keep in global services)
      types.ts                  → allRooms.types, roomDetail.types
    /chat
      components/
      screens/
        ChatScreen.tsx
        ChatDetailScreen.tsx
      hooks/
      services/
      types.ts
    /tickets
      components/
      screens/
        TicketsScreen.tsx
        CreateTicketScreen.tsx
        CreateTicketFormScreen.tsx
      hooks/
      services/
      types.ts
    /lostAndFound
      components/
      screens/
        LostAndFoundScreen.tsx
      hooks/
      services/
      types.ts
    /staff
      components/
      screens/
        StaffScreen.tsx
      hooks/
      services/
      types.ts
    /settings
      components/
      screens/
        SettingsScreen.tsx
      hooks/
      services/
      types.ts
    /user
      components/
      screens/
        UserProfileScreen.tsx
      hooks/
        useUser.ts             → profile from session + Supabase
      services/                 → user profile + avatar (or in global)
      types.ts
  /components                   → Shared UI only
    Button.tsx, Input.tsx, Card.tsx, SearchInput.tsx, StatusBadge.tsx
    shared/                     → TaskCard, GuestInfoDisplay, DatePickerWheel, etc.
    navigation/                 → BottomTabBar, TabBarItem
  /services                     → Global only
    api.ts
    auth.ts
    data.ts
    allRooms.ts
    users.ts
    user.ts                     → NEW: getProfile(userId), updateAvatar(userId, file)
    index.ts
  /hooks                        → Global hooks
    useAuth.ts                  → re-export from AuthContext or thin wrapper
    useUser.ts                  → NEW: session + profile (calls userService)
    useFetch.ts                 → NEW: generic async load + loading/error state
    index.ts
  /utils
    (unchanged)
  /constants
    theme.ts                    → re-export from theme or move theme here
    colors.ts                   → from design-system
    allRoomsStyles.ts
    ... (rest of constants)
  /types                        → Global + re-exports
    index.ts
    supabase.ts
    allRooms.types.ts
    roomDetail.types.ts
    home.types.ts
    filter.types.ts
    ... (navigation types stay in app/navigation/types.ts)
  /lib
    supabase.ts                 → Single client export
  /store                        → (optional, for future global state)
  /config                       → Keep for env/config
    supabase.config.ts
  /data                         → Mock data (keep for fallback only; do not import in screens)
    mockAllRoomsData.ts
    mockHomeData.ts
    ...
```

**Note:** Expo Router is **not** introduced; navigation remains React Navigation. The `/app` folder holds the app shell (root component + navigator), not file-based routes.

### 2.2 Supabase Refactor Rules

- **Single client**: `lib/supabase.ts` – already done.
- **Queries only in services**: Add `services/user.ts` with `getProfile(userId)`, `updateAvatar(userId, fileUri)`; use typed responses and error handling.
- **No Supabase in UI**: Remove all `supabase` and `isSupabaseConfigured` imports from screens; use `useUser()` and `userService.updateAvatar()`.

### 2.3 Components Rules

- **Shared UI** in `/components` (and `/components/shared`, `/components/navigation`).
- **Feature UI** in `/features/<feature>/components`.
- Screens stay thin: delegate to hooks and feature components; no business logic in screens beyond wiring.

### 2.4 Hooks

- **useAuth()**: Already in AuthContext; re-export from `hooks/useAuth.ts` for a single import path.
- **useUser()**: New hook that uses `useAuth().session` and `userService.getProfile(session.user.id)`, returns `{ user, loading, error, refetch }` and optionally `updateAvatar`.
- **useFetch()**: Generic `useFetch(fn, deps)` returning `{ data, loading, error, refetch }` for consistent loading/error handling.

### 2.5 Code Quality

- Remove **direct mock imports** from screens; screens get data from `dataService` or hooks (which use services). Keep mock only inside `dataService` fallback.
- **Strong typing**: Use existing types; ensure service return types are typed.
- **Loading + error states**: Use `useFetch` or per-feature hooks so every data-driven screen shows loading and error UI.

### 2.6 Large Files (follow-up)

- **AllRoomsScreen**: Extract filters + list + modals into custom hooks (`useAllRooms`, `useAllRoomsFilters`) and subcomponents; keep screen under ~300 lines.
- **CreateTicketFormScreen / ChatDetailScreen / RoomDetailScreen / ArrivalDepartureDetailScreen**: Same idea – extract hooks and sections into components; no single file >300 lines where feasible.

---

## 3. Implementation Plan

1. **Centralize Supabase usage**
   - Add `services/user.ts` (getProfile, updateAvatar).
   - Add `hooks/useUser.ts`.
   - Refactor HomeScreen and UserProfileScreen to use `useUser` and user service; remove Supabase imports from UI.

2. **Introduce new folders without breaking imports**
   - Create `app/`, `features/`, and move navigation into `app/navigation/`.
   - Move screens into `features/<name>/screens/` and update `AppNavigator` imports.
   - Move feature-specific components into `features/<name>/components/`.
   - Keep `/components` for shared UI; move shared pieces there if needed.

3. **Constants and theme**
   - Keep `theme/index.ts` and design-system as-is, or add `constants/theme.ts` that re-exports. Update imports to `@constants/theme` or `@/constants/theme` if desired.

4. **Hooks and services**
   - Add `hooks/useAuth.ts` (re-export), `hooks/useUser.ts`, `hooks/useFetch.ts`.
   - Ensure `services/index.ts` exports user service.

5. **Cleanup**
   - Remove mock data imports from screens; use dataService/hooks only.
   - Fix `types/index.ts` to use relative path for navigation types (e.g. `../app/navigation/types` or where types live).
   - Add loading/error states where data is fetched.

6. **Verification**
   - Run app; test auth, home, all rooms, room detail, profile, avatar upload.

---

## 4. Deliverables

- Updated folder structure as above.
- Refactored files with clear separation: UI → hooks → services → Supabase.
- This document as the written explanation of changes.
- Suggestions for further improvements (see below).

---

## 5. Refactor Summary (Completed)

- **Supabase centralized**: All Supabase usage removed from UI. `services/user.ts` added with `getProfile`, `updateAvatar`; `useUser` hook added. `HomeScreen` and `UserProfileScreen` now use `useUser` and `updateAvatar()` only.
- **App shell**: `src/app/App.tsx` and `src/app/navigation/` hold the root component and navigator. Root `App.tsx` delegates to `src/app/App`. `src/navigation/*` re-exports from `app/navigation` for backward compatibility.
- **Hooks**: `hooks/useAuth.ts` (re-export), `hooks/useUser.ts`, `hooks/useFetch.ts`, and `hooks/index.ts` added.
- **Utils**: `utils/encoding.ts` (base64ToArrayBuffer) added; used by user service.
- **Types**: `types/index.ts` and `types/navigation.types.ts` now use relative path `../navigation/types` instead of `@navigation/types`.
- **Feature scaffold**: `src/features/README.md` describes the target feature layout. Screens remain in `src/screens` for now; migration into `features/<name>/screens` can follow the same pattern without breaking the app.
- **Existing TS errors**: The project had pre-existing TypeScript errors (e.g. fontWeight typings, semiBold vs semibold, missing ReassignTab, etc.). These were not introduced by this refactor. Fixing them is recommended as a follow-up.

---

## 6. Further Improvements (after refactor)

- Split largest screens into smaller components and hooks so no file exceeds ~300 lines.
- Consider a small state layer (e.g. React Context or Zustand) for cross-feature state (e.g. selected shift) if needed.
- Add error boundaries per feature or per screen.
- Add basic unit tests for services and hooks.
- Document feature boundaries and how to add a new feature (copy template under `features/`).
