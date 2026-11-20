# CHARIS — Phase 1 Implementation Progress

This document tracks the progress of Phase 1: Core Backend & Security Foundation for the CHARIS gifting platform.

---

## Progress Overview

| Step | Milestone | Status | Details |
|---|---|---|---|
| **Step 1** | **Environment Configuration & Secret Management** | ✅ **COMPLETED & VERIFIED** | Centralized Zod schema validation, `.env` / `.env.example` templates, Git exclusions, client VITE config |
| **Step 2** | **Real MongoDB Connection** | ✅ **COMPLETED & VERIFIED** | Persistent Mongoose architecture connected to MongoDB Atlas. Live write, read-back, data match, isolated cleanup, and readyState 1 verified. Zero in-memory fallback. |
| **Step 3** | **Password Hashing** | ✅ **COMPLETED & VERIFIED** | Bcryptjs password hashing with salt rounds 12. Unconditional hashing of all new/changed passwords (removed prefix-based bypass). Clean preservation via Mongoose `isModified('password')`. Live Atlas verified with tricky $2b$-prefixed passwords. |
| **Step 4** | **JWT Authentication** | ✅ **COMPLETED & VERIFIED** | Access & refresh tokens, SHA-256 hashed refresh sessions in Atlas MongoDB, token rotation & reuse detection, HTTP-only SameSite cookies, CSRF protection, `/register`, `/login`, `/logout`, `/refresh`, `/me`. |
| **Step 5** | **Frontend API Integration** | ✅ **COMPLETED & VERIFIED** | Centralized Axios API client (`withCredentials: true`), AuthContext session restoration (`GET /auth/me`), automatic token refresh queue, real `/login`, `/register`, `/logout` wiring. |
| **Step 6** | **Remove Fake Default User** | ✅ **COMPLETED & VERIFIED** | Audited all user identity mocks, removed `usr-default-01` & hardcoded senders, eliminated `charis_user` storage, connected state strictly to `AuthContext` + backend `/me`. |
| **Step 7** | **Protected Routes** | ✅ **COMPLETED & VERIFIED** | Reusable `ProtectedRoute` and `AdminRoute` guards, loading state preservation, target URL return in `location.state.from`, authenticated redirect loop prevention, live verified. |

---

## Step 1 Details: Environment Configuration & Secret Management

### Status
- **Status:** Complete & Verified
- **Date Completed:** 2026-11-13
- **Sign-off:** Verified via Zod schema enforcement, live Express server startup, and Vite client build

---

## Step 2 Details: Real MongoDB Connection

### Status
- **Status:** Complete & Verified (Live MongoDB Atlas Verified)
- **Date Verified:** 2026-11-13 12:08 PM

### Implementation & Verification Summary
1. **Persistent Connection Architecture (`server/src/config/db.js`)**:
   - Configured singleton Mongoose connection manager with connection pooling (`maxPoolSize: 10`, `minPoolSize: 2`).
   - Attached persistent lifecycle listeners (`connected`, `error`, `disconnected`).
   - Implemented credential-safe URI sanitizer (`sanitizeMongoUri`) ensuring connection credentials never appear in terminal output or logs.

2. **Server Boot Synchronization (`server/src/server.js`)**:
   - Express server startup is strictly gated behind `await connectDB()`.
   - If MongoDB cannot connect, server startup is aborted immediately with `process.exit(1)`.
   - The server will NEVER listen on HTTP ports with mock/in-memory storage.

3. **Complete Elimination of In-Memory Fallbacks**:
   - **`productController.js`**: Removed in-memory `SEED_PRODUCTS` fallback. Queries now execute against the real MongoDB `Product` collection.
   - **`consultationController.js`**: Removed fake `guest-${Date.now()}` in-memory creation. Records are persisted directly to the MongoDB `Consultation` collection.
   - **`giftCardController.js`**: Removed fake `card-${Date.now()}` in-memory creation. Records are persisted directly to the MongoDB `GiftCard` collection.
   - **`seedProducts.js`**: Converted from destructive wipe to non-destructive idempotent upsert keyed on unique product `slug`.

4. **Health Check Probes (`server/src/routes/healthRoutes.js`)**:
   - **`GET /health`**: Returns HTTP 200 with general Express uptime and timestamp.
   - **`GET /api/v1/health/db`**: Dynamically checks `mongoose.connection.readyState`.
     - Returns HTTP 200 `{ status: "healthy", database: { connected: true, state: "connected", readyState: 1 } }` when connected.
     - Returns HTTP 503 `{ status: "unhealthy", database: { connected: false, state: "disconnected", readyState: 0 } }` when disconnected/unavailable.

