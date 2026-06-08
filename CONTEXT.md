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
      applicationController.ts
      noteController.ts
      contactController.ts ← company-inquiry + candidate-inquiry handlers
    lib/
      auth.ts              ← Better-Auth instance (Prisma adapter, email/pw)
      prisma.ts            ← Singleton PrismaClient, pool: 5
    middlewares/
      validate.ts          ← validateCreate(schema) / validateUpdate(schema)
      errorMiddleware.ts   ← next(err) → 500
    routes/
      jobs.route.ts        ← Express Router + Swagger JSDoc for /api/jobs
      news.route.ts        ← Express Router + Swagger JSDoc for /api/news
      application.route.ts ← /api/applications + /api/applications/talent-pool + /api/applications/:id/resume.docx
      note.route.ts        ← /api/applications/:applicationId/notes + /api/notes/:id
      contacts.route.ts    ← /api/contacts/company-inquiries/* + /api/contacts/candidate-inquiries/*
    schemas/
      job.schema.ts        ← createJobSchema, updateJobSchema (Zod)
      news.schema.ts       ← createNewsSchema, updateNewsSchema (Zod)
      application.schema.ts ← createApplicationSchema, updateApplicationSchema
      note.schema.ts       ← createNoteSchema, updateNoteSchema
      contact.schema.ts    ← createCompanyInquirySchema, updateCompanyInquirySchema, createCandidateInquirySchema, updateCandidateInquirySchema
    services/
      job.service.ts       ← Prisma queries + HH:MM→DateTime + R2 URL gen + _count.applications
      news.service.ts      ← Prisma queries for news
      application.service.ts  ← create/fetch/patch/delete + talent-pool filter + cleanupRejectedApplications
      note.service.ts      ← admin-attributed notes per application
      resume.service.ts    ← server-side DOCX resume generation (docx package)
      contacts.service.ts  ← company-inquiry + candidate-inquiry CRUD + state transitions + R2 resume URLs
    lib/
      cron.ts              ← node-cron registration; daily 03:00 sweeps rejected apps
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
        applications/page.tsx              ← Vacancy list with applicant counts
        applications/[jobId]/page.tsx      ← Drill-down: stage tabs + applicants
        talent-pool/page.tsx               ← Cross-vacancy talent pool list
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
    adminapplication/
      AdminApplicationsTable.tsx   ← Drill-down: stage tabs, status dropdown, modal trigger
      ApplicationDetailModal.tsx   ← View / Edit / Reject / Restore / On hold / Talent pool / Export
      EditApplicationForm.tsx      ← RHF + Zod form, partial PATCH via dirtyFields
      NotesPanel.tsx               ← Notes list + add/edit/delete with admin attribution
    application/
      ApplicationForm.tsx  ← Public 3-step wizard at /vacancy/[id]/apply
    news/News.tsx          ← Homepage news section with StackList sidebar
    Footer/                ← FooterSection + Column1/2 + Helpers
    Reusables/             ← Shared UI primitives
  hooks/
    use-mobile.tsx         ← Viewport breakpoint boolean
    use-toast.tsx          ← Toast notifications
  lib/
    auth-client.ts         ← createAuthClient({ baseURL: ":4000", credentials: "include" })
                             Exports: signIn, signUp, signOut, useSession
    utils.js / utils.d.ts  ← cn() and other UI helpers
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
Application  ──< Note                (one Application has many admin notes; ON DELETE CASCADE)
Application  >──< Language           (many-to-many)
Application  >──< Skill              (many-to-many)
Admin        ──< Note (NotesCreatedBy)  + Note (NotesEditedBy)  ← two named relations
ContactRequest ──< ContactReply      (one Request → many Replies; ContactRequest = "company inquiry" surface)
CandidateInquiry                     (standalone; B2C resume submissions for future jobs; can be promoted to talent pool)
Admin        — Session, Account, Verification  (Better-Auth managed)
```

**Enums:**
- `JobStatus`: `Draft` (default) | `Published` | `Closed` | `Archived`
- `Contract`: `Full_time` | `Part_time` | `Internship` | `Flexible`
- `ApplicationStage`: `Pending` (default) | `ApplicantCalled` | `InterviewScheduling` | `Hired` | `Rejected`
- `ApplicationStatus`: `Active` (default) | `OnHold` | `TalentPool` *(set only via modal action — not in inline dropdown)*
- `Gender`: `Male` | `Female` | `Other`
- `ResidenceStatus`: `Permanent_Resident` | `Work_Visa` | `Student_Visa` | `Spouse_Visa` | `Other`
- `JapaneseAbility`: `N1` | `N2` | `N3` | `N4` | `N5` | `None`
- `NewsStatus`: `published` | `closed`
- `Status` (ContactRequest): `Open` (default) | `Inprogress` | `Resolved` | `Closed`
- `CandidateInquiryState`: `New` (default) | `Reviewing` | `MovedToTalentPool` | `Rejected`

**News model image fields:** `image_key String?`, `image_type String?` — nullable to support existing rows. Frontend always sends both when creating. Key format stored: `news/<uuid>.<ext>` (full path; no prefix added by the backend service).
- `Role`: `Admin` | `Editor` | `User` (default: `User`)

**Model → API status:**

| Model | Endpoint | Status |
|---|---|---|
| Job | `/api/jobs` | Fully implemented; `fetchJobs` includes `_count.applications` |
| News | `/api/news` | Fully implemented |
| Admin | `/api/auth/*` | Managed by Better-Auth |
| Application | `/api/applications` | Fully implemented incl. PATCH, talent-pool filter, DOCX export, daily auto-cleanup of rejections |
| Note | `/api/applications/:id/notes`, `/api/notes/:id` | Fully implemented; admin attribution via client-passed UUID |
| ContactRequest | `/api/contacts/company-inquiries` | Fully implemented (B2B company contact form intake) |
| CandidateInquiry | `/api/contacts/candidate-inquiries` | Fully implemented (B2C resume submissions; state lifecycle with talent-pool promotion) |
| ContactReply | — | Schema only; no API surface yet (reply thread is post-MVP) |
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

### Applications — `/api/applications`

| Method | Path | Middleware | Description |
|---|---|---|---|
| GET | `/api/applications` | — | All non-talent-pool applications; supports `?job_id=N` filter; each row includes signed R2 `resume_url` |
| GET | `/api/applications/talent-pool` | — | Only `status='TalentPool'` rows, includes `job` relation |
| GET | `/api/applications/:id/resume.docx` | — | Streams a polished `.docx` resume (sets `Content-Disposition: attachment`) |
| GET | `/api/applications/:id` | — | Single application, includes `job` + `resume_url` |
| POST | `/api/applications` | `validateCreate(createApplicationSchema)` | Public submission from `/vacancy/[id]/apply`; response includes signed R2 PUT URL for resume upload |
| PATCH | `/api/applications/:id` | `validateUpdate(updateApplicationSchema)` | Partial update; accepts any editable field + `stage` + `status` |
| DELETE | `/api/applications/:id` | — | Hard delete + R2 resume cleanup |

**State model:** two orthogonal fields. `stage` is the pipeline step; `status` is the decision/outcome. Reject is a stage transition (`stage='Rejected'`), not a status. TalentPool is set only via the modal's "Move to Talent Pool" action — not via the inline status dropdown. Per-vacancy `GET /api/applications?job_id=N` filters out `status='TalentPool'` server-side.

**Auto-cleanup:** node-cron daily at 03:00 runs `cleanupRejectedApplications`, which deletes rejected applications whose `updated_at > 7 days ago` along with their R2 resume objects. Triggered from `backend/src/lib/cron.ts`.

### Notes — `/api/applications/:applicationId/notes` + `/api/notes/:id`

| Method | Path | Middleware | Description |
|---|---|---|---|
| GET | `/api/applications/:applicationId/notes` | — | All notes for an application, newest first, includes both admin relations |
| POST | `/api/applications/:applicationId/notes` | `validateCreate(createNoteSchema)` | Body: `{ text, created_by_admin_id }` |
| PATCH | `/api/notes/:id` | `validateUpdate(updateNoteSchema)` | Body: `{ text, last_edited_by_admin_id }` |
| DELETE | `/api/notes/:id` | — | Hard delete (cascade also fires when parent Application is deleted) |

### Contacts — `/api/contacts/*`

Two parallel surfaces under one router: **Company inquiries** (B2B, reuses existing `ContactRequest` model) and **Candidate inquiries** (B2C resume submissions, new `CandidateInquiry` model).

#### Company inquiries

| Method | Path | Middleware | Description |
|---|---|---|---|
| GET | `/api/contacts/company-inquiries` | — | All company inquiries, newest first |
| POST | `/api/contacts/company-inquiries` | `validateCreate(createCompanyInquirySchema)` | Public submission from `/contact/company` |
| GET | `/api/contacts/company-inquiries/:id` | — | Single inquiry |
| PATCH | `/api/contacts/company-inquiries/:id` | `validateUpdate(updateCompanyInquirySchema)` | Partial update incl. `status` (Open/Inprogress/Resolved/Closed) |
| DELETE | `/api/contacts/company-inquiries/:id` | — | Hard delete |

**`createCompanyInquirySchema` fields:** `name`, `email`, `phone_number`, `subject` (≤255), `message`. All required.

#### Candidate inquiries

| Method | Path | Middleware | Description |
|---|---|---|---|
| GET | `/api/contacts/candidate-inquiries` | — | All candidate inquiries, newest first; each row includes signed R2 `resume_url` |
| GET | `/api/contacts/candidate-inquiries/talent-pool` | — | Only `state='MovedToTalentPool'` rows; orderBy `moved_to_pool_at DESC` |
| POST | `/api/contacts/candidate-inquiries` | `validateCreate(createCandidateInquirySchema)` | Public submission from `/contact/customer`; response includes signed R2 PUT URL for resume upload |
| GET | `/api/contacts/candidate-inquiries/:id` | — | Single inquiry, includes signed `resume_url` |
| PATCH | `/api/contacts/candidate-inquiries/:id` | `validateUpdate(updateCandidateInquirySchema)` | Partial update incl. `state` transitions (auto-stamps `moved_to_pool_at` / `rejected_at`) |
| DELETE | `/api/contacts/candidate-inquiries/:id` | — | Hard delete + R2 resume cleanup |

**`createCandidateInquirySchema` fields:**

| Field | Type | Required | Rule |
|---|---|---|---|
| `full_name` | string | yes | — |
| `email` | string | yes | Valid email |
| `phone_number` | string | yes | — |
| `date_of_birth` | string | yes | ISO date (`YYYY-MM-DD`) |
| `gender` | enum | no | `Male \| Female \| Other` |
| `current_address` | string | yes | — |
| `preferred_location` | string | yes | — |
| `residence_status` | enum | no | `Permanent_Resident \| Work_Visa \| Student_Visa \| Spouse_Visa \| Other` |
| `japanese_ability` | enum | no | `N1 \| N2 \| N3 \| N4 \| N5 \| None` |
| `cover_letter` | string | no | — |
| `resume_key` | string | yes | UUID `<uuid>.<ext>` — client-generated, unique constraint in DB |
| `resume_type` | string | yes | MIME type, e.g. `application/pdf` |

`updateCandidateInquirySchema` is `.omit({ resume_key, resume_type }).extend({ state }).partial()` — clients cannot change the resume after submission.

**State transition logic** (in `contacts.service.patchCandidateInquiry`):
- `state='MovedToTalentPool'` → stamps `moved_to_pool_at = NOW()`, clears `rejected_at`
- `state='Rejected'` → stamps `rejected_at = NOW()`, clears `moved_to_pool_at`
- `state='Reviewing'` or `'New'` → clears both timestamps

**Resume storage:** Bucket `glowingpartner`, prefix `candidate-resume/` (deliberately separate from Application's `resume/` prefix so the two pipelines can be cleaned up / audited independently).

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

### Resume / Image Upload (server-issued presigned URL)
Binaries are uploaded **directly from the browser to Cloudflare R2** — the backend never receives the file. Two variants live in the codebase:

**Variant 1: Server-issued presigned PUT (Applications + CandidateInquiry resumes)**
1. Client generates a key client-side (`${crypto.randomUUID()}.${ext}`) and sets it in the form state.
2. POST to the API (`/api/applications` or `/api/contacts/candidate-inquiries`) — the backend service calls `putUrl(bucket, key, contentType)` and returns the presigned URL as `data.signed_url` in the JSON response.
3. On success, the client PUTs the file body to `signed_url`. See `ApplicationForm.tsx:147-161` for the canonical implementation.
4. Bucket: `glowingpartner`. Prefixes: `resume/` (Applications), `candidate-resume/` (CandidateInquiry).

**Variant 2: Client-generated presigned PUT (Vacancy + News images — legacy path)**
Older News/Vacancy image flow generated presigned URLs in the browser using `NEXT_PUBLIC_R2_*` credentials. The helper file referenced in earlier docs (`frontend/lib/r2-upload.ts`) has since been removed; current image upload in `AddNews.tsx` / `Forms.tsx` posts to the API and relies on the backend service's returned URL. Treat the server-issued pattern (Variant 1) as the canonical one for all new features.

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
| `app/news/page.tsx` is a placeholder | Public news listing is not connected to `/api/news`. Admin blogs dashboard is. |
| `frontend/types/table.ts` is manual | Not auto-generated from Prisma schema. Must be updated by hand after every migration or types silently diverge. |
| `ContactReply` has no API surface yet | The reply-thread feature is post-MVP — admins triage company inquiries via the `status` enum only for now. |
| TanStack Table needs memoized data + columns | New array literals from inline JSX or `.filter()` re-trigger the table's internal `useMemo`s every render. On admin pages with state changes (modals, mutations) this pegged the main thread until clicks were dropped. Fix: `useMemo` for both `data` and `columns`. |
| Browser extensions mutate `<body>` pre-hydration | Password managers / autofill tools add attributes like `data-atm-ext-installed` to `<body>` before React hydrates. `<body suppressHydrationWarning>` in root `app/layout.tsx` silences the noise. |
| Heavy modals must be conditionally mounted | `{viewing && <Modal>}` plus `next/dynamic(... ssr:false)` for the modal. Mounting a closed Modal sets up portal + scroll-lock infrastructure that leaks on route nav. |
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
npx prisma migrate dev   # applies all migrations, regenerates client
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

### Business + Services marketing pages (2026-06-08)
Five new public marketing pages, two distinct layout systems, shared component families, full mobile responsiveness.

**Navbar restructure** (`frontend/components/Navbar.tsx`)
- "Our Business" dropdown reduced to **3 categories** (was 4): Career Counseling, Temporary Staffing, Paid Employment Placement — each linking to a `/business/<slug>` page.
- "Services" sub-items (For Recruiter / For Job Seeker) now have working `href`s pointing to `/services/<slug>`.
- **Mobile menu added** (visible below `lg` breakpoint): animated hamburger button that morphs into an X, full-screen overlay with accordion sub-items showing 14×14 image thumbnails. Body scroll locks while open; closes on route change. Dynamic dark/light text colour also honors `mobileOpen` state.

**Business pages — magazine layout** (`frontend/app/business/[slug]/page.tsx`)
- `/business/career-counseling` — 3 sections: GPNA, Seminar Business (with feature spread), Career Consulting (Ms. Uenaka + Shiki Satellite).
- `/business/staffing` — Part-time (cleaning specialty, feature spread) + Full-time.
- `/business/placement` — Part-time, Specified Skilled Worker (特定技能), Technical Intern Training (技能実習), Job Hunting & Career Change (feature spread).
- **Shared components** in `frontend/components/business/`:
  - `BusinessHero.tsx` — full-bleed image, kicker chip with animated underline, word-by-word title reveal, parallax scroll, animated side rail, "Scroll" cue with pulsing line. Multi-layer overlay (flat `bg-black/40` + bottom gradient + radial vignette at lower-left + text-shadow) for headline legibility on bright photos.
  - `MagazineSection.tsx` — asymmetric 12-col grid: oversized italic gold numeral, Work Sans label, serif headline, body, optional bullets, optional pull-quote, optional feature spread. **4 rotating animation variants** keyed by section index (classic lift / lateral slide & mask / blur & scale / drop curtain). Variants drive headline reveal mode (words-up / mask-right / blur / letter-by-letter), image entry direction/blur, panel-wipe origin, number entry, and bullet direction. Feature spreads use only **subtle** motion (long fade + reduced parallax ±6%, no wipe/blur/scale) since they're large and shouldn't dominate.
  - `BusinessChrome.tsx` exports `BusinessProgressRail` (spring-smoothed gold scroll progress bar + right-edge vertical pager for desktop, `hidden lg:flex`) and `NextBusinessCue` (animated link to the next business in the 3-page cycle).
- `frontend/app/business/layout.tsx` mounts the progress rail across all 3 routes.

**Services pages — diagonal split layout** (`frontend/app/services/[slug]/page.tsx`)
- `/services/for-recruiter` — Why partner / Breadth of talent / Compliance → CTA to `/contact/company`.
- `/services/for-job-seeker` — How we help / Counseling (GPNA + Ms. Uenaka) / Breadth of opportunities → CTA to `/contact/customer`.
- **Shared components** in `frontend/components/services/`:
  - `DiagonalHero.tsx` — diagonal-clipped photo on the right (static `clip-path`), gold seam traces the cut, ghost "Glowing" word peeks behind text, word-by-word title reveal.
  - `DiagonalPanel.tsx` — full-viewport panels alternating photo-left/photo-right; static diagonal clip; massive ghost numeral parallaxes behind text; gold seam fades in along the cut.
  - `DiagonalCTA.tsx` — closing CTA on teal background with diagonal photo on the left and a CTA button that sweeps gold from left to right on hover.
- **Static-clip pattern**: Initial implementation animated `clip-path` from degenerate polygon to the diagonal — caused photos to render invisible on some loads. Switched to **static CSS `clipPath` + `WebkitClipPath` on a plain div**, with only the image's opacity/scale/x animating. Robust across browsers.

**Text readability over dark diagonal photos**
- Headline and intro on the hero originally sat over the dark photo bleed → low contrast.
- **Solution**: surface-tinted horizontal gradient overlay above the photo on desktop only. Stops: solid `var(--color-surface)` 0–30%, fade through `rgba(248,250,248,0.85)` at 42%, fully transparent by 55%. Direction flips per panel (`90deg` or `270deg` based on `photoLeft`). The diagonal seam at 25–40% sits inside the fade zone, so the text column is always on a continuous light surface but the photo's far side stays untouched.
- Applied to all `DiagonalHero` + all `DiagonalPanel` sections. CTA didn't need it (white text on teal). Mobile uses a different stacked layout and doesn't apply the fade.

**Mobile responsiveness**
- Navbar: hamburger + full-screen accordion overlay below `lg`.
- Business pages: `MagazineSection` already used `col-span-12` defaults that stack; hero title sizes scaled down (`text-5xl sm:text-6xl md:text-7xl lg:text-8xl`).
- Services pages: below `md`, `DiagonalHero` renders photo as full background + dark overlay + white text; `DiagonalPanel` stacks photo (52vh, diagonal-clipped bottom edge) above text block; `DiagonalCTA` stacks photo banner (40vh) above teal text block.

**Image zoom calibration (services pages)**
- Initial implementation used `h-[120%]` image overscan + `scale: 1.12` entry — caused photos to look zoomed-in on laptop screens.
- Final: `h-[105–108%]` overscan, removed entry scale, parallax range trimmed to `±3%` on panels and `0–8%` on hero. Photos render at their natural framing inside the diagonal cut.

**Assets:** All photos reused from existing `/public/*` (`forrecruiter.jpg`, `recruiters.jpg`, `Employe2.jpg`, `Employe3.jpg`, `forjobseeker.jpg`, `jobseekers.jpg`, `careercounseling.jpg`, `meiter.jpg`, `seminal.jpg`, `schoolbusiness.jpg`, `CEO.jpg`, `company.jpg`, `customer.jpg`).

**Routes added:**
- `GET /business/career-counseling`
- `GET /business/staffing`
- `GET /business/placement`
- `GET /services/for-recruiter`
- `GET /services/for-job-seeker`

### Contact Forms Phase A — backend foundation (2026-05-21)
- **NEW** `CandidateInquiry` model + `CandidateInquiryState` enum (`New | Reviewing | MovedToTalentPool | Rejected`). Holds B2C resume submissions for future jobs, decoupled from any specific `Job`.
- **NEW** migration `20260521120000_add_candidate_inquiry` — creates `candidate_inquiry` table with unique `resume_key`, plus widens `ContactRequest.message` to `TEXT`.
- **NEW** `backend/src/schemas/contact.schema.ts` — Zod create/update schemas for both company and candidate inquiries.
- **REPLACED** `backend/src/services/contacts.service.ts` (was empty stub) — full CRUD for both surfaces, R2 presigned URL generation for resumes, state-transition timestamping for candidate inquiries, cascading R2 delete on candidate delete.
- **NEW** `backend/src/controllers/contactController.ts` — 10 handlers spanning company and candidate inquiries + talent-pool slice.
- **NEW** `backend/src/routes/contacts.route.ts` — mounted at `/api/contacts` in `backend/src/index.ts`.
- **MODIFIED** `frontend/types/table.ts` — added `CompanyInquiry`, `CandidateInquiry`, `CandidateInquiryState`, `ContactStatus`, and their response types.
- **OUT OF SCOPE THIS PHASE** (Phases B–D): public `/contact/company` + `/contact/customer` forms, admin `/admin/dashboard/messages` inbox UI, talent-pool page union with CandidateInquiry source.
- Pre-existing failed migration `20260521035855_contact` (unrelated alter+index that errored on duplicate-key) was resolved as `--applied` after verifying the DB end-state already matched.

### Application Pipeline v3 — stage tabs, simplified status, auto-cleanup (2026-05-17)
- **MODIFIED** `backend/prisma/schema.prisma` — `ApplicationStage` gains `Rejected`; `ApplicationStatus` drops `Rejected` (now `Active | OnHold | TalentPool`).
- **NEW** migration `20260517100000_status_stage_v2` — widens both enums, migrates existing `status='Rejected'` rows to `stage='Rejected', status='Active'`, narrows status enum.
- **NEW** `backend/src/lib/cron.ts` + `node-cron` dep — daily 03:00 sweep deletes rejected applications older than 7 days (and their R2 resumes) via `cleanupRejectedApplications`.
- **MODIFIED** `backend/src/server.ts` — starts the cron after `app.listen`.
- **MODIFIED** `frontend/components/adminapplication/AdminApplicationsTable.tsx` — adds stage tabs row above the table (5 tabs with live counts), removes Stage column, narrows Status dropdown to Active/OnHold (TalentPool renders read-only).
- **MODIFIED** `frontend/components/adminapplication/ApplicationDetailModal.tsx` — Reject button now sets `stage='Rejected'` (not status). Restore button handles both `status='TalentPool'` and `stage='Rejected'` and routes to the right transition.
- **MODIFIED** `frontend/components/adminapplication/EditApplicationForm.tsx` — Stage dropdown adds Rejected; Status dropdown drops TalentPool (only reachable via modal action).
- Manual delete keeps its two-step inline confirm. Talent Pool flow unchanged.

### Admin Application Management v2 — notes, edit, talent pool, DOCX (2026-05-16)
- **NEW** `Note` model (FK cascade to Application; two admin relations: `NotesCreatedBy`, `NotesEditedBy`).
- **NEW** routes: notes CRUD, talent-pool list, DOCX export.
- **NEW** `frontend/app/admin/dashboard/applications/page.tsx` (vacancy list) + `[jobId]/page.tsx` (drill-down) + `frontend/app/admin/dashboard/talent-pool/page.tsx`.
- **NEW** modal supports edit mode (RHF + Zod), action footer (Edit / Export / Restore / On hold / Talent pool / Reject / Close), and a notes panel with admin attribution.
- **NEW** `backend/src/services/resume.service.ts` + `docx` dep — server-side DOCX generation.

### Direct R2 Image Upload from Browser (2026-05-13)
- **NEW** `frontend/lib/r2-upload.ts` — `uploadToR2(file, "news"|"vacancy")`: generates presigned PUT URL client-side, uploads via `fetch`, returns `{ key, publicUrl }`.
- **MODIFIED** `frontend/components/adminvacancy/Forms.tsx` (`JobPostingForm3`) — image `onChange` now calls `uploadToR2(..., "vacancy")`; submit disabled during upload.
- **MODIFIED** `frontend/components/adminnews/AddNews.tsx` — image `onChange` now calls `uploadToR2(..., "news")`; submit disabled during upload.
- **ADDED** `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` to `frontend/package.json`.
- **MODIFIED** `backend/prisma/schema.prisma` — `News` model: added `image_key String?`, `image_type String?`.
- **MODIFIED** `backend/src/schemas/news.schema.ts` — added `image_key` and `image_type` as optional fields to `createNewsSchema` (propagates to `updateNewschema` via `.partial()`).
- **NEW** migration `20260513022944_add_image_to_news` — `ALTER TABLE news ADD COLUMN image_key / image_type VARCHAR(191) NULL`. Applied; Prisma client regenerated.
- `frontend/types/table.ts` — `News` type already had `image_key` and `image_type`; no change needed.
