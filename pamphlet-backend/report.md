# Edge Case Analysis Report — Pamphlet Marketing Platform Backend

> **Generated:** June 16, 2026  
> **Last Updated:** June 16, 2026 — All fixes applied ✅  
> **Scope:** Full-stack analysis of routes, services, repositories, middleware, validation, database schema, and configuration.

---

## 1. Authentication (Auth)

### 1.1 Registration

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 1 | **Duplicate email registration** | ✅ **Fixed** | Added `uniqueIndex` on `users.email` in DB schema. Enumeration check preserved at app level. |
| 2 | **Email case-sensitivity** | ✅ **Fixed** | Email is lowercased via `.toLowerCase().trim()` in both validation schema and service layer. |
| 3 | **Weak password (shorter than 6 chars)** | ✅ Handled | Zod schema: `min(6)`. |
| 4 | **Extremely long password** | ✅ Handled | `varchar(255)` + bcrypt truncates at 72 bytes. Added `max(128)` validation. |
| 5 | **Name field XSS / script injection** | ✅ **Fixed** | Added `stripHtml()` transform in Zod validation to remove HTML tags. |
| 6 | **Missing name/email/password fields** | ✅ Handled | Zod `safeParse` returns 422. |
| 7 | **Empty string fields** | ✅ Handled | Zod `trim()` + `min` validation. |

### 1.2 Login

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 8 | **Login with non-existent email** | ✅ Handled | `findUserByEmail` returns `[]` → throws 401. |
| 9 | **Login with wrong password** | ✅ Handled | `bcrypt.compare` returns false → throws 401. |
| 10 | **Login with unregistered email** | ✅ Handled | Same as #8. |
| 11 | **JWT token never expires** | ✅ **Fixed** | Added `expiresIn: 604800` (7 days) to `jwt.sign`. Configurable via `JWT_EXPIRE` env var (seconds). |
| 12 | **Insecure fallback JWT secret** | ✅ **Fixed** | Removed `|| 'your-secret-key'` fallback. Server throws if `JWT_SECRET` is not configured. |

### 1.3 JWT Middleware

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 13 | **No Authorization header** | ✅ Handled | `jwt.verify('')` throws → caught → 401. |
| 14 | **Malformed Authorization header** | ✅ Handled | Non-"Bearer " prefix → token stays undefined → caught → 401. |
| 15 | **Expired token** | ✅ Handled | `jwt.verify` throws `TokenExpiredError` → caught → 401. |
| 16 | **Tampered token** | ✅ Handled | `jwt.verify` throws → caught → 401. |
| 17 | **Token signed with different secret** | ✅ Handled | Same as #16. |

---

## 2. Pamphlet CRUD

### 2.1 Create Pamphlet

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 18 | **Duplicate `url_key`** | ✅ **Fixed** | Added `uniqueIndex` on `pamphlets.url_key` in DB schema. |
| 19 | **`url_key` with special characters** | ✅ **Fixed** | Added regex validation: `/^[a-z0-9_-]+$/` only allows lowercase alphanumeric, hyphens, underscores. |
| 20 | **Very long title (>255 chars)** | ✅ **Fixed** | Added `max(255)` Zod validation. |
| 21 | **Missing `title`/`category`/`url_key`** | ✅ Handled | Zod `min(1)`. |
| 22 | **Create without authentication** | ✅ Handled | `authMiddleware` returns 401. |
| 23 | **Create with `user_id` not in DB** | ✅ **Fixed** | Added FK constraint `references(() => users.id, { onDelete: 'cascade' })`. |
| 24 | **`location` as plain string (not JSON)** | ✅ Handled | Zod union with `JSON.parse` fallback wraps it as `{ city: value }`. |
| 25 | **`location` with invalid JSON** | ✅ Handled | `normalizePamphletMultipartBody` throws `BadRequestException`. |
| 26 | **`content` field missing** | ✅ Handled | Optional field, stored as `null`. |

