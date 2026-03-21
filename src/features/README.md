# Feature modules

Screens and feature-specific components will live here as we migrate from `src/screens` and `src/components/*`.

Target layout per feature:

- `auth/` – Login, Splash
- `dashboard/` – Home
- `rooms/` – AllRooms, RoomDetail, ArrivalDepartureDetail
- `chat/` – Chat, ChatDetail
- `tickets/` – Tickets, CreateTicket, CreateTicketForm
- `lostAndFound/` – LostAndFound
- `staff/` – Staff
- `settings/` – Settings
- `user/` – UserProfile

Each feature can have: `components/`, `screens/`, `hooks/`, `services/`, `types.ts`.

Global services and shared components remain in `src/services` and `src/components`.
