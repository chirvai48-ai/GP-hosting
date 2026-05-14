# Glowing Partner — Project Context

## Overview

Full-stack job recruitment platform. Next.js 16 frontend (port 3000) + Express.js backend (port 4000), both TypeScript. MariaDB via Prisma ORM. Cloudflare R2 for image storage. Better-Auth for session-based authentication.

```
Browser (Next.js, port 3000)
  │  fetch + TanStack Query, credentials: "include"
Express (port 4000)
  ├── /api/auth/*     Better-Auth handler
  ├── /api/jobs       Job CRUD
  ├── /api/news       News/blog CRUD
  ├── /health         { status: "ok" }
  └── /api-docs       Swagger UI
  │
  ├── MariaDB (port 3306, db: glowing_partner) — via Prisma
  └── Cloudflare R2   — presigned PUT/GET URLs, 1hr expiry
```

**Backend request pipeline:** Route → `validate.ts` middleware (Zod) → Controller → Service → Prisma → JSON response

**All data fetching is client-side.** No SSR of dynamic data. Public pages and the admin dashboard both fetch from the REST API via React Query.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 App Router, React 19 |
| Styling | Tailwind CSS (primary) + MUI (Slider, Select, FormControl) |
| Data fetching | TanStack Query (`useQuery`, `useMutation`) |
| Admin tables | TanStack Table (headless, inline editing) |
| Animations | GSAP, Framer Motion, Swiper (carousel) |
| Auth (frontend) | `better-auth/client` → `frontend/lib/auth-client.ts` |
| Backend framework | Express.js |
| Auth (backend) | Better-Auth with Prisma adapter |
| ORM | Prisma + `@prisma/adapter-mariadb` |
| Validation | Zod (backend schemas; frontend mirrors the pattern) |
| Storage | Cloudflare R2 via `@aws-sdk/client-s3` (backend + frontend) |
| API docs | swagger-jsdoc + swagger-ui-express |

---

## Project Structure

```
backend/
  prisma/
    schema.prisma          ← Single source of truth for DB schema
    migrations/            ← 7 migrations (init → cloudflare → jobchanges → add_image_to_news)
    seed.ts
  src/
    server.ts              ← app.listen(PORT)
    index.ts               ← Express factory: middleware, routes, error handler
    configs/
      cloudflare.ts        ← S3Client for R2; getUrl(), putUrl()
      swagger.ts           ← OpenAPI 3.0 config, scans routes/*.ts
    controllers/           ← Thin HTTP layer; calls service, sends JSON
      jobController.ts
      newsController.ts
    lib/
      auth.ts              ← Better-Auth instance (Prisma adapter, email/pw)
      prisma.ts            ← Singleton PrismaClient, pool: 5
    middlewares/
      validate.ts          ← validateCreate(schema) / validateUpdate(schema)
      errorMiddleware.ts   ← next(err) → 500
    routes/
      jobs.route.ts        ← Express Router + Swagger JSDoc for /api/jobs
      news.route.ts        ← Express Router + Swagger JSDoc for /api/news
    schemas/
      job.schema.ts        ← createJobSchema, updateJobSchema (Zod)
      news.schema.ts       ← createNewsSchema, updateNewsSchema (Zod)
    services/
      job.service.ts       ← Prisma queries + HH:MM→DateTime + R2 URL gen
      news.service.ts      ← Prisma queries for news
      application.service.ts  ← EMPTY STUB
      contacts.service.ts     ← EMPTY STUB
    types/
      api.ts               ← ApiResponse<T> { messagge: string; data: T }
                             ⚠ "messagge" is a typo — do not correct without
                               updating all frontend consumers simultaneously

frontend/
  app/
    layout.tsx             ← Root: Geist font, Navbar, TanStackProvider, MUI cache
    page.tsx               ← Public homepage (static sections, no API calls)
    tanstack-provider.tsx  ← QueryClient wrapper
    vacancy/page.tsx       ← Public job search; owns Filterstype + Searchtype state
    news/page.tsx          ← ⚠ PLACEHOLDER — not wired to /api/news yet
    admin/
      login/page.tsx       ← Split layout + LoginForm
      dashboard/
        layout.tsx         ← AdminDrawer sidebar + content slot
        vacancies/page.tsx ← Job CRUD table (TanStack Table, inline editing)
        blogs/page.tsx     ← News CRUD table (TanStack Table)
  components/
    Navbar.tsx             ← Scroll-aware, background changes past hero
    HeroSection.tsx        ← Full-screen video hero ("Different Is Good")
    Vacancies.tsx          ← ⚠ DUMMY DATA — not wired to /api/jobs yet
    Filter.tsx             ← Generic CheckboxGroup<G extends keyof Filterstype>
    SearchBar.tsx          ← Keyword / city / experience / salary (MUI Slider)
    LoginForm.tsx          ← Calls authClient.signIn.email(), redirects on success
    AdminDrawer.tsx        ← Admin sidebar nav (Vacancies, Blogs links)
    adminvacancy/
      EditableCell.tsx     ← Switches display↔input; fires PATCH on confirm
      AddVacancy.tsx       ← New job form/dialog
      Forms.tsx            ← Vacancy form fields; JobPostingForm3 uploads image to
                             glowingpartner/vacancy/ via r2-upload before form submit
    adminnews/
      AddNews.tsx          ← New article form/dialog; uploads image to
                             glowingpartner/news/ via r2-upload before form submit
    news/News.tsx          ← Homepage news section with StackList sidebar
    Footer/                ← FooterSection + Column1/2 + Helpers
    Reusables/             ← Shared UI primitives
  hooks/
    use-mobile.tsx         ← Viewport breakpoint boolean
    use-toast.tsx          ← Toast notifications
  lib/
    auth-client.ts         ← createAuthClient({ baseURL: ":4000", credentials: "include" })
                             Exports: signIn, signUp, signOut, useSession
    r2-upload.ts           ← uploadToR2(file, folder) — generates presigned PUT URL client-side,
                             PUTs file directly to R2, returns { key, publicUrl }
                             Bucket: glowingpartner; folders: "news" | "vacancy"
  types/
    table.ts               ← Manual mirrors of Prisma models (Job, News, Admin, etc.)
                             ⚠ NOT auto-generated — must be updated after every migration
    filters.ts             ← Filterstype: { schedule: {...}, employment: {...} }
    search.ts              ← Searchtype: { sliderValue, searchValue, city, exp }
```

