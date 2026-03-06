# Postman: Simulate Room Reservation by Guest

Use these Supabase REST API calls to create a reservation that links a **guest** to a **room**. Run the steps in order.

---

## Important: use the service_role key in Postman

Tables `rooms`, `guests`, `reservations`, and `reservation_guests` have **Row Level Security (RLS)** and allow only **authenticated** users (logged-in with a JWT). The **anon** key is not authenticated, so you get:

- **GET** → `[]` (empty)
- **POST/PATCH/DELETE** → `42501` — *"new row violates row-level security policy"*

**Fix:** Use the **service_role** key (not the anon/publishable key) for every request in this guide.

- **apikey:** your `SUPABASE_SERVICE_ROLE_KEY` (from `.env` or Supabase Dashboard → Settings → API)
- **Authorization:** `Bearer <same service_role key>`

The service_role key bypasses RLS so Postman can read and write for testing. Do not expose it in the frontend or commit it to git.

---

## Base URL and headers

- **Base URL:** `https://<your-project-ref>.supabase.co/rest/v1`
  - Example (from this project): `https://nkawubpnwkhzvwqkxhaz.supabase.co/rest/v1`
- **Headers (every request):**

| Key            | Value                    |
|----------------|--------------------------|
| `apikey`       | Your Supabase anon/service key |
| `Authorization`| `Bearer <same key>`      |
| `Content-Type` | `application/json`       |
| `Prefer`       | `return=representation`  *(optional; returns created row in response)* |

---

## Get all rooms

- **Method:** `GET`
- **URL:** `{{baseUrl}}/rooms`

Optional query params (Supabase/PostgREST):

| Param   | Example              | Description                    |
|---------|----------------------|--------------------------------|
| `order` | `room_number.asc`    | Sort by room number ascending  |
| `select`| `id,room_number,category,house_keeping_status,flagged` | Return only these columns |
| `house_keeping_status` | `eq.Cleaned` | Filter by status (Dirty, InProgress, Cleaned, Inspected) |

**Examples**

- All rooms:  
  `GET {{baseUrl}}/rooms`
- Sorted by room number:  
  `GET {{baseUrl}}/rooms?order=room_number.asc`
- Only cleaned rooms:  
  `GET {{baseUrl}}/rooms?house_keeping_status=eq.Cleaned`
- Specific columns:  
  `GET {{baseUrl}}/rooms?select=id,room_number,category,house_keeping_status,flagged,special_instructions`

**Response (example)**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "room_number": "101",
    "category": "standard",
    "credit": 0,
    "house_keeping_status": "Dirty",
    "flagged": false,
    "special_instructions": null,
    "notes": null,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  },
  { "id": "...", "room_number": "102", ... }
]
```

**If you get `[]` (empty array)**

1. **RLS (Row Level Security)** – The `rooms` table only allows **authenticated** users. The **anon** key does not count as authenticated, so Supabase returns no rows.
   - **Fix:** Use the **service_role** key in Postman (in `apikey` and `Authorization: Bearer <service_role_key>`). It bypasses RLS so you can read/write for testing.
2. **Table is empty** – There may be no rows yet.
   - **Fix:** Seed data. In Supabase Dashboard → SQL Editor, run your seed script (e.g. `supabase/seed_rooms_guests_reservations.sql` or `supabase/SEED_DATA.sql`), or insert a room manually:
   ```sql
   INSERT INTO rooms (room_number, category, house_keeping_status)
   VALUES ('101', 'standard', 'Dirty'), ('102', 'standard', 'Cleaned');
   ```

---

## Step 1: Get the room ID

You need the room’s UUID. Query by `room_number` (e.g. `101`, `201`).

**Request**

- **Method:** `GET`
- **URL:** `{{baseUrl}}/rooms?room_number=eq.101`
- **Example:** `https://nkawubpnwkhzvwqkxhaz.supabase.co/rest/v1/rooms?room_number=eq.101`

**Response (example)**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "room_number": "101",
    "category": "standard",
    "credit": 0,
    "house_keeping_status": "Dirty",
    "flagged": false,
    "special_instructions": null,
    "notes": null,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

Copy `id` → use as **`room_id`** in Step 3.

---

## Step 2: Create a guest (or use an existing one)

If you get **42501** or "row-level security policy", use the **service_role** key (see top of this doc).

**Option A – Create a new guest**

- **Method:** `POST`
- **URL:** `{{baseUrl}}/guests`
- **Body (raw JSON):**