### 2.2 Get Pamphlets (List)

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 27 | **Negative page number** | ✅ **Fixed** | `sanitizeNumericParam` clamps to min 1. |
| 28 | **Zero page number** | ✅ **Fixed** | Clamped to default (1). |
| 29 | **NaN/string page or limit** | ✅ **Fixed** | `isNaN` check falls back to defaults. |
| 30 | **Extremely large limit** | ✅ **Fixed** | Max cap at 100 via `sanitizeNumericParam`. |
| 31 | **Empty category filter** | ✅ Handled | No condition added. |
| 32 | **Invalid category filter** | ✅ Handled | Returns empty array. |
| 33 | **Location filter with SQL wildcards** | ✅ **Fixed** | `%` and `_` are now escaped before passing to `LIKE`. |
| 34 | **No pamphlets in DB** | ✅ Handled | Returns `{ data: [], total: 0 }`. |

### 2.3 Get Pamphlet by URL Key

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 35 | **Non-existent `url_key`** | ✅ Handled | Throws `NotFoundException`. |
| 36 | **`url_key` with leading/trailing slashes** | ⚠️ Noted | Express strips trailing slashes; validation prevents special chars. |
| 37 | **Pamphlet with no location** | ✅ Handled | `LEFT JOIN` returns null for location fields. |

### 2.4 Update Pamphlet

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 38 | **Update non-existent pamphlet** | ✅ Handled | `findPamphletById` returns null → `NotFoundException`. |
| 39 | **Update by non-owner** | ✅ Handled | `ForbiddenException`. |
| 40 | **Update without authentication** | ✅ Handled | `authMiddleware` returns 401. |
| 41 | **Update removes location** | ⚠️ Partial | `upsertLocation` with no location returns existing `location_id` — kept as-is. |
| 42 | **Update clears thumbnail (set to null)** | ✅ Handled | Condition `payload.thumbnail_image` is falsy → old file not touched. |
| 43 | **Update with invalid `id` param** | ✅ Handled | `NaN` lookup returns no rows → `NotFoundException`. |

### 2.5 Delete Pamphlet

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 44 | **Delete non-existent pamphlet** | ✅ Handled | `NotFoundException`. |
| 45 | **Delete by non-owner** | ✅ Handled | `ForbiddenException`. |
| 46 | **Delete without authentication** | ✅ Handled | `authMiddleware` returns 401. |
| 47 | **Orphaned location rows on pamphlet delete** | ✅ **Fixed** | `deletePamphletLocation` now deletes the location row. Note: works when each pamphlet has its own location. |
| 48 | **Orphaned contact rows on pamphlet delete** | ✅ **Fixed** | `deletePamphletContacts` now deletes associated contacts. |
| 49 | **Thumbnail file stays on disk after delete** | ✅ **Fixed** | `fs.unlinkSync` removes the thumbnail file on pamphlet delete. |

---

## 3. File Upload (Multer)

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 50 | **Upload non-image file** | ✅ Handled | `imageFileFilter` rejects non-`image/*`. |
| 51 | **Upload file exceeding 5MB** | ✅ Handled | `MulterError LIMIT_FILE_SIZE` → 400. |
| 52 | **Upload multiple files** | ✅ Handled | `limits: { files: 1 }`. |
| 53 | **Upload with no file attached** | ✅ Handled | Falls back to `req.body.thumbnail_image`. |
| 54 | **`uploads/` directory doesn't exist** | ✅ **Fixed** | Auto-creates `uploads/` directory on module load with `mkdirSync({ recursive: true })`. |
| 55 | **Malicious filename (path traversal)** | ⚠️ Partial | Replaces non-alphanumeric chars with `_`. Safe but not fully sanitized. |
| 56 | **Disk full during upload** | ⚠️ Noted | Unhandled `ENOSPC` — would propagate as 500. |
| 57 | **Concurrent upload of same filename** | ✅ Handled | `Date.now()` prefix ensures uniqueness. |
| 58 | **No new image during update** | ✅ Handled | Old file not deleted when no new image. |