---

## Database Schema & Relations

```
Admin        ──< News                (one Admin authors many articles)
Job          >── JobCategory         (many Jobs → one Category; connectOrCreate by name)
Job          >──< Language           (many-to-many; connectOrCreate by name)
Job          >──< TechnicalSkill     (many-to-many; connectOrCreate by name)
Job          ──< Application         (one Job receives many Applications)
Application  >──< Language           (many-to-many)
Application  >──< Skill              (many-to-many)
ContactRequest ──< ContactReply      (one Request → many Replies)
Admin        — Session, Account, Verification  (Better-Auth managed)
```

**Enums:**
- `JobStatus`: `Draft` (default) | `Published` | `Closed` | `Archived`
- `Contract`: `Full_time` | `Part_time` | `Internship` | `Flexible`
- `ApplicationStatus`: `Pending` | `Reviewed` | `Rejected` | `Accepted`
- `NewsStatus`: `published` | `closed`

**News model image fields:** `image_key String?`, `image_type String?` — nullable to support existing rows. Frontend always sends both when creating. Key format stored: `news/<uuid>.<ext>` (full path; no prefix added by the backend service).
- `Role`: `Admin` | `Editor` | `User` (default: `User`)

**Model → API status:**

| Model | Endpoint | Status |
|---|---|---|
| Job | `/api/jobs` | Fully implemented |
| News | `/api/news` | Fully implemented |
| Admin | `/api/auth/*` | Managed by Better-Auth |
| Application | — | Schema + empty stub only |
| ContactRequest / ContactReply | — | Schema + empty stub only |
| JobCategory, Skill, Language | — | Embedded in Job; no standalone endpoint |

---

## API Reference

**Base URL:** `http://localhost:4000` — Swagger UI at `/api-docs`

**Standard response shape** (all non-auth endpoints):
```json
{ "messagge": "...", "data": <T> }
```
Note the double-g typo — it is in production and must be preserved until all consumers are updated together.