```json
{
  "full_name": "Jane Doe",
  "vip_code": "12345",
  "primary_email": "jane.doe@example.com",
  "company": "Acme Inc"
}
```

| Field          | Type   | Required | Description        |
|----------------|--------|----------|--------------------|
| `full_name`    | string | Yes      | Guest full name    |
| `vip_code`     | string | No       | VIP / member code  |
| `address`      | string | No       |                    |
| `company`      | string | No       |                    |
| `primary_email`| string | No       |                    |
| `dob`          | string | No       | ISO date (YYYY-MM-DD) |
| `image_url`    | string | No       |                    |

**Sample object (all fields):**

```json
{
  "full_name": "Jane Doe",
  "vip_code": "12345",
  "address": "123 Main St, City",
  "company": "Acme Inc",
  "primary_email": "jane.doe@example.com",
  "dob": "1990-05-15",
  "image_url": "https://example.com/photo.jpg"
}
```

**Minimal (required only):** `{ "full_name": "Jane Doe" }`

**Response (with `Prefer: return=representation`):** the created row including `id`. Copy **`id`** → use as **`guest_id`** in Step 4.

**Option B – Use an existing guest**

- **Method:** `GET`
- **URL:** `{{baseUrl}}/guests?full_name=ilike.*Jane*`  
  (or filter by another field). Copy the guest’s `id` for Step 4.

---

## Step 3: Create the reservation

- **Method:** `POST`
- **URL:** `{{baseUrl}}/reservations`
- **Body (raw JSON):**

```json
{
  "room_id": "550e8400-e29b-41d4-a716-446655440000",
  "arrival_date": "2026-03-01",
  "departure_date": "2026-03-05",
  "eta": "14:00:00",
  "adults": 2,
  "kids": 0,
  "reservation_status": "confirmed",
  "front_office_status": "Arrival",
  "promised_time": "12:00:00"
}
```

| Field                 | Type   | Required | Description |
|-----------------------|--------|----------|-------------|
| `room_id`             | UUID   | Yes      | From Step 1 |
| `arrival_date`        | string | Yes      | YYYY-MM-DD   |
| `departure_date`      | string | Yes      | YYYY-MM-DD   |
| `eta`                 | string | No       | Estimated time of arrival (HH:MM:SS or HH:MM) |
| `adults`              | number | No       | Default 0    |
| `kids`                | number | No       | Default 0    |
| `reservation_status`  | string | No       | e.g. `confirmed`, `checked_in`, `checked_out` |
| `front_office_status` | string | No       | e.g. `Arrival`, `Departure`, `Stayover`, `Turndown` |
| `promised_time`       | string | No       | Room ready time (HH:MM:SS or HH:MM) |

**Response (with `Prefer: return=representation`):** the created reservation including `id`. Copy **`id`** → use as **`reservation_id`** in Step 4.

---

## Step 4: Link guest to reservation

- **Method:** `POST`
- **URL:** `{{baseUrl}}/reservation_guests`
- **Body (raw JSON):**

```json
{
  "reservation_id": "660e8400-e29b-41d4-a716-446655440001",
  "guest_id": "770e8400-e29b-41d4-a716-446655440002"
}
```

| Field            | Type | Required | Description      |
|------------------|------|----------|------------------|
| `reservation_id` | UUID | Yes      | From Step 3      |
| `guest_id`       | UUID | Yes      | From Step 2      |

**Response:** 201 Created (and with `Prefer: return=representation`, the created junction row).

---

## Full example flow (copy-paste IDs as needed)

1. **GET** `.../rest/v1/rooms?room_number=eq.101`  
   → `room_id = "550e8400-e29b-41d4-a716-446655440000"`

2. **POST** `.../rest/v1/guests`  
   Body: `{ "full_name": "Jane Doe", "vip_code": "12345" }`  
   → `guest_id = "770e8400-e29b-41d4-a716-446655440002"`

3. **POST** `.../rest/v1/reservations`  
   Body: `{ "room_id": "550e8400-...", "arrival_date": "2026-03-01", "departure_date": "2026-03-05", "eta": "14:00:00", "adults": 2, "reservation_status": "confirmed", "front_office_status": "Arrival" }`  
   → `reservation_id = "660e8400-e29b-41d4-a716-446655440001"`

4. **POST** `.../rest/v1/reservation_guests`  
   Body: `{ "reservation_id": "660e8400-...", "guest_id": "770e8400-..." }`