---

## Step 3 Details: Secure Password Hashing & Security Correction

### Status
- **Status:** Complete & Verified (Security Review Correction Applied)
- **Date Verified:** 2026-11-13 12:31 PM

### Implementation & Security Correction Summary
1. **Security Correction Applied (`server/src/utils/password.js`)**:
   - **Eliminated Prefix-Based Bypass**: Completely removed `isHashed()` checks from `hashPassword()`. User-supplied passwords are now unconditionally validated and hashed, even if a user intentionally submits a string beginning with `$2b$`, `$2a$`, or `$2y$`.
   - **Salt Rounds**: Maintained strictly at factor `12`.
   - **`comparePassword(plain, hashed)`**: Verified accurate constant-time matching.

2. **Mongoose User Model (`server/src/models/User.js`)**:
   - **Mongoose `isModified('password')` Enforcement**: In the pre-save hook, password hashing is only triggered if `this.isModified('password')` is `true`.
   - **Preservation on Profile Update**: Unrelated updates (name, email, avatar, role) leave the existing password hash 100% untouched.
   - **Password Change Support**: Assigning a new plaintext password to `user.password` correctly triggers the hook and generates a new bcrypt hash.
   - **Leakage Prevention**: `password: { select: false }` along with `toJSON` and `toObject` transform hooks guarantee that password hashes are never exposed in standard queries or API responses.

3. **Security Test Verification Results (11/11 Passed)**:
   - Normal plaintext password hashed and verified.
   - Plaintext password deliberately beginning with `$2b$` is unconditionally hashed (never stored as plaintext).
   - Original password correctly matches the resulting hash via `comparePassword()`.
   - Incorrect password strictly rejected.
   - Updating user name and email preserves the existing password hash with 0 modifications.
   - User continues to authenticate successfully with original password after profile updates.
   - Changing user password generates a new bcrypt hash and authenticates with the new credentials.
   - No password hash appears in `toJSON()` API responses.
   - Live MongoDB Atlas test users cleaned up with zero lingering records.


---

## Step 4 Details: Secure JWT Authentication

### Status
- **Status:** Complete & Verified (Live MongoDB Atlas Verified)
- **Date Verified:** 2026-11-13 12:40 PM
- **Sign-off:** Verified via comprehensive 22-test automated live test suite

### Implementation Summary
1. **Centralized Token Configuration (`server/src/config/env.js`)**:
   - `JWT_SECRET`: Validated with Zod schema (min 16 chars).
   - `JWT_ACCESS_EXPIRY`: Configurable expiry (default `'15m'`).
   - `JWT_REFRESH_EXPIRY`: Configurable expiry (default `'7d'`).
   - Secrets are never logged or exposed in client bundles or responses.

2. **Access Token Generation & Verification (`server/src/utils/tokenUtils.js`)**:
   - Signs tokens with minimal claims: `sub` (User ID), `email`, `role`, and `type: 'access'`.
   - Verifies signature, expiration, and enforces `decoded.type === 'access'`.
   - Rejects expired tokens with `TOKEN_EXPIRED` and malformed/tampered tokens with `INVALID_TOKEN`.

3. **Secure Refresh Token Rotation & Session Lineage (`server/src/models/RefreshToken.js`)**:
   - Raw refresh tokens are 80-character cryptographically secure hex strings generated via `crypto.randomBytes(40)`.
   - Raw tokens are NEVER stored in MongoDB; only their cryptographic SHA-256 hash (`tokenHash`) is persisted.
   - Sessions are grouped by a unique `family` UUID tracking rotation lineage.
   - On rotation, the old refresh token is marked `isRevoked: true` and records its replacement hash (`replacedByTokenHash`), while a new token is issued into the same family.
   - **Automatic Reuse Detection**: If an already-revoked refresh token is presented (e.g. from a stolen token replay attack), the system detects reuse immediately, wipes all tokens in that `family`, clears browser cookies, and terminates the compromised session.
   - Document TTL index (`expiresAt: { index: { expires: 0 } }`) ensures automatic MongoDB cleanup of expired tokens.