### Auth — `/api/auth/*` (Better-Auth managed)

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/sign-up/email` | Register admin: `{ email, password, name }` |
| POST | `/api/auth/sign-in/email` | Sign in; sets `Set-Cookie` session |
| POST | `/api/auth/sign-out` | Invalidate session |
| GET | `/api/auth/session` | Current session + user |

### Jobs — `/api/jobs`

| Method | Path | Middleware | Description |
|---|---|---|---|
| GET | `/api/jobs` | — | All jobs with nested `job_category`, `languages`, `technical_skills`; each includes a fresh signed R2 GET URL |
| POST | `/api/jobs` | `validateCreate(createJobSchema)` | Create job; response includes signed R2 PUT URL for image upload |
| GET | `/api/jobs/:id` | — | Single job |
| PATCH | `/api/jobs/:id` | `validateUpdate(updateJobSchema)` | Partial update; only sent fields are changed |
| DELETE | `/api/jobs/:id` | — | Hard delete |

**`createJobSchema` fields:**

| Field | Type | Required | Rule |
|---|---|---|---|
| `title` | string | yes | — |
| `salary_min` | number | yes | ≥ 0; must be < `salary_max` |
| `salary_max` | number | yes | > `salary_min` |
| `location` | string | yes | — |
| `experience` | number | yes | — |
| `contract` | enum | yes | `Full_time \| Part_time \| Internship \| Flexible` |
| `shift_start` | string | no | `HH:MM` format only (`^([01]\d\|2[0-3]):([0-5]\d)$`) |
| `shift_end` | string | no | Same regex |
| `languages` | string[] | no | `connectOrCreate` by name (case-sensitive) |
| `technical_skills` | string[] | no | `connectOrCreate` by name (case-sensitive) |
| `job_category` | string | no | `connectOrCreate` by name |
| `status` | enum | no | `Draft \| Published \| Closed \| Archived`; defaults to `Draft` |

`updateJobSchema` is a full `.partial()` of the above — any subset is valid.

### News — `/api/news`

| Method | Path | Middleware | Description |
|---|---|---|---|
| GET | `/api/news` | — | All articles ordered `published_at DESC`, includes nested `admin` |
| POST | `/api/news` | `validateCreate(createNewsSchema)` | Create article |
| GET | `/api/news/:id` | — | Single article |
| PATCH | `/api/news/:id` | `validateUpdate(updateNewsSchema)` | Partial update |
| DELETE | `/api/news/:id` | — | Hard delete |

**`createNewsSchema` fields:**

| Field | Type | Required | Rule |
|---|---|---|---|
| `title` | string | yes | 5–255 chars |
| `body` | string | yes | ≥ 20 chars |
| `summary` | string | yes | 10–500 chars |
| `status` | enum | yes | `published \| closed` |
| `admin_id` | string | no | UUID of authoring admin |
| `image_key` | string | no | R2 object key, e.g. `news/<uuid>.<ext>` |
| `image_type` | string | no | MIME type, e.g. `image/jpeg` |

`updateNewsSchema` is a full `.partial()` of the above — any subset is valid.

---

## Key Data Flows

### Image Upload (Vacancy and News)
Images are uploaded **directly from the browser to Cloudflare R2** before the API form is submitted. The backend never receives the binary.

**Frontend flow (both vacancy and news):**
1. Admin selects a file in the `ImageUpload` component → preview renders immediately via `createObjectURL`.
2. `uploadToR2(file, folder)` in `frontend/lib/r2-upload.ts` runs:
   - Generates a presigned PUT URL **client-side** using `@aws-sdk/client-s3` + credentials from `NEXT_PUBLIC_R2_*` env vars.
   - PUTs the file to R2 via `fetch`.
3. On success, `image_key` and `image_type` are written into the react-hook-form state. The submit button is disabled while uploading.
4. Form submits to the API with the key already set.

**Key formats:**
| Resource | R2 path | `image_key` stored in DB |
|---|---|---|
| Vacancy | `glowingpartner/vacancy/<uuid>.<ext>` | `<uuid>.<ext>` (backend prefixes `vacancy/` when calling `putUrl`) |
| News | `glowingpartner/news/<uuid>.<ext>` | `news/<uuid>.<ext>` (backend stores as-is) |

**R2 CORS requirement:** The `glowingpartner` bucket must allow `PUT` from `http://localhost:3000` (and any production origin). Configure via Cloudflare dashboard → R2 → bucket → Settings → CORS Policy.

