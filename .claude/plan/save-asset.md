# Implementation Plan: Save Asset (Create New Asset)

## Overview

Add a two-layer "Save Asset" flow:
1. **Next.js API proxy route** at `app/api/assets/route.ts` — reads `access_token` cookie, validates payload, forwards to backend
2. **Backend REST endpoint** `POST /admin/assets` — persists the asset and returns the created resource

The frontend form at `app/(admin)/assets/new/_components/asset-form.tsx` already POSTs to `/api/assets` — no frontend changes required.

---

## Requirements

- Frontend sends `{ name, category, serialOrTag, notes }` with `credentials: "include"` (cookies)
- Proxy extracts `access_token` cookie, validates required fields, forwards with `Authorization: Bearer <token>`
- Backend validates payload, rejects duplicate `serialOrTag`, sets `status: "available"` server-side, persists, returns created asset
- Both layers use the standard API response envelope:
  ```json
  { "success": boolean, "data": T, "error": { "messages": string[] }, "meta": { "timestamp": string } }
  ```
- Frontend checks `res.ok && data.success`; displays `data.error.messages[0]` on failure

---

## Data Model: Asset Entity

| Field         | Type      | Constraints                                                                 | Set by   |
|---------------|-----------|-----------------------------------------------------------------------------|----------|
| `id`          | UUID      | Primary key, generated server-side                                          | Backend  |
| `name`        | string    | Required, 1–255 characters, trimmed                                         | Client   |
| `category`    | enum      | Required — `computing`, `peripherals`, `networking`, `software`, `furniture` | Client   |
| `serialOrTag` | string    | Required, 1–100 characters, trimmed, **unique** across all assets           | Client   |
| `notes`       | string    | Optional, max 1000 characters, nullable                                     | Client   |
| `status`      | enum      | Always `available` for new assets — **never accepted from client**          | Backend  |
| `createdAt`   | timestamp | ISO 8601, set on creation                                                   | Backend  |
| `updatedAt`   | timestamp | ISO 8601, set on creation and updated on modification                       | Backend  |

### Category Enum Values

| Value          | Display Label            |
|----------------|--------------------------|
| `computing`    | Computing Hardware       |
| `peripherals`  | Peripherals              |
| `networking`   | Networking Equipment     |
| `software`     | Software License         |
| `furniture`    | Office Furniture         |

---

## Key Files

| File | Action | Layer |
|------|--------|-------|
| `app/api/assets/route.ts` | **Create** | Next.js proxy |
| `app/(admin)/assets/new/_components/asset-form.tsx` | No changes needed | Frontend |
| `lib/config.ts` | No changes needed (provides `buildApiUrl`) | Shared |
| Backend: `POST /admin/assets` handler | **Create** | Backend |
| Backend: `assets` database table/migration | **Create** | Backend |

---

## Phase 1: Next.js API Proxy Route

**File to create**: `app/api/assets/route.ts`

### Types

```typescript
type CreateAssetRequestBody = {
  name?: string;
  category?: string;
  serialOrTag?: string;
  notes?: string;
};

type CreateAssetApiResponse = {
  success?: boolean;
  data?: {
    id: string;
    name: string;
    category: string;
    serialOrTag: string;
    notes: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: {
    messages?: string[];
  };
};
```

### Step-by-step

**Step 1 — Parse request body**
- Wrap `await request.json()` in try/catch
- On parse failure: return HTTP 400 `{ success: false, error: { messages: ["Invalid request body."] } }`

**Step 2 — Read access_token cookie**
- Import `cookies` from `next/headers`
- `const accessToken = (await cookies()).get("access_token")?.value`
- If missing: return HTTP 401 `{ success: false, error: { messages: ["Authentication required."] } }`

**Step 3 — Validate required fields**
- Trim `name`, `category`, `serialOrTag`
- `name`: required, non-empty after trim
- `category`: required, must be one of `["computing", "peripherals", "networking", "software", "furniture"]`
- `serialOrTag`: required, non-empty after trim
- `notes`: optional, pass through as-is
- Return HTTP 400 with specific error message on any failure

**Step 4 — Forward to backend**
```typescript
const upstream = await fetch(buildApiUrl("/admin/assets"), {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ name, category, serialOrTag, notes: notes || null }),
  cache: "no-store",
});
```
- Wrap in try/catch; on network failure return HTTP 502 `{ success: false, error: { messages: ["Unable to reach the asset service."] } }`

**Step 5 — Parse and forward backend response**
- Use a `parseJson` helper (same as in `app/api/auth/login/route.ts`) to safely parse — backend may return HTML on 500
- If `!upstream.ok || !responseData?.success`: extract `responseData.error.messages`, return with upstream HTTP status
- On success: return HTTP 201 `{ success: true, data: responseData.data }`

### Reference pattern

Follow `app/api/auth/login/route.ts` as the implementation template — it covers cookie reading, `buildApiUrl`, error extraction, and the `parseJson` helper.

---

## Phase 2: Backend Endpoint Specification

> This section is self-contained. A backend engineer can implement `POST /admin/assets` using only this section.

### Endpoint Summary

| Property        | Value                    |
|-----------------|--------------------------|
| Method          | `POST`                   |
| Path            | `/admin/assets`          |
| Authentication  | Bearer token in `Authorization` header, admin role required |
| Content-Type    | `application/json`       |
| Success status  | `201 Created`            |

### Request Body

```json
{
  "name": "MacBook Pro 16-inch",
  "category": "computing",
  "serialOrTag": "SN-123456789",
  "notes": "Optional maintenance notes"
}
```