4. **HTTP-only Cookie Architecture & CSRF Defense (`server/src/middleware/csrf.js`)**:
   - Access token is set in `charis_access_token` (`httpOnly: true`, `sameSite: 'lax'`, `path: '/'`).
   - Refresh token is set in `charis_refresh_token` (`httpOnly: true`, `sameSite: 'lax'`, `path: '/api/v1/auth'`) restricted strictly to the authentication endpoint path.
   - CSRF middleware inspects state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) with cookies attached, verifying the `Origin` / `Referer` against allowed domains and blocking untrusted origins with HTTP 403 `CSRF_UNTRUSTED_ORIGIN`.

5. **Authentication Endpoints (`server/src/routes/authRoutes.js` & `server/src/controllers/authController.js`)**:
   - `POST /api/v1/auth/register`: Zod-validated, creates user with bcrypt salt rounds 12, issues tokens, returns 201 with sanitized user.
   - `POST /api/v1/auth/login`: Zod-validated, generic 401 on wrong credentials, issues fresh tokens, returns 200 with sanitized user.
   - `POST /api/v1/auth/refresh`: Rotates refresh token, invalidates old token, issues new access token.
   - `POST /api/v1/auth/logout`: Revokes refresh token in MongoDB, clears cookies.
   - `GET /api/v1/auth/me`: Protected by `auth` middleware, returns authenticated user data.

6. **Live Test Results (22/22 Passed)**:
   - ✅ 1. POST /api/v1/auth/register returns 201
   - ✅ 2. Registration response returns sanitized user object without password or hash
   - ✅ 3. Registration sets HTTP-only `charis_access_token` and `charis_refresh_token` cookies
   - ✅ 4. User password stored in Atlas MongoDB is bcrypt-hashed (`$2...`)
   - ✅ 5. Duplicate registration correctly rejected with 409 Conflict
   - ✅ 6. Login with incorrect password returns 401 generic error
   - ✅ 7. Login with nonexistent email returns 401 generic error
   - ✅ 8. Login with correct credentials returns 200
   - ✅ 9. Login sets fresh access and refresh cookies
   - ✅ 10. GET /api/v1/auth/me succeeds with cookie authentication
   - ✅ 11. GET /api/v1/auth/me succeeds with Bearer token authentication
   - ✅ 12. Accessing protected endpoint without token returns 401 AUTH_REQUIRED
   - ✅ 13. Accessing protected endpoint with tampered token returns 401 INVALID_TOKEN
   - ✅ 14. Accessing protected endpoint with expired token returns 401 TOKEN_EXPIRED
   - ✅ 15. POST /api/v1/auth/refresh rotates tokens successfully
   - ✅ 16. Rotation issues a brand new refresh token and access token
   - ✅ 17. Old refresh token is marked isRevoked: true and tracks replacement hash in Atlas DB
   - ✅ 18. Token reuse detected! Request rejected with 401 TOKEN_REUSE_DETECTED
   - ✅ 19. Security enforcement: all active sessions in compromised family were immediately revoked
   - ✅ 20. CSRF middleware blocks mutating cookie request from untrusted origin with 403
   - ✅ 21. POST /api/v1/auth/logout returns 200
   - ✅ 22. Logout marks session isRevoked: true in Atlas DB

---

### Security Audit & Hardening (Phase 1, Step 4)
- **Date Audited:** 2026-11-13 12:47 PM
- **Audit Scope:** JWT signing/verification algorithms, concurrent refresh race conditions, stale claims/deleted user invalidation, strict origin/CSRF validation, CORS credential protection, error leakage, token separation.

#### Confirmed Security Findings & Corrections:
1. **Algorithm Confusion Protection (`server/src/utils/tokenUtils.js`)**:
   - *Finding:* `verifyAccessToken()` did not restrict allowed algorithms, leaving open theoretical algorithm confusion vulnerabilities (`alg: none` or asymmetric attacks).
   - *Correction:* Explicitly set `algorithm: 'HS256'` in `jwt.sign()` and enforced `algorithms: ['HS256']` in `jwt.verify()`.
2. **Deleted / Inactive User Session Invalidation (`server/src/middleware/auth.js`)**:
   - *Finding:* Stateless JWT validation would allow deleted or deactivated users to access protected resources until token expiry.
   - *Correction:* Auth middleware now verifies that `User.findById(decoded.sub)` exists in MongoDB. Rejects deleted users with HTTP 401 `USER_NOT_FOUND` and dynamically attaches the fresh role.