**Note on vacancy backend:** `job.service.createJobs()` still calls `putUrl()` and returns a `signed_url` in the response, but the frontend no longer uses it — the upload has already completed before `POST /api/jobs` is called.

### Admin Inline Job Edit
1. `EditableCell` switches to input mode on click.
2. On blur/Enter, it sends `PATCH /api/jobs/:id` with only the changed field.
3. Backend: `validateUpdate(updateJobSchema)` → Zod `.partial()` validates the single field → `job.service.patchJobs()` → Prisma `update`.
4. On success, React Query invalidates the `jobs` query key → table re-fetches.

### Authentication Flow
1. `LoginForm` calls `authClient.signIn.email({ email, password, callbackURL: "/admin/dashboard/vacancies" })`.
2. Better-Auth backend verifies credentials, writes a `Session` record, sets `Set-Cookie`.
3. Frontend redirect follows `callbackURL`. All subsequent fetches include the cookie via `credentials: "include"`.

### Shift Time Handling
- Input: `"HH:MM"` string from frontend.
- Storage: `job.service.ts` converts to a full ISO `DateTime` (arbitrary date component + the time) before Prisma write.
- Output: full `DateTime` ISO string in API response — frontend must strip date and display time only.

---

## Business Logic & Validation Rules

- **Salary:** `salary_min < salary_max`, both ≥ 0. Enforced via Zod `.refine()`.
- **Shift times:** Regex `^([01]\d|2[0-3]):([0-5]\d)$`. Rejects `24:00`, `9:5`, etc.
- **Job status transitions:** Not enforced in code — any valid enum value can be PATCHed directly.
- **News status:** No draft state; must be `published` or `closed` at creation.
- **Relation deduplication:** `connectOrCreate` keys on `name` field. Case-sensitive exact match — `"React"` and `"react"` create two separate records. No normalisation exists in the service layer.
- **Ordering:** `fetchNews()` always returns `ORDER BY published_at DESC`. Jobs have no default sort.
- **Deletes:** All deletes are hard deletes. No soft-delete / `deleted_at` on any model.
- **Validation boundary:** Zod runs once in middleware. Services and Prisma receive pre-validated data — no secondary validation.
- **Roles:** `Admin` / `Editor` / `User` exist on the model. Default is `User`. **Not enforced on any route yet** — mutation endpoints are fully open.

---

## Known Issues & Constraints

| Issue | Impact |
|---|---|
| `messagge` typo in `ApiResponse<T>` | All API responses emit `messagge`. Frontend must use this spelling. Fix requires changing every controller + every consumer simultaneously. |
| No auth guards on `/api/jobs` and `/api/news` mutations | Any unauthenticated client can POST/PATCH/DELETE. Do not expose backend publicly until guards are added. |
| CORS hardcoded to `http://localhost:3000` | Deployment to any other origin requires updating `backend/src/index.ts`. |
| Signed R2 URLs expire after 1 hour | Only affects vacancy: `job.service.createJobs()` still generates a presigned PUT URL in the response, but it is unused. `fetchJobs` does not generate signed GET URLs either — images must be displayed via R2 public URL. |
| R2 credentials exposed in frontend | `NEXT_PUBLIC_R2_*` env vars are bundled into the client JS. Acceptable for an internal admin tool; do not use for public-facing upload flows. |
| R2 CORS not auto-configured | The `glowingpartner` bucket needs a CORS rule allowing `PUT` + `Content-Type` from the app's origin before browser uploads will succeed. |
| `shift_start`/`shift_end` stored as DateTime | Arbitrary date component is baked in at write time. Frontend must extract time only. Changing the date component would corrupt existing records. |
| `Vacancies.tsx` uses dummy data | Public vacancy grid is not connected to `/api/jobs`. Admin dashboard is. |
| `app/news/page.tsx` is a placeholder | Public news listing is not connected to `/api/news`. Admin blogs dashboard is. |
| `frontend/types/table.ts` is manual | Not auto-generated from Prisma schema. Must be updated by hand after every migration or types silently diverge. |
| `application.service.ts` / `contacts.service.ts` are empty | `Application`, `ContactRequest`, `ContactReply` models exist in the DB but have zero API surface. |
| No pagination | `GET /api/jobs` and `GET /api/news` return all records. No `take`/`skip`. |
| `connectOrCreate` is case-sensitive | Skills, languages, categories deduplicate by exact name only. `"React"` ≠ `"react"`. |
| `callbackURL` redirect after login | Relies on Better-Auth client behaviour. If the client version doesn't support it, login silently succeeds but no redirect fires. |