| Field         | Type   | Required | Constraints                                                                  |
|---------------|--------|----------|------------------------------------------------------------------------------|
| `name`        | string | Yes      | 1–255 characters after trimming whitespace                                   |
| `category`    | string | Yes      | One of: `computing`, `peripherals`, `networking`, `software`, `furniture`    |
| `serialOrTag` | string | Yes      | 1–100 characters after trimming whitespace; **unique** across all assets     |
| `notes`       | string | No       | Max 1000 characters; may be `null`, empty string, or omitted                 |

**Important**: Any `status` field sent by the client must be **ignored**. Status is always set to `available` server-side.

### Server-Side Processing Order

1. **Authenticate** — Verify Bearer token is valid and belongs to a user with `admin` role
2. **Validate** — Apply all constraints; collect all errors and return them together (do not fail on first error)
3. **Check uniqueness** — Query for existing asset with same `serialOrTag` (case-insensitive recommended)
4. **Set defaults** — `status = "available"`, generate UUID for `id`, set `createdAt` and `updatedAt` to current UTC timestamp
5. **Persist** — Insert asset into database
6. **Return** — 201 with full created asset

---

### Response Shapes

#### 201 Created — Success

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "MacBook Pro 16-inch",
    "category": "computing",
    "serialOrTag": "SN-123456789",
    "notes": "Optional maintenance notes",
    "status": "available",
    "createdAt": "2026-03-31T10:30:00.000Z",
    "updatedAt": "2026-03-31T10:30:00.000Z"
  },
  "meta": {
    "timestamp": "2026-03-31T10:30:00.000Z"
  }
}
```

#### 400 Bad Request — Validation Failure

```json
{
  "success": false,
  "error": {
    "messages": [
      "Name is required.",
      "Category must be one of: computing, peripherals, networking, software, furniture."
    ]
  },
  "meta": { "timestamp": "2026-03-31T10:30:00.000Z" }
}
```

#### 401 Unauthorized — Missing or invalid token

```json
{
  "success": false,
  "error": {
    "messages": ["Authentication required."]
  },
  "meta": { "timestamp": "2026-03-31T10:30:00.000Z" }
}
```

#### 403 Forbidden — Non-admin token

```json
{
  "success": false,
  "error": {
    "messages": ["Insufficient permissions."]
  },
  "meta": { "timestamp": "2026-03-31T10:30:00.000Z" }
}
```

#### 409 Conflict — Duplicate serialOrTag

```json
{
  "success": false,
  "error": {
    "messages": ["An asset with this serial number or tag already exists."]
  },
  "meta": { "timestamp": "2026-03-31T10:30:00.000Z" }
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "messages": ["An unexpected error occurred. Please try again later."]
  },
  "meta": { "timestamp": "2026-03-31T10:30:00.000Z" }
}
```

---

## HTTP Status Code Summary

| Scenario                       | Status |
|--------------------------------|--------|
| Asset created successfully     | 201    |
| Missing/invalid request body   | 400    |
| Validation failure             | 400    |
| Missing/invalid Bearer token   | 401    |
| Valid token, non-admin role    | 403    |
| Duplicate `serialOrTag`        | 409    |
| Database / unexpected error    | 500    |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Field naming convention mismatch (e.g., `serial_or_tag` vs `serialOrTag`) | Contract specifies camelCase JSON. Backend transforms at API boundary if storing snake_case internally. |
| Race condition on duplicate `serialOrTag` (two simultaneous requests) | DB must enforce a unique index on `serialOrTag`. Application-level check is a convenience; DB constraint is the source of truth. Catch DB unique violation and return 409. |
| `notes` containing excessively long or malicious content | Backend enforces 1000-char limit. Sanitize before rendering in other views. |
| Backend returns non-JSON (e.g., HTML 500 page) | Proxy uses a `parseJson` helper that catches JSON parse failures and returns a generic error. |

---

## Success Criteria

- [ ] `POST /api/assets` with valid payload + valid cookie → 201 with created asset
- [ ] `POST /api/assets` without cookie → 401
- [ ] `POST /api/assets` with missing required fields → 400 with field-specific message
- [ ] `POST /api/assets` with invalid category → 400
- [ ] `POST /api/assets` with duplicate `serialOrTag` → 409
- [ ] Form displays "Asset saved successfully." on 201
- [ ] Form displays backend error message on 400/409/401
- [ ] New assets always have `status: "available"` regardless of any client input
- [ ] Backend `assets` table has a unique index on `serialOrTag`
- [ ] `createdAt` and `updatedAt` are equal on creation

---

## Testing Checklist

**Next.js proxy:**
- [ ] Missing `access_token` cookie → 401
- [ ] Missing `name` → 400
- [ ] Missing `category` → 400
- [ ] Missing `serialOrTag` → 400
- [ ] Invalid `category` value → 400
- [ ] Valid payload + valid cookie → forwards to backend, returns 201
- [ ] Backend network failure → 502
- [ ] Backend 409 forwarded correctly to client

**Backend:**
- [ ] Valid payload creates asset, returns 201 with all fields
- [ ] Missing/invalid Bearer token → 401
- [ ] Valid token, non-admin → 403
- [ ] Each required field missing individually → 400
- [ ] `category` outside enum → 400
- [ ] `name` > 255 chars → 400
- [ ] `serialOrTag` > 100 chars → 400
- [ ] `notes` > 1000 chars → 400
- [ ] Duplicate `serialOrTag` (exact + case-insensitive) → 409
- [ ] `status` in response is always `available`
- [ ] `createdAt` === `updatedAt` on creation
- [ ] `id` is a valid UUID