3. **Concurrent Refresh Race Condition Mitigation (`server/src/controllers/authController.js`)**:
   - *Finding:* A non-atomic read-then-write on `RefreshToken` allowed concurrent refresh requests to cause race conditions or false-positive reuse detection.
   - *Correction:* Replaced with atomic `RefreshToken.findOneAndUpdate({ tokenHash, isRevoked: false }, { isRevoked: true })`. Only exactly one concurrent request can successfully claim and rotate the token.
4. **Strict Origin & CSRF Validation (`server/src/middleware/csrf.js` & `server/src/app.js`)**:
   - *Finding:* Substring matching (`.includes('localhost')` and `.endsWith('.vercel.app')`) allowed spoofed origins (e.g. `attacker-localhost.com` or third-party Vercel subdomains) to bypass CSRF. Permissive fallback in CORS reflected unauthorized origins.
   - *Correction:* Implemented strict URL parsing (`isAllowedOrigin`). Only exact configured origins or legitimate localhost (`hostname === 'localhost' || hostname === '127.0.0.1'` in dev) are permitted. CORS strictly refuses untrusted origins for credentialed requests.

#### Audit Verification Test Suite (28 / 28 Passed):
- ✅ Tests 1–22: Core functional authentication, rotation, reuse detection, logout, cookie delivery, Atlas persistence.
- ✅ Test 23: Algorithm confusion attack (`alg: none`) strictly rejected with 401 `INVALID_TOKEN`.
- ✅ Test 24: Deleted/non-existent user with valid JWT strictly rejected with 401 `USER_NOT_FOUND`.
- ✅ Test 25: Substring origin spoofing (`attacker-localhost.com`) strictly blocked by CSRF with 403 `CSRF_UNTRUSTED_ORIGIN`.
- ✅ Test 26: CORS does not reflect untrusted origins for credentialed requests.
- ✅ Test 27: Concurrency-safe atomic refresh: exactly 1 concurrent refresh succeeds, 2nd rejected (200 and 401).
- ✅ Test 28: Separation of token types: access tokens rejected on refresh endpoints and vice-versa.


---

## Step 5 Details: Frontend API Integration

### Status
- **Status:** Complete & Verified
- **Date Verified:** 2026-11-13 1:45 PM
- **Sign-off:** Verified via Vite TypeScript production build and 15/15 live automated integration tests against MongoDB Atlas and the Express server.

### Implementation Summary
1. **Centralized Axios API Client (`client/src/services/api.ts`)**:
   - Initialized with `baseURL: API_BASE_URL` (`http://localhost:5000/api/v1` via `VITE_API_URL`).
   - Configured with `withCredentials: true` to ensure HTTP-only cookies (`charis_access_token`, `charis_refresh_token`) are transmitted on every request.
   - Built-in response interceptor for automatic access-token refresh (`POST /auth/refresh`).
   - Concurrency queuing: Multiple simultaneous requests encountering 401 wait on a single shared refresh operation via `isRefreshing` and `failedQueue`.
   - Loop prevention: Skips refresh on authentication endpoints and rejects requests already marked `_retry`.

2. **Dedicated Authentication Service (`client/src/services/authService.ts`)**:
   - `getCurrentUser()`: Calls `GET /api/v1/auth/me` to fetch verified user session.
   - `login(email, password)`: Calls `POST /api/v1/auth/login`.
   - `register(name, email, password)`: Calls `POST /api/v1/auth/register`.
   - `refreshSession()`: Calls `POST /api/v1/auth/refresh`.
   - `logout()`: Calls `POST /api/v1/auth/logout`.

3. **Centralized AuthContext (`client/src/context/AuthContext.tsx`)**:
   - Provides `user`, `isAuthenticated`, `isLoading`, `login()`, `register()`, `logout()`, `refreshSession()`, `savedSessions`, and `saveSession()`.
   - Initial session restoration: Calls `GET /api/v1/auth/me` on startup. If valid, populates the authenticated user; if not, resets user state to `null`.
   - Zero token storage: No access or refresh tokens are ever written to `localStorage` or `sessionStorage`. All tokens stay in secure HTTP-only cookies.
   - Removed fake default user (`usr-default-01`) from `AuthContext`. Initial user state is strictly `null`.

