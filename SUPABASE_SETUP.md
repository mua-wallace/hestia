# Supabase Setup Guide

This document describes how to set up Supabase for the Hestia app, including configuration and authentication.

## Prerequisites

- A [Supabase](https://supabase.com) account
- Node.js and npm installed

## 1. Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com) and sign in
2. Click **New Project**
3. Choose your organization, project name, and database password
4. Select a region and create the project

## 2. Get Your API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **Publishable key** (format `sb_publishable_xxx`) — recommended over the legacy anon key

## 3. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

> **Note:** The `EXPO_PUBLIC_` prefix is required for Expo to expose these variables to the client. Never commit `.env` to version control (it's in `.gitignore`).

## 4. Enable Email Auth in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. (Optional) Configure **Email Templates** under **Authentication** → **Email Templates** for sign-up, password reset, etc.

## 5. Add Users

- **Sign up:** Use Supabase Dashboard → **Authentication** → **Users** → **Add user** to create users manually
- **Or:** Implement a sign-up flow in the app (Supabase Auth supports `signUp` with email/password)

## 6. Run the App

```bash
npm start
```

Restart the Metro bundler after changing `.env` so the new variables are picked up.

## Project Structure

```
src/
├── lib/
│   └── supabase.ts       # Supabase client (AsyncStorage for session persistence)
├── services/
│   └── auth.ts           # Auth service (signIn, signOut, resetPassword)
├── contexts/
│   └── AuthContext.tsx   # Auth state & useAuth hook
└── types/
    └── supabase.ts       # Database types (regenerate after schema setup)
```

## Auth Flow

1. **Splash** → Checks session. If authenticated → Main, else → Login
2. **Login** → Email/password sign-in via Supabase Auth
3. **Main** → Protected app screens
4. **Settings** → Sign Out option to clear session and return to Login

## 7. Database Schema

The schema is in `supabase/migrations/`. To apply it:

### Option A: Supabase SQL Editor (simplest)

1. In Supabase Dashboard, go to **SQL Editor**
2. Run each migration file in order:
   - `20250606000000_initial_schema.sql`
   - `20250606000001_rls_policies.sql`
   - `20250606000002_auth_user_sync.sql`
3. (Optional) Run `supabase/SEED_DATA.sql` for sample data

### Option B: Supabase CLI

```bash
# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
npx supabase db push
```

### Schema Overview

| Table | Purpose |
|-------|---------|
| `departments` | Groups staff by function |
| `roles` | What users can do |
| `permissions` | Specific actions per role |
| `users` | Staff (links to auth.users) |
| `rooms` | Hotel rooms |
| `shifts` | AM/PM/Night work shifts |
| `room_assignments` | Which staff cleans which room |
| `guests` | People staying in rooms |
| `reservations` | Bookings with arrival/departure |
| `tickets` | Issues, maintenance, requests |
| `consumables` | Billable items (mini bar, etc.) |
| `consumptions` | Items consumed by guests |
| `lost_and_found_items` | Lost/found tracking |
| `chats` | Staff communication |
| `chat_participants` | Who's in each chat |
| `messages` | Chat messages |
| `room_history` | Audit log per room |

## 8. Generate TypeScript Types

After running migrations:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Get your project ID from the Supabase dashboard URL or Settings → General.