After this, the room is reserved for that guest; the app will show the reservation when loading room details (e.g. Room 101).

---

## Postman collection variables (optional)

| Variable     | Example value                                      |
|-------------|-----------------------------------------------------|
| `baseUrl`   | `https://nkawubpnwkhzvwqkxhaz.supabase.co/rest/v1`  |
| `supabaseKey` | Your project’s anon or service_role key          |

Use `{{baseUrl}}` and `{{supabaseKey}}` in the requests above.

---

## Postman scripts (copy-paste)

Set these **collection variables** once (Collection → Variables):  
`baseUrl`, `supabaseKey`, and optionally `room_number` (e.g. `101`).

### Pre-request script (collection-level)

Paste in **Collection → Edit → Pre-request Script**. This runs before every request and sets the auth headers + optional dynamic dates.

```javascript
// Supabase base URL and key (set in Collection/Environment variables)
const baseUrl = pm.collectionVariables.get("baseUrl") || pm.environment.get("baseUrl");
const supabaseKey = pm.collectionVariables.get("supabaseKey") || pm.environment.get("supabaseKey");

if (supabaseKey) {
    pm.request.headers.upsert({ key: "apikey", value: supabaseKey });
    pm.request.headers.upsert({ key: "Authorization", value: "Bearer " + supabaseKey });
}
pm.request.headers.upsert({ key: "Content-Type", value: "application/json" });
pm.request.headers.upsert({ key: "Prefer", value: "return=representation" });

// Optional: dynamic dates for reservations (arrival = today, departure = today + 4 days)
const today = new Date();
const arrival = today.toISOString().slice(0, 10);
const departure = new Date(today);
departure.setDate(departure.getDate() + 4);
const departureStr = departure.toISOString().slice(0, 10);
pm.collectionVariables.set("arrival_date", arrival);
pm.collectionVariables.set("departure_date", departureStr);
```

---

### Post-response scripts (Tests tab, per request)

Paste each block into the **Tests** tab of the corresponding request so IDs are saved for the next step.

**Step 1 – GET room (e.g. `GET {{baseUrl}}/rooms?room_number=eq.101`)**

```javascript
const res = pm.response.json();
if (Array.isArray(res) && res.length > 0) {
    pm.collectionVariables.set("room_id", res[0].id);
    console.log("room_id saved:", res[0].id);
} else {
    console.log("No room found. Check room_number (e.g. 101).");
}
pm.test("Status is 200", () => pm.response.to.have.status(200));
```

**Step 2 – POST create guest (`POST {{baseUrl}}/guests`)**

```javascript
const res = pm.response.json();
if (res && res.id) {
    pm.collectionVariables.set("guest_id", res.id);
    console.log("guest_id saved:", res.id);
}
pm.test("Status is 201", () => pm.response.to.have.status(201));
```

**Step 3 – POST create reservation (`POST {{baseUrl}}/reservations`)**

Use body with `{{room_id}}`, `{{arrival_date}}`, `{{departure_date}}` if you use the pre-request dates:

```json
{
  "room_id": "{{room_id}}",
  "arrival_date": "{{arrival_date}}",
  "departure_date": "{{departure_date}}",
  "eta": "14:00:00",
  "adults": 2,
  "kids": 0,
  "reservation_status": "confirmed",
  "front_office_status": "Arrival",
  "promised_time": "12:00:00"
}
```

Tests tab:

```javascript
const res = pm.response.json();
if (res && res.id) {
    pm.collectionVariables.set("reservation_id", res.id);
    console.log("reservation_id saved:", res.id);
}
pm.test("Status is 201", () => pm.response.to.have.status(201));
```

**Step 4 – POST link guest to reservation (`POST {{baseUrl}}/reservation_guests`)**

Body:

```json
{
  "reservation_id": "{{reservation_id}}",
  "guest_id": "{{guest_id}}"
}
```

Tests tab:

```javascript
pm.test("Status is 201", () => pm.response.to.have.status(201));
console.log("Reservation linked to guest. Done.");
```

---

After adding the scripts, run the four requests in order (or use Collection Runner). Variables `room_id`, `guest_id`, and `reservation_id` will be set automatically for the next request.

---

## Auth note

- **anon key:** Use for normal app-like access; RLS policies apply.
- **service_role key:** Bypasses RLS; use only in a secure backend or for local/testing.  
Get both under: **Supabase Dashboard → Project → Settings → API.**