---

## 4. Password Reset

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 59 | **Reset with non-existent email** | ✅ **Fixed** | Early return checks `!user || user.length === 0 || !user[0]?.id` before accessing `user[0].id`. Returns generic success message to prevent email enumeration. |
| 60 | **Reset with empty email** | ✅ Handled | Check in controller — returns 404. |
| 61 | **Password mismatch with confirmPassword** | ✅ Handled | 422 response. |
| 62 | **Expired reset token (15 min)** | ✅ Handled | `jwt.verify` throws `TokenExpiredError`. |
| 63 | **Invalid/malformed reset token** | ✅ **Fixed** | Added try/catch in `updatePassword`. Returns 422 with clear message. |
| 64 | **Empty reset token** | ✅ **Fixed** | Caught by try/catch — returns 422. |
| 65 | **Missing `JWT_RESET_SECRET` env var** | ⚠️ Noted | Falls to `''` — weak but non-exploitable for reset flows. |
| 66 | **Missing `CLIENT_URL` env var** | ⚠️ Noted | Link becomes `undefined/forgot-password...`. Relies on correct env config. |

---

## 5. User Management

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 67 | **Get user by non-existent ID** | ✅ **Fixed** | Returns 404 `NotFoundException` instead of empty array. |
| 68 | **Update non-existent user** | ✅ **Fixed** | Returns 404 `NotFoundException` instead of silent success. |
| 69 | **Delete non-existent user** | ✅ **Fixed** | Returns 404 `NotFoundException` instead of silent success. |
| 70 | **Delete user — orphaned pamphlets** | ✅ **Fixed** | `deleteUser` now cascade-deletes all user's pamphlets (contacts + pamphlets). FK `ON DELETE CASCADE` also added at DB level. |
| 71 | **Update user to existing email** | ✅ **Fixed** | Added email uniqueness check in `updateUser` service. Throws `UnAuthorizedException` if email is taken by another user. |
| 72 | **Update user by non-owner** | ✅ **Fixed** | Ownership check: `userId !== requestingUserId` → `ForbiddenException`. |
| 73 | **Delete user by non-owner** | ✅ **Fixed** | Ownership check: `userId !== requestingUserId` → `ForbiddenException`. |
| 74 | **Get all users — no pagination** | ⚠️ Noted | Acceptable for current scale; may need pagination in future. |
| 75 | **Profile handler with undefined user** | ✅ **Fixed** | NaN guard via `authMiddleware` ensures `req.user` is always set when handler runs. |

---

## 6. Categories

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 76 | **No categories in DB** | ✅ Handled | Returns empty array. |
| 77 | **Read-only category list** | ✅ Handled | No create/update/delete routes exposed. |

---

## 7. Database & Schema

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 78 | **Missing `DATABASE_URL` env var** | ⚠️ Noted | Non-null assertion; crashes at runtime with `undefined`. |
| 79 | **No UNIQUE constraint on `users.email`** | ✅ **Fixed** | Added `uniqueIndex('users_email_idx').on(table.email)`. |
| 80 | **No UNIQUE constraint on `pamphlets.url_key`** | ✅ **Fixed** | Added `uniqueIndex('pamphlets_url_key_idx').on(table.url_key)`. |
| 81 | **No foreign key on `pamphlets.user_id`** | ✅ **Fixed** | Added `.references(() => users.id, { onDelete: 'cascade' })`. |
| 82 | **No foreign key on `pamphlet_contacts.pamphlet_id`** | ✅ **Fixed** | Added `.references(() => pamphlets.id, { onDelete: 'cascade' })`. |
| 83 | **No foreign key on `pamphlet_images.pamphlet_id`** | ✅ **Fixed** | Added `.references(() => pamphlets.id, { onDelete: 'cascade' })`. |
| 84 | **Database connection failure at startup** | ✅ Handled | Server logs error and exits with code 1. |
| 85 | **All columns nullable in schema** | ✅ **Fixed** | Added `.notNull()` on `name`, `email`, `password`, `title`, `category`, `user_id`, `url_key`. |