4. **Login & Registration Pages (`client/src/pages/Login.tsx`)**:
   - Connected `handleSubmit` to real `login()` and `register()` endpoints.
   - Enforces client-side validation (valid email format, minimum 8 characters for passwords, name required on registration).
   - Dynamic submission states (`isSubmitting`) with disabled buttons and real error messages from backend responses.
   - "Fill Demo Credentials" helper pre-fills input fields without bypassing backend authentication.
   - Preserved all GSAP animations, styling, fonts, and responsive layout.

5. **Navigation & Dashboard (`client/src/components/common/Navbar.tsx` & `Dashboard.tsx`)**:
   - Displays real authenticated user name and initials in desktop navigation, mobile drawers, and user drop-down menus.
   - Sign Out triggers real `logout()` calling `POST /api/v1/auth/logout`, invalidating backend session and cookies.

6. **Live Integration Test Results (15/15 Passed)**:
   - ✅ 1. On initial startup with no cookies, GET /auth/me returns 401 (user is null, no fake profile)
   - ✅ 2. Registration via frontend client returns 201
   - ✅ 3. Sanitized user profile received without password hash
   - ✅ 4. HTTP-only session cookies stored in client cookie jar
   - ✅ 5. Duplicate registration correctly returns 409 EMAIL_ALREADY_EXISTS
   - ✅ 6. Page reload with session cookies restores user profile via GET /auth/me
   - ✅ 7. Expired access token triggers automatic /auth/refresh and transparently retries request to 200
   - ✅ 8. Fresh access token cookie updated in client
   - ✅ 9. 3 simultaneous requests with expired access tokens share 1 refresh call and all succeed (200)
   - ✅ 10. Logout request returns 200
   - ✅ 11. After logout, subsequent GET /auth/me returns 401 (session terminated)
   - ✅ 12. Login with valid credentials returns 200
   - ✅ 13. Authenticated user profile matches database record
   - ✅ 14. New access token cookie set on login
   - ✅ 15. When refresh fails (revoked/expired session), request is rejected with 401 without infinite loop


---

## Step 6 Details: Complete Fake Default User & Auth Mock Cleanup

### Status
- **Status:** Complete & Verified
- **Date Verified:** 2026-11-13 1:55 PM
- **Sign-off:** Verified via full codebase audit, live Atlas MongoDB authentication tests, and clean Vite production build.

### Audit Findings & Classification

1. **Authentication & User Identity Mocks (REMOVED)**:
   - `usr-default-01` (`Praneel Kulkarni`, `praneel@example.com`): Previously hardcoded in `client/src/context/AuthContext.tsx` as an initial fallback state. Removed completely; initial `user` state is strictly `null`.
   - `localStorage.setItem('charis_user', ...)`: Previously persisted mock user identity to browser localStorage. Removed; authentication is 100% cookie-driven.
   - Mock Login / Registration implementations (`AuthContext.tsx`): Previously generated in-memory dummy user objects (`usr-Date.now()`). Replaced with real Axios calls to backend endpoints (`/api/v1/auth/login` and `/api/v1/auth/register`).
   - Hardcoded Sender `'With all my heart, Dev'` (`client/src/components/gift/FramedGiftCardModal.tsx`): Pre-populated mock sender name. Removed; now defaults to `user?.name || ''` dynamically from authenticated context.
   - Flash of "Session Required" on page load (`client/src/pages/Dashboard.tsx`): Handled via `isLoading` check while `GET /api/v1/auth/me` validates session.

2. **Legitimate Retained References (RETAINED)**:
   - Form pre-fill helper in `client/src/pages/Login.tsx` (`handleFillDemo`): Retained as requested because it only populates form inputs (`email`, `password`) and still authenticates strictly through the real backend.
   - Shopping bag items in `client/src/context/BagContext.tsx` (`charis_bag`): Retained e-commerce state.
   - Wishlist product IDs in `client/src/context/WishlistContext.tsx` (`charis_wishlist`): Retained e-commerce state.
   - Consultation answers in `client/src/pages/Recommendations.tsx` (`charis_active_consultation`): Retained draft questionnaire responses.

3. **Product Catalogue & Business Data (RETAINED)**:
   - 100+ luxury curated gifts in `client/src/data/mockData.ts` and `curatedGifts100.ts`: Retained as business product catalogue.
   - Atelier Curators gallery in `client/src/components/kolibrie/TeamFlockKolibrie.tsx` (Elena, Sem, Mila, Daan, Sofia, Jules, Yara, Kenji): Retained as landing page brand imagery.