---

## Environment Variables

**`backend/.env`**
```
PORT=4000
DATABASE_URL=mysql://root:<password>@localhost:3306/glowing_partner
BETTER_AUTH_SECRET=<random string, ≥32 chars>
BETTER_AUTH_URL=http://localhost:4000
ACCESS_KEY_ID=<Cloudflare R2 key>
SECRET_ACCESS_KEY=<Cloudflare R2 secret>
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_ACCOUNT_ID=<account-id>
```

**`frontend/.env.local`**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_R2_ACCESS_KEY_ID=<Cloudflare R2 access key>
NEXT_PUBLIC_R2_SECRET_ACCESS_KEY=<Cloudflare R2 secret key>
NEXT_PUBLIC_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-<hash>.r2.dev
```

---

## Setup

```bash
# Backend
cd backend && npm install
npx prisma migrate dev   # applies 7 migrations, regenerates client
npm run dev              # ts-node-dev, port 4000

# Frontend
cd frontend && npm install
npm run dev              # Next.js, port 3000

# Create first admin user
curl -X POST http://localhost:4000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Password123","name":"Admin"}'

# Optional: DB GUI
npx prisma studio        # http://localhost:5555
```

---

## Extension Patterns

### Adding a new API resource (e.g., Applications)
1. Confirm model in `backend/prisma/schema.prisma`; run `npx prisma migrate dev` if schema changes.
2. `backend/src/schemas/<name>.schema.ts` — Zod create + update schemas.
3. `backend/src/services/<name>.service.ts` — Prisma queries.
4. `backend/src/controllers/<name>Controller.ts` — thin HTTP handlers.
5. `backend/src/routes/<name>.route.ts` — Express Router + Swagger JSDoc.
6. Mount in `backend/src/index.ts`.
7. Add interfaces to `frontend/types/table.ts`.

### Adding a new admin dashboard page
1. `frontend/app/admin/dashboard/<name>/page.tsx` — `useQuery` → TanStack Table.
2. Add nav link in `frontend/components/AdminDrawer.tsx`.
3. Follow the pattern in `vacancies/page.tsx` (column defs, `EditableCell`, `useMutation` for PATCH).

---

*Branch: `master` — single WIP commit `b79aaf7`. Paths relative to `C:\Projects\GP\`.*

---

## Recent Changes

### Direct R2 Image Upload from Browser (2026-05-13)
- **NEW** `frontend/lib/r2-upload.ts` — `uploadToR2(file, "news"|"vacancy")`: generates presigned PUT URL client-side, uploads via `fetch`, returns `{ key, publicUrl }`.
- **MODIFIED** `frontend/components/adminvacancy/Forms.tsx` (`JobPostingForm3`) — image `onChange` now calls `uploadToR2(..., "vacancy")`; submit disabled during upload.
- **MODIFIED** `frontend/components/adminnews/AddNews.tsx` — image `onChange` now calls `uploadToR2(..., "news")`; submit disabled during upload.
- **ADDED** `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` to `frontend/package.json`.
- **MODIFIED** `backend/prisma/schema.prisma` — `News` model: added `image_key String?`, `image_type String?`.
- **MODIFIED** `backend/src/schemas/news.schema.ts` — added `image_key` and `image_type` as optional fields to `createNewsSchema` (propagates to `updateNewschema` via `.partial()`).
- **NEW** migration `20260513022944_add_image_to_news` — `ALTER TABLE news ADD COLUMN image_key / image_type VARCHAR(191) NULL`. Applied; Prisma client regenerated.
- `frontend/types/table.ts` — `News` type already had `image_key` and `image_type`; no change needed.