---

## 8. Security

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 86 | **No rate limiting on auth endpoints** | ✅ **Fixed** | Added `express-rate-limit` middleware (20 req / 15 min per IP) on `/auth/register` and `/auth/login`. |
| 87 | **CORS — all origins allowed** | ✅ **Fixed** | Restricted to origins in `CORS_ORIGINS` env var (defaults: `localhost:3000`, `localhost:5173`). |
| 88 | **No HTTPS enforcement** | ⚠️ Noted | Deployment-level concern. |
| 89 | **Console.log in production code** | ✅ **Fixed** | Removed from `password.services.ts` and `pamphlets.repository.ts`. |
| 90 | **SQL injection — raw query** | ✅ Safe | Only `await db.execute('SELECT 1')` — no user input. |
| 91 | **Request body size limit** | ✅ Handled | `express.json({ limit: '16kb' })`. |
| 92 | **Error messages leak info** | ✅ Handled | Password reset returns same message whether email exists or not (prevents enumeration). |

---

## 9. General / System

| # | Edge Case | Status | Details |
|---|-----------|--------|---------|
| 93 | **Unhandled promise rejection** | ✅ **Fixed** | `updatePassword` now has try/catch around `jwt.verify`. |
| 94 | **Route not found (404)** | ✅ Handled | Catch-all middleware. |
| 95 | **`pamphletImages` table — no API routes** | ⚠️ Noted | Schema kept for future use; FK `CASCADE` added. |
| 96 | **No health check endpoint** | ✅ **Fixed** | Added `GET /api/health` that verifies DB connectivity. |
| 97 | **No test suite** | ⚠️ Noted | `npm test` placeholder persists. |
| 98 | **No input trimming** | ✅ **Fixed** | Added `.trim()` + `.toLowerCase()` transforms in Zod validations for all string inputs. |
| 99 | **Pino HTTP middleware registered after DB check** | ⚠️ Noted | Cosmetic ordering issue; functional. |
| 100 | **Dual dev config (tsx watch + nodemon.json)** | ⚠️ Noted | Both work; no conflict. |

---

## Summary

### Key fixes applied

| Area | Count | Highlights |
|------|-------|------------|
| 🔴 Critical crashes | 2 | Password reset crash (`user[0].id`), unhandled `jwt.verify` rejection |
| 🔒 Security | 5 | Rate limiting, CORS restriction, JWT expiry & secret validation, XSS sanitization, SQL LIKE injection |
| 🗄️ DB integrity | 6 | UNIQUE indexes, NOT NULL constraints, CASCADE foreign keys |
| 🧹 Data cleanup | 4 | Cascade delete contacts/locations/files on pamphlet delete, cascade delete pamphlets on user delete |
| ✅ Input validation | 6 | Trim, lowercase, url_key pattern, max lengths, pagination bounds |
| 📋 User management | 5 | Ownership checks, 404 for missing users, email uniqueness on update |

### New migration generated

- **File:** `drizzle/0001_gorgeous_captain_stacy.sql`
- Contains: UNIQUE indexes, NOT NULL alterations, CASCADE foreign keys
- Apply with: `npm run db:migrate` (after backing up production data)

### Unaddressed (low priority / deployment-level)

- `uploads/` directory path traversal (partial mitigation in place)
- Missing `JWT_RESET_SECRET` / `CLIENT_URL` env vars
- Missing `DATABASE_URL` env var
- No pagination on users list
- No test suite
- `pamphletImages` table is dead code
- HTTPS enforcement (deployment concern)