### Verification Results (6 / 6 Passed):
- ✅ 1. No default user exists: `GET /api/v1/auth/me` returns 401 on startup.
- ✅ 2. Registration creates real user in MongoDB Atlas and returns profile.
- ✅ 3. User record persists in Atlas with bcrypt hash (no plaintext).
- ✅ 4. Session restoration via cookie returns authentic Atlas user profile.
- ✅ 5. `POST /api/v1/auth/logout` returns 200.
- ✅ 6. Post-logout `GET /api/v1/auth/me` is strictly 401 (no lingering default identity).
- ✅ Frontend production build succeeds in 1.93s (`npm --prefix client run build`).


---

## Step 7 Details: Protected Frontend Routes & Authorization

### Status
- **Status:** Complete & Verified
- **Date Verified:** 2026-11-13 2:10 PM
- **Sign-off:** Verified via route audit, Vite production build, and 14/14 automated live integration tests against MongoDB Atlas and the Express server.

### Route Classification Audit

| Route | Classification | Component | Behavior |
|---|---|---|---|
| `/` | Public | `Home.tsx` | Accessible without login |
| `/discover` | Public | `Discover.tsx` | Accessible without login |
| `/occasions` | Public | `Occasions.tsx` | Accessible without login |
| `/gift-studio` | Public | `GiftStudio.tsx` | Accessible without login |
| `/consultation` | Public | `Consultation.tsx` | Accessible without login (guests & members) |
| `/recommendations` | Public | `Recommendations.tsx` | Accessible without login |
| `/login` | Authentication | `Login.tsx` | Public; redirects authenticated users to target URL or `/dashboard` |
| `/register` | Authentication | `Login.tsx?mode=signup` | Public; redirects authenticated users to target URL or `/dashboard` |
| `/dashboard` | Authenticated Only | `Dashboard.tsx` | Protected by `ProtectedRoute`; redirects unauthenticated visitors to `/login` |
| `/admin` (future) | Admin Only | (Guard Ready) | Protected by `AdminRoute`; redirects non-admin users to `/dashboard` |

### Architecture & Implementation Details

1. **Reusable `ProtectedRoute` Guard (`client/src/components/common/ProtectedRoute.tsx`)**:
   - Integrates with `useAuth()`.
   - **Loading Protection**: When `isLoading === true`, renders a branded CHARIS spinner instead of redirecting prematurely.
   - **Target Route Preservation**: Unauthenticated users are redirected to `/login` with `state: { from: location }`.
   - **Authenticated Access**: Once verified, renders the requested child route / `<Outlet />`.

2. **Reusable `AdminRoute` Guard (`client/src/components/common/AdminRoute.tsx`)**:
   - Gated on `user?.role === 'admin'`.
   - Unauthenticated visitors are redirected to `/login`.
   - Authenticated non-admin members are safely redirected to `/dashboard`.
   - Dynamically backed by live backend role checks from MongoDB Atlas.

3. **Post-Login Redirection & Loop Prevention (`client/src/pages/Login.tsx`)**:
   - Reads `location.state.from.pathname`.
   - If user requested a protected page before logging in, they return immediately to that page upon successful authentication.
   - Explicitly prevents redirect loops by defaulting to `/dashboard` if `from` points to `/login` or `/register`.

4. **Live Verification Results (14 / 14 Passed)**:
   - ✅ 1. All public routes render without authentication
   - ✅ 2. Unauthenticated access to `/dashboard` blocked and redirects to `/login` preserving target URL in state
   - ✅ 3. While session verification is loading (`isLoading=true`), route guard renders loading indicator without redirecting
   - ✅ 4. Real user registered successfully on backend and persisted to Atlas
   - ✅ 5. Authenticated member is permitted into `/dashboard`
   - ✅ 6. Authenticated user visiting `/login` with `state.from` is redirected to original target (`/gift-studio`)
   - ✅ 7. Authenticated user visiting `/login` without `state.from` is redirected to `/dashboard`
   - ✅ 8. Redirect loop prevention: target pointing to `/login` safely defaults to `/dashboard`
   - ✅ 9. Backend dynamically verifies updated admin role from Atlas DB
   - ✅ 10. Authenticated non-admin user accessing `/admin` is redirected to `/dashboard`
   - ✅ 11. Authenticated user with admin role is permitted into `/admin`
   - ✅ 12. Page reload restores real session via HTTP-only cookie
   - ✅ 13. Logout invalidates session on backend
   - ✅ 14. Post-logout state immediately triggers route guard and redirects `/dashboard` to `/login`
