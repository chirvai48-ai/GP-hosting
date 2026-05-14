# Glowing Partner — Project Context Document

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Folder / File Structure Explanation](#2-folder--file-structure-explanation)
3. [Core Modules and Responsibilities](#3-core-modules-and-responsibilities)
4. [Data Flow (Step-by-Step)](#4-data-flow-step-by-step)
5. [API Routes / Endpoints](#5-api-routes--endpoints)
6. [Key Business Logic Rules](#6-key-business-logic-rules)
7. [External Dependencies and Integrations](#7-external-dependencies-and-integrations)
8. [Important Edge Cases and Constraints](#8-important-edge-cases-and-constraints)
9. [New Developer Onboarding Guide](#9-new-developer-onboarding-guide)

---

## 1. High-Level Architecture

**Glowing Partner** is a job recruitment platform connecting job seekers with employers. It follows a classic client/server split with a Next.js frontend and an Express.js backend, both written in TypeScript.

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser  —  Next.js Frontend (port 3000)                       │
│                                                                 │
│  Public:  job listings, search/filter, news                     │
│  Admin:   login, manage vacancies, manage blog articles         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP / REST
                            │ fetch + TanStack Query
                            │ credentials: "include" (cookie auth)
┌───────────────────────────▼─────────────────────────────────────┐
│  Express.js Backend (port 4000)                                 │
│                                                                 │
│  /api/auth/*   — Better-Auth (session management)              │
│  /api/jobs     — Job CRUD                                       │
│  /api/news     — News/Blog CRUD                                 │
│  /health       — Health check                                   │
│  /api-docs     — Swagger UI                                     │
│                                                                 │
│  Request pipeline:                                              │
│    Route → Zod validation middleware → Controller → Service     │
└──────────────────┬──────────────────────────┬───────────────────┘
                   │                          │
       ┌───────────▼──────────┐   ┌───────────▼──────────────┐
       │  MariaDB (port 3306) │   │  Cloudflare R2           │
       │  via Prisma ORM      │   │  (S3-compatible storage) │
       │  DB: glowing_partner │   │  Signed URLs, 1hr expiry │
       └──────────────────────┘   └──────────────────────────┘
```

### Authentication Model

- All auth is handled by **Better-Auth** running on the backend.
- The backend issues **session cookies** on successful sign-in.
- The frontend auth client (`frontend/lib/auth-client.ts`) sends `credentials: "include"` with every request so cookies are forwarded automatically.
- CORS is explicitly restricted to `http://localhost:3000` — no other origins are trusted.
- Role-based access (`Admin`, `Editor`, `User`) is stored on the `Admin` model but not yet enforced via route middleware on job/news endpoints.

### Rendering Strategy

- The **public-facing pages** (homepage, vacancy list, news list) use Next.js App Router with client components for interactive filtering.
- The **admin dashboard** is entirely client-side rendered (React Query for data fetching, TanStack Table for display).
- There is no server-side rendering of dynamic data at this stage — all data fetching goes through the REST API.

---

## 2. Folder / File Structure Explanation

```
C:\Projects\GP/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma                  ← Single source of truth for the entire database schema.
│   │   │                                    All models, enums, and relations are defined here.
│   │   ├── seed.ts                        ← Database seeding script for development data.
│   │   └── migrations/                    ← Auto-generated SQL migration history.
│   │       ├── 20260420092148_init/
│   │       ├── 20260422075749_admin_modified_for_betterauth/
│   │       ├── 20260423020134_namingfixes/
│   │       ├── 20260423073634_schema_admin_changes/
│   │       ├── 20260425083321_cloudflare/
│   │       └── 20260425105914_jobchanges/
│   │
│   └── src/
│       ├── server.ts                      ← HTTP server entry point. Imports the Express app
│       │                                    from index.ts and starts listening on PORT (default 4000).
│       │
│       ├── index.ts                       ← Express application factory.
│       │                                    Registers all global middleware (CORS, Helmet,
│       │                                    compression), mounts routes and the Better-Auth
│       │                                    handler, and registers the global error handler.
│       │
│       ├── configs/
│       │   ├── cloudflare.ts              ← Creates and exports the AWS S3Client pointed at the
│       │   │                               Cloudflare R2 endpoint. Exports two helpers:
│       │   │                               getUrl() — signed GET URL (1hr expiry)
│       │   │                               putUrl() — signed PUT URL for direct browser upload (1hr expiry)
│       │   │
│       │   └── swagger.ts                 ← OpenAPI 3.0.0 configuration. Points swagger-jsdoc
│       │                                    at ./src/routes/*.ts to extract JSDoc annotations.
│       │                                    Serves the UI at /api-docs via swagger-ui-express.
│       │
│       ├── controllers/
│       │   ├── jobController.ts           ← Thin HTTP handler layer for jobs.
│       │   │                               Receives req/res, calls the appropriate service
│       │   │                               function, and returns the JSON response.
│       │   │                               Functions: getJobs, postJobs, getJobsById,
│       │   │                               updateJobs, deleteJobs.
│       │   │
│       │   └── newsController.ts          ← Thin HTTP handler layer for news articles.
│       │                                    Functions: getNews, postNews, getNewsById,
│       │                                    updateNews, deleteNews.
│       │
│       ├── lib/
│       │   ├── auth.ts                    ← Instantiates Better-Auth with the Prisma adapter.
│       │   │                               Configures email+password sign-in, the custom Admin
│       │   │                               model (with role field), and trusted origins.
│       │   │
│       │   └── prisma.ts                  ← Exports a singleton PrismaClient.
│       │                                    Uses the MariaDB adapter. Connection pool limit: 5.
│       │
│       ├── middlewares/
│       │   ├── validate.ts                ← Generic Zod validation middleware factory.
│       │   │                               validateCreate(schema) and validateUpdate(schema)
│       │   │                               both run schema.safeParse(req.body) and return
│       │   │                               HTTP 400 with Zod error details on failure.
│       │   │
│       │   └── errorMiddleware.ts         ← Four-argument Express error handler (err, req, res, next).
│       │                                    Logs the error to console and returns a generic 500
│       │                                    response. Applied last in index.ts.
│       │
│       ├── routes/
│       │   ├── jobs.route.ts              ← Express Router for /api/jobs.
│       │   │                               Wires validation middleware before each mutating handler.
│       │   │                               Contains all Swagger JSDoc annotations for the jobs API.
│       │   │
│       │   └── news.route.ts              ← Express Router for /api/news.
│       │                                    Same pattern as jobs.route.ts.
│       │                                    Contains all Swagger JSDoc annotations for the news API.
│       │
│       ├── schemas/
│       │   ├── job.schema.ts              ← Zod schemas for job request bodies.
│       │   │                               Exports: createJobSchema, updateJobSchema (partial),
│       │   │                               and inferred TypeScript types createJob, updateJob.
│       │   │
│       │   └── news.schema.ts             ← Zod schemas for news request bodies.
│       │                                    Exports: createNewsSchema, updateNewsSchema (partial),
│       │                                    and inferred TypeScript types createNews, updateNews.
│       │
│       ├── services/
│       │   ├── job.service.ts             ← All Prisma queries for jobs.
│       │   │                               Also handles time string → DateTime conversion and
│       │   │                               calls cloudflare.ts to generate signed R2 URLs.
│       │   │                               Functions: createJobs, fetchJobs, fetchJobsById,
│       │   │                               patchJobs, removeJobs.
│       │   │
│       │   ├── news.service.ts            ← All Prisma queries for news articles.
│       │   │                               Functions: createNews, fetchNews, fetchNewsById,
│       │   │                               patchNews, removeNews.
│       │   │
│       │   ├── application.service.ts     ← EMPTY STUB. Placeholder for future application
│       │   │                               submission and tracking logic.
│       │   │
│       │   └── contacts.service.ts        ← EMPTY STUB. Placeholder for future contact
│       │                                    request and reply logic.
│       │
│       └── types/
│           └── api.ts                     ← Defines the generic ApiResponse<T> interface used
│                                            as the shape of all JSON responses.
│                                            NOTE: Contains a known typo — the field is named
│                                            `messagge` (double-g) instead of `message`.
│
└── frontend/
    ├── app/                               ← Next.js 16 App Router root.
    │   ├── layout.tsx                     ← Root layout. Applies Geist font, wraps the entire
    │   │                                    app with TanStackProvider and AppRouterCacheProvider
    │   │                                    (MUI), and renders the persistent Navbar.
    │   │
    │   ├── page.tsx                       ← Public homepage. Composes the landing page sections
    │   │                                    in order: HeroSection, PartnerRibbon, PhilosophyPage,
    │   │                                    Infopoint, EmployeeSection, NewsSection, FooterSection.
    │   │
    │   ├── tanstack-provider.tsx          ← Creates a QueryClient and wraps children in
    │   │                                    QueryClientProvider. Imported by root layout.tsx.
    │   │
    │   ├── globals.css                    ← Global base styles and CSS custom property definitions
    │   │                                    (color tokens, font tokens).
    │   │
    │   ├── vacancy/
    │   │   └── page.tsx                   ← Public job search page. A client component that owns
    │   │                                    the Filterstype and Searchtype state. Renders
    │   │                                    SearchBar, Filter, and VacancySection, passing state
    │   │                                    down and receiving updates via callbacks.
    │   │
    │   ├── news/
    │   │   └── page.tsx                   ← Public news listing page. Currently contains
    │   │                                    placeholder/static content alongside the News component.
    │   │
    │   └── admin/
    │       ├── login/
    │       │   └── page.tsx               ← Admin login page. Split layout: left decorative panel
    │       │                               with brand colors, right panel with the LoginForm.
    │       │
    │       └── dashboard/
    │           ├── layout.tsx             ← Admin dashboard shell. Renders AdminDrawer (sidebar)
    │           │                           and a main content slot for child pages.
    │           │
    │           ├── vacancies/
    │           │   └── page.tsx           ← Job management page. Fetches all jobs via React Query,
    │           │                           renders a TanStack Table with inline-editable cells.
    │           │                           PATCH requests are sent on cell blur/confirm.
    │           │
    │           └── blogs/
    │               └── page.tsx           ← News management page. Fetches all news via React Query,
    │                                       renders a TanStack Table with sorting, status badges,
    │                                       and edit/delete action buttons.
    │
    ├── components/
    │   ├── Navbar.tsx                     ← Persistent top navigation bar. Listens to the scroll
    │   │                                    position and changes background color when the user
    │   │                                    scrolls past the hero section. Renders nav items with
    │   │                                    hover-triggered dropdown menus. Sub-items can have
    │   │                                    background images.
    │   │
    │   ├── HeroSection.tsx                ← Full-screen hero section with an HTML5 video background
    │   │                                    (WebM + MP4 with poster fallback). Includes a decorative
    │   │                                    grain overlay, headline text ("Different Is Good"),
    │   │                                    a "View Opportunities" CTA button, a scroll indicator
    │   │                                    animation, and custom CSS keyframe animations.
    │   │
    │   ├── Vacancies.tsx                  ← Public-facing vacancy grid. Renders a VacancyCard for
    │   │                                    each listing. Currently uses dummy data; intended to
    │   │                                    receive real data from the parent vacancy page.
    │   │                                    Cards show department badge, employment type, salary
    │   │                                    in JPY, location, and date posted.
    │   │
    │   ├── Filter.tsx                     ← Sidebar filter panel for the vacancy page. Contains
    │   │                                    a generic CheckboxGroup sub-component typed with
    │   │                                    `<G extends keyof Filterstype>` for type-safe state
    │   │                                    updates. Renders two groups: Schedule and Employment.
    │   │                                    Uses sticky positioning.
    │   │
    │   ├── SearchBar.tsx                  ← Job search bar. Contains a text input for keywords,
    │   │                                    a city dropdown (11 Japanese cities + "All cities"),
    │   │                                    an experience level dropdown (7 levels), and a salary
    │   │                                    range slider (0–100k, MUI Slider). Calls a parent
    │   │                                    callback on every change.
    │   │
    │   ├── LoginForm.tsx                  ← Admin email + password form. Includes a show/hide
    │   │                                    password toggle, remember-me checkbox, loading state
    │   │                                    on the submit button, and inline error messages.
    │   │                                    On success, redirects to /admin/dashboard/vacancies.
    │   │                                    Calls authClient.signIn.email() from auth-client.ts.
    │   │
    │   ├── Philosophy.tsx                 ← Company philosophy landing section.
    │   │
    │   ├── Employee.tsx                   ← Team/employee showcase landing section.
    │   │
    │   ├── AdminDrawer.tsx                ← Admin dashboard sidebar navigation. Renders navigation
    │   │                                    links for the dashboard sections (Vacancies, Blogs).
    │   │
    │   ├── Reusables/                     ← Shared UI primitive components used across the app.
    │   │
    │   ├── adminvacancy/
    │   │   ├── AddVacancy.tsx             ← "Add new job" button and associated form/dialog
    │   │   │                               for creating a new vacancy from the admin dashboard.
    │   │   │
    │   │   ├── EditableCell.tsx           ← TanStack Table cell renderer that switches between
    │   │   │                               a display value and an input/select editor. Used by
    │   │   │                               the vacancies admin page for inline row editing.
    │   │   │
    │   │   └── Forms.tsx                  ← Form field components used within the vacancy add/edit
    │   │                                    flow in the admin dashboard.
    │   │
    │   ├── news/
    │   │   └── News.tsx                   ← News section component for the public homepage.
    │   │                                    Renders a main news display area and a StackList
    │   │                                    sidebar showing recent article thumbnails.
    │   │
    │   └── Footer/
    │       ├── FooterSection.tsx          ← Root footer component, composes the columns.
    │       ├── Column1.tsx                ← First footer column content (brand/links).
    │       ├── Column2.tsx                ← Second footer column content (links/info).
    │       └── Helpers.tsx                ← Shared footer helper sub-components.
    │
    ├── hooks/
    │   ├── use-mobile.tsx                 ← Custom hook that returns a boolean indicating
    │   │                                    whether the current viewport is below the mobile
    │   │                                    breakpoint. Used for conditional rendering.
    │   │
    │   └── use-toast.tsx                  ← Custom hook for triggering toast notifications.
    │
    ├── lib/
    │   └── auth-client.ts                 ← Instantiates the Better-Auth browser client.
    │                                        Configured with baseURL: "http://localhost:4000"
    │                                        and fetchOptions: { credentials: "include" }.
    │                                        Exports: signIn, signUp, signOut, useSession.
    │
    ├── types/
    │   ├── table.ts                       ← TypeScript interfaces mirroring all Prisma models
    │   │                                    used on the frontend: JobCategory, Language,
    │   │                                    TechnicalSkill, Job, JobsResponse, Admin, News,
    │   │                                    NewsResponse. Also re-exports enums: NewsStatus, Role.
    │   │
    │   ├── filters.ts                     ← Defines Filterstype: an object with two boolean maps,
    │   │                                    schedule (full_time, part_time, contract, internship)
    │   │                                    and employment (sixdays, shift_based, flexible, fivedays).
    │   │
    │   └── search.ts                      ← Defines Searchtype: sliderValue (number[]),
    │                                        searchValue (string), city (string), exp (number).
    │
    ├── public/                            ← Static assets served directly by Next.js:
    │                                        images, hero video files, poster image, fonts.
    │
    ├── next.config.ts                     ← Next.js configuration. Whitelists two external image
    │                                        domains for the Image component: unsplash.com and
    │                                        upload.wikimedia.org.
    │
    ├── tsconfig.json                      ← TypeScript config. Target: ES2017, module resolution:
    │                                        bundler, path alias @/* → project root.
    │
    └── .env.local                         ← Single frontend environment variable:
                                             NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

## 3. Core Modules and Responsibilities

| Module | File | Responsibility |
|---|---|---|
| Express app factory | `backend/src/index.ts` | Wires all middleware (CORS, Helmet, compression), mounts routes and the Better-Auth handler, registers the global error handler |
| HTTP server entry | `backend/src/server.ts` | Imports the Express app and calls `app.listen(PORT)` |
| Prisma client | `backend/src/lib/prisma.ts` | Exports a singleton `PrismaClient` with MariaDB adapter and pool limit of 5 |
| Better-Auth instance | `backend/src/lib/auth.ts` | Configures email/password auth, Prisma adapter, custom Admin model with role field, and trusted origins |
| Zod validation middleware | `backend/src/middlewares/validate.ts` | Factory that accepts a Zod schema and returns an Express middleware; returns HTTP 400 with structured Zod errors on failure |
| Global error handler | `backend/src/middlewares/errorMiddleware.ts` | Catches any error passed via `next(err)`, logs it, and returns a generic HTTP 500 |
| Job schema | `backend/src/schemas/job.schema.ts` | Defines the validation contract for job creation and updates; enforces salary ordering, time format, and enum membership |
| News schema | `backend/src/schemas/news.schema.ts` | Defines the validation contract for news creation and updates; enforces character length limits |
| Job routes | `backend/src/routes/jobs.route.ts` | Declares the Express Router for `/api/jobs`, wires middleware and controller handlers, contains all Swagger JSDoc annotations |
| News routes | `backend/src/routes/news.route.ts` | Declares the Express Router for `/api/news`, same pattern as job routes |
| Job controller | `backend/src/controllers/jobController.ts` | Receives `req`/`res`, delegates to job service, formats and sends the JSON response |
| News controller | `backend/src/controllers/newsController.ts` | Same pattern as job controller, for news articles |
| Job service | `backend/src/services/job.service.ts` | Executes all Prisma queries for jobs; handles time string conversion and calls Cloudflare config for signed URLs |
| News service | `backend/src/services/news.service.ts` | Executes all Prisma queries for news articles |
| Cloudflare config | `backend/src/configs/cloudflare.ts` | Creates the `S3Client` for Cloudflare R2 and exports `getUrl()` and `putUrl()` signed URL generators |
| Swagger config | `backend/src/configs/swagger.ts` | Configures `swagger-jsdoc` to scan route files and `swagger-ui-express` to serve the UI at `/api-docs` |
| API response type | `backend/src/types/api.ts` | Defines the generic `ApiResponse<T>` interface shared by all controllers |
| Auth client | `frontend/lib/auth-client.ts` | Browser-side Better-Auth client; the single integration point for all frontend authentication calls |
| TanStack Query provider | `frontend/app/tanstack-provider.tsx` | Creates `QueryClient` and wraps the app in `QueryClientProvider` |
| Public job search page | `frontend/app/vacancy/page.tsx` | Owns filter and search state; composes `SearchBar`, `Filter`, and vacancy display |
| Admin vacancies page | `frontend/app/admin/dashboard/vacancies/page.tsx` | Full CRUD table for jobs using TanStack Table with inline cell editing |
| Admin blogs page | `frontend/app/admin/dashboard/blogs/page.tsx` | Full CRUD table for news articles using TanStack Table |
| Editable cell | `frontend/components/adminvacancy/EditableCell.tsx` | Switches between display and input mode within a TanStack Table cell; triggers PATCH on confirm |
| Login form | `frontend/components/LoginForm.tsx` | Manages form state, calls `authClient.signIn.email()`, handles error display and redirect |
| Frontend types | `frontend/types/table.ts` | TypeScript interfaces for all API response shapes; kept in sync manually with the Prisma schema |

---

## 4. Data Flow (Step-by-Step)

### 4.1 Public Homepage Load

1. Browser navigates to `http://localhost:3000/`.
2. Next.js renders `app/layout.tsx`, which applies fonts, renders the `Navbar`, and wraps content in `TanStackProvider` and `AppRouterCacheProvider`.
3. `app/page.tsx` renders the landing page sections in order: `HeroSection`, `PartnerRibbon`, `PhilosophyPage`, `Infopoint`, `EmployeeSection`, `NewsSection`, `FooterSection`.
4. Each section is self-contained and renders from static or locally defined data — no API calls are made on the homepage at this stage.

### 4.2 Public Job Search

1. User navigates to `/vacancy`.
2. `app/vacancy/page.tsx` initialises two pieces of React state: `filters` (type `Filterstype`) and `search` (type `Searchtype`).
3. The page renders `SearchBar` and `Filter` components, passing the current state and setter callbacks as props.
4. User types in the search bar → `SearchBar` calls the `onSearchChange` callback → `search` state updates → component re-renders.
5. User checks a filter checkbox → `Filter` calls the `onFilterChange` callback → `filters` state updates → component re-renders.
6. `VacancySection` (or equivalent) receives the current `filters` and `search` as props and passes them as query parameters when calling `GET /api/jobs`.
7. React Query holds the cached job list. On parameter change, it re-fetches.
8. **Backend receives `GET /api/jobs`:** `jobs.route.ts` routes to `jobController.getJobs()` → calls `job.service.fetchJobs()` → Prisma executes `findMany` with `include: { job_category, languages, technical_skills }` → MariaDB returns rows → Prisma maps to typed objects → service returns array → controller serialises to `ApiResponse<Job[]>` → HTTP 200.
9. React Query stores the response. `VacancyCard` components render.

### 4.3 Admin Login

1. User navigates to `/admin/login`.
2. `LoginForm` renders email and password fields.
3. User submits the form → `LoginForm` calls `authClient.signIn.email({ email, password, callbackURL: "/admin/dashboard/vacancies" })`.
4. Better-Auth client sends `POST /api/auth/sign-in/email` to the backend.
5. **Backend:** Better-Auth handler receives the request, queries the `Admin` table via Prisma, verifies the hashed password, creates a `Session` record, and sets a session cookie in the response `Set-Cookie` header.
6. Browser stores the cookie. Better-Auth client resolves. `LoginForm` follows the `callbackURL` redirect.
7. User lands on `/admin/dashboard/vacancies`.

### 4.4 Admin Job Table Load

1. `app/admin/dashboard/layout.tsx` renders `AdminDrawer` and the page content slot.
2. `vacancies/page.tsx` mounts and `useQuery` triggers `GET /api/jobs` (with `credentials: "include"` so the session cookie is sent).
3. Response is the same as §4.2 steps 7–8.
4. TanStack Table receives the data array and renders rows. Column definitions map to job fields. `EditableCell` is used for editable columns.

### 4.5 Admin Inline Job Edit

1. Admin clicks a cell in the job table → `EditableCell` switches to edit mode (renders an `<input>` or `<select>`).
2. Admin modifies the value and confirms (blur or Enter key).
3. `EditableCell` calls `PATCH /api/jobs/:id` with the updated field as the request body.
4. **Backend pipeline:** `jobs.route.ts` routes to `validateUpdate(updateJobSchema)` middleware → `updateJobSchema.safeParse(req.body)` runs → if invalid, returns HTTP 400 with Zod error details → if valid, passes to `jobController.updateJobs()` → calls `job.service.patchJobs(id, data)` → Prisma executes `update` with the partial data → returns updated job record → controller responds with `ApiResponse<Job>` → HTTP 200.
5. React Query invalidates the `jobs` query key → table re-fetches and displays fresh data.

### 4.6 Image Upload for a Job

1. Admin creates or edits a job and selects an image file.
2. The job creation request hits `POST /api/jobs`.
3. `job.service.createJobs()` calls `putUrl(key)` from `cloudflare.ts`, which uses `@aws-sdk/client-s3`'s `PutObjectCommand` and `getSignedUrl` to generate a time-limited signed PUT URL for Cloudflare R2.
4. The signed PUT URL is returned to the frontend in the API response alongside the created job record.
5. The frontend uses the signed URL to PUT the image file directly to Cloudflare R2 from the browser — the image never passes through the Express server.
6. To display an image: `job.service.fetchJobs()` calls `getUrl(key)` → generates a signed GET URL (1-hour expiry) → included in the job response.

### 4.7 News Article Creation

1. Admin fills in the new article form in `blogs/page.tsx`.
2. Form submits → `POST /api/news` with body `{ title, body, summary, status, adminId }`.
3. **Backend pipeline:** `news.route.ts` → `validateCreate(createNewsSchema)` → checks title (5–255 chars), body (≥20 chars), summary (10–500 chars), status enum → on failure returns HTTP 400 → on success passes to `newsController.postNews()` → calls `news.service.createNews(data)` → Prisma `create` with `admin: { connect: { id: adminId } }` → returns created record → HTTP 201.
4. React Query invalidates the `news` query key → table re-fetches.

### 4.8 Error Propagation

1. Any service or controller that throws an unhandled error passes it to Express's `next(err)`.
2. `errorMiddleware.ts` catches it, logs `err` to `console.error`, and responds with HTTP 500 and the message `"Internal server error"`.
3. Zod validation failures are handled before reaching the controller and return HTTP 400 with structured Zod `ZodError` details.

---

## 5. API Routes / Endpoints

**Backend base URL:** `http://localhost:4000`  
**Interactive API docs:** `http://localhost:4000/api-docs` (Swagger UI, OpenAPI 3.0.0)

---

### 5.1 Authentication — `/api/auth/*`

All routes under this prefix are handled entirely by Better-Auth. The Express app mounts the Better-Auth handler at `/api/auth`.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/sign-up/email` | Register a new admin user with email, password, and name |
| POST | `/api/auth/sign-in/email` | Sign in with email and password; sets a session cookie |
| POST | `/api/auth/sign-out` | Invalidates the current session and clears the cookie |
| GET | `/api/auth/session` | Returns the current session and user if authenticated |

---

### 5.2 Jobs — `/api/jobs`

| Method | Path | Middleware | Controller Function | Description |
|---|---|---|---|---|
| GET | `/api/jobs` | — | `getJobs` | Returns all jobs. Each job includes its `job_category`, `languages`, and `technical_skills` as nested objects. |
| POST | `/api/jobs` | `validateCreate(createJobSchema)` | `postJobs` | Creates a new job. Validates the full request body. Returns the created job record and a signed Cloudflare R2 PUT URL for image upload. |
| GET | `/api/jobs/:id` | — | `getJobsById` | Returns a single job by its UUID `id`. |
| PATCH | `/api/jobs/:id` | `validateUpdate(updateJobSchema)` | `updateJobs` | Partially updates a job. Only provided fields are changed. |
| DELETE | `/api/jobs/:id` | — | `deleteJobs` | Hard-deletes a job by its UUID `id`. |

**Job creation request body fields (createJobSchema):**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | yes | — |
| `salary_min` | number | yes | ≥ 0 |
| `salary_max` | number | yes | > `salary_min` |
| `location` | string | yes | — |
| `experience` | number | yes | — |
| `contract` | enum | yes | `Full_time \| Part_time \| Internship \| Flexible` |
| `shift_start` | string | no | Format: `HH:MM` (regex validated) |
| `shift_end` | string | no | Format: `HH:MM` (regex validated) |
| `languages` | string[] | no | Each entry is connected or created by name |
| `technical_skills` | string[] | no | Each entry is connected or created by name |
| `job_category` | string | no | Connected or created by name |
| `status` | enum | no | `Draft \| Published \| Closed \| Archived` (defaults to `Draft`) |

---

### 5.3 News — `/api/news`

| Method | Path | Middleware | Controller Function | Description |
|---|---|---|---|---|
| GET | `/api/news` | — | `getNews` | Returns all news articles ordered by `published_at` descending. Each article includes the associated `admin` record. |
| POST | `/api/news` | `validateCreate(createNewsSchema)` | `postNews` | Creates a new news article. Associates the article with an `adminId`. |
| GET | `/api/news/:id` | — | `getNewsById` | Returns a single article by its UUID `id`. |
| PATCH | `/api/news/:id` | `validateUpdate(updateNewsSchema)` | `updateNews` | Partially updates an article. Only provided fields are changed. |
| DELETE | `/api/news/:id` | — | `deleteNews` | Hard-deletes an article by its UUID `id`. |

**News creation request body fields (createNewsSchema):**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | yes | 5–255 characters |
| `body` | string | yes | Minimum 20 characters |
| `summary` | string | yes | 10–500 characters |
| `status` | enum | yes | `published \| closed` |
| `adminId` | string | yes | UUID of the authoring admin |

---

### 5.4 Health Check

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Returns `{ status: "ok" }`. Used to verify the server is running. |

---

### 5.5 Standard Response Shape

All non-auth endpoints return JSON conforming to the `ApiResponse<T>` interface:

```
{
  "messagge": "...",   ← note: intentional typo in source code (double-g)
  "data": <T>
}
```

HTTP status codes used: `200` (success), `201` (created), `400` (validation failure), `404` (not found), `500` (server error).

---

## 6. Key Business Logic Rules

### 6.1 Salary Ordering

Defined in `createJobSchema` (and enforced via a Zod `.refine()`): `salary_min` must be strictly less than `salary_max`. A request where `salary_min >= salary_max` is rejected with HTTP 400.

### 6.2 Shift Time Format

`shift_start` and `shift_end` must conform to the regex `^([01]\d|2[0-3]):([0-5]\d)$`. This accepts `00:00` through `23:59` only. Values like `24:00` or `9:5` are rejected.

### 6.3 Time String to DateTime Conversion

The frontend sends shift times as simple `HH:MM` strings. The job service (`job.service.ts`) converts these to ISO 8601 `DateTime` objects before writing to the database, because the Prisma schema stores them as `DateTime` columns. When reading back from the database, the frontend receives full `DateTime` objects and must extract only the time portion for display.

### 6.4 Relation Deduplication via `connectOrCreate`

`Job.languages`, `Job.technical_skills`, and `Job.job_category` all use Prisma's `connectOrCreate` pattern, keyed on the `name` field. This means:

- If a skill named `"React"` already exists in the `Skill` table, the new job is connected to the existing record.
- If it does not exist, a new `Skill` record is created and then connected.
- Deduplication is **case-sensitive and exact-match only**. `"React"` and `"react"` are stored as two separate records.

### 6.5 Job Status Lifecycle

Jobs follow this status lifecycle via the `JobStatus` enum:

```
Draft → Published → Closed → Archived
```

The default status on creation is `Draft`. Status transitions are not enforced programmatically — any valid enum value can be set via a PATCH request.

### 6.6 Application Status Lifecycle

The `ApplicationStatus` enum defines: `Pending → Reviewed → Rejected | Accepted`. This logic is schema-only at present; the application service is an empty stub.

### 6.7 News Status

News articles are either `published` or `closed`. There is no draft state for news. The status is set at creation and can be changed via PATCH.

### 6.8 News Article Ordering

`fetchNews()` always returns articles ordered by `published_at DESC` — most recently published articles appear first.

### 6.9 Role-Based Access

Three roles are defined on the `Admin` model: `Admin`, `Editor`, `User`. The default role assigned to a new account is `User`. The role field is available on the session but is **not currently enforced** on any API route — all authenticated and unauthenticated clients have equal access to mutating endpoints.

### 6.10 Signed URL Expiry

All Cloudflare R2 signed URLs (both GET and PUT) have a hard-coded expiry of **one hour**. Job image URLs returned in API responses will become invalid after one hour. There is no automatic refresh or re-signing mechanism.

### 6.11 No Pagination

All list endpoints (`GET /api/jobs`, `GET /api/news`) return every record in the database with no limit or offset. As the dataset grows, response sizes will increase without bound.

### 6.12 Hard Deletes Only

All `DELETE` operations perform hard deletes directly against the database. There is no soft-delete mechanism (no `deleted_at` column or `isDeleted` flag) on any model.

### 6.13 Validation is Only at the API Boundary

Zod validation runs in the `validate.ts` middleware before the controller is called. Services and the database layer trust that data passed to them has already been validated. No secondary validation occurs inside service functions.

---

## 7. External Dependencies and Integrations

### 7.1 MariaDB

- **Role:** Primary relational database.
- **Access:** Exclusively through Prisma ORM — no raw SQL is written in the application code.
- **Adapter:** `@prisma/adapter-mariadb` (not the default MySQL adapter; these are distinct).
- **Connection:** `DATABASE_URL` in `backend/.env` using the `mysql://` protocol URI format. The MariaDB adapter accepts this format.
- **Pool:** Configured with `connectionLimit: 5` in `prisma.ts`.
- **Local setup:** Expects MariaDB running on `localhost:3306` with database `glowing_partner`.

### 7.2 Prisma ORM

- **Version:** Configured in `backend/package.json`.
- **Schema location:** `backend/prisma/schema.prisma`.
- **Generated client:** `backend/src/generated/prisma/` — auto-generated by `prisma generate` and imported throughout the backend.
- **Migration history:** Six migrations in `backend/prisma/migrations/`, tracked chronologically from initial schema through the Cloudflare and job model updates.
- **Commands:** `npx prisma migrate dev` (apply migrations and regenerate client), `npx prisma studio` (GUI browser), `npx prisma db seed` (run seed script).

### 7.3 Better-Auth

- **Role:** Authentication framework handling sessions, password hashing, and user management.
- **Backend instance:** `backend/src/lib/auth.ts` — uses the Prisma adapter to read/write `Admin`, `Session`, `Account`, and `Verification` records.
- **Frontend client:** `frontend/lib/auth-client.ts` — browser-side SDK that wraps `fetch` calls to the backend auth endpoints and exposes `signIn`, `signUp`, `signOut`, and `useSession`.
- **Required environment variables:** `BETTER_AUTH_SECRET` (a long random string used for signing tokens) and `BETTER_AUTH_URL` (the backend's base URL, `http://localhost:4000`).
- **Trusted origins:** Explicitly set to `http://localhost:3000`. Requests from any other origin are rejected.
- **Session storage:** Server-side sessions in the `Session` table; session token delivered to the browser via `Set-Cookie`.

### 7.4 Cloudflare R2

- **Role:** Object storage for job images.
- **SDK:** `@aws-sdk/client-s3` — Cloudflare R2 is S3-compatible, so the standard AWS SDK is used.
- **Configuration:** `backend/src/configs/cloudflare.ts` creates an `S3Client` with:
  - `endpoint`: the Cloudflare R2 endpoint from `S3_ENDPOINT` env var.
  - `credentials`: `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY` env vars.
  - `region`: `"auto"` (Cloudflare R2 does not use AWS regions).
- **Upload pattern:** Presigned PUT URLs are generated by the backend and returned to the frontend. The browser uploads directly to R2 — the image never passes through the Express server.
- **Display pattern:** Presigned GET URLs are generated on every read and included in job API responses. URLs expire after one hour.
- **Required environment variables:** `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `S3_ENDPOINT`, `S3_ACCOUNT_ID`.

### 7.5 Key Backend NPM Packages

| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `better-auth` | Authentication (sessions, password hashing) |
| `@prisma/client` | Generated Prisma ORM client |
| `@prisma/adapter-mariadb` | MariaDB-specific Prisma adapter |
| `@aws-sdk/client-s3` | Cloudflare R2 (S3-compatible) signed URLs |
| `zod` | Runtime schema validation for request bodies |
| `helmet` | Security headers middleware |
| `cors` | Cross-origin resource sharing middleware |
| `compression` | HTTP response compression middleware |
| `swagger-jsdoc` | Generates OpenAPI spec from JSDoc comments |
| `swagger-ui-express` | Serves Swagger UI at `/api-docs` |
| `typescript` | TypeScript compiler |
| `ts-node-dev` | TypeScript hot-reload development runner |

### 7.6 Key Frontend NPM Packages

| Package | Purpose |
|---|---|
| `next` | App Router framework (v16.1.7) |
| `react` | UI library (v19.2.3) |
| `better-auth/client` | Browser-side auth SDK |
| `@tanstack/react-query` | Server-state caching, refetching, and mutations |
| `@tanstack/react-table` | Headless table with sorting, filtering, and inline editing |
| `@mui/material` | Material-UI components (Slider, Select, FormControl, Button) |
| `@mui/icons-material` | Material-UI icon set |
| `@emotion/react` / `@emotion/styled` | MUI's CSS-in-JS runtime |
| `tailwindcss` | Utility-first CSS framework (primary styling method) |
| `lucide-react` | SVG icon library |
| `gsap` | Advanced animation library (used in HeroSection and landing) |
| `framer-motion` | React animation primitives |
| `swiper` | Touch/carousel component (PartnerRibbon on homepage) |
| `zod` | Schema validation (mirrors backend validation patterns) |
| `typescript` | TypeScript compiler |

---

## 8. Important Edge Cases and Constraints

### 8.1 Signed URL Expiry — Images Break After One Hour

Cloudflare R2 signed GET URLs embedded in job API responses expire after exactly one hour. If the React Query cache holds a job list for longer than one hour (the default `staleTime` is 0, so this depends on cache configuration), subsequent image renders will receive HTTP 403 from R2. There is no URL refresh or re-signing mechanism implemented. Jobs must be re-fetched to get fresh image URLs.

### 8.2 Typo in `ApiResponse<T>` Interface

The field in `backend/src/types/api.ts` is spelled `messagge` (double-g), not `message`. All controllers that use this type emit `messagge` in JSON responses. Any frontend code that reads this field must use the misspelled key. Renaming it is a non-trivial change because it touches every controller response and every frontend consumer.

### 8.3 No Authentication Guards on Job and News Mutation Endpoints

`POST`, `PATCH`, and `DELETE` on `/api/jobs` and `/api/news` do not verify that the incoming request has a valid session cookie. Any unauthenticated HTTP client can create, modify, or delete records. This is a known gap — the middleware infrastructure (Better-Auth session verification) exists but has not been applied to these routes yet.

### 8.4 CORS Locked to `localhost:3000`

The CORS configuration in `backend/src/index.ts` only allows `http://localhost:3000`. Any deployment to a non-localhost domain requires this to be updated. There is no environment-variable-driven CORS origin configuration — it is hardcoded.

### 8.5 Empty Service Stubs

`application.service.ts` and `contacts.service.ts` are empty files. The `Application`, `ContactRequest`, and `ContactReply` models are fully defined in `schema.prisma` and exist in the database after migrations, but there are no API routes, controllers, or service implementations for them. Any feature depending on these models requires building the full stack from scratch.

### 8.6 Skill / Language / Category Deduplication is Case-Sensitive

The `connectOrCreate` logic keys on the `name` field with exact string matching. Entering `"React"` and `"react"` as skill names creates two separate `Skill` records. There is no normalisation (lowercasing, trimming) in the service layer before the Prisma call.

### 8.7 No Pagination on List Endpoints

`fetchJobs()` and `fetchNews()` issue `findMany()` with no `take` or `skip`. The entire table is returned on every request. This will cause performance degradation as record counts grow and is incompatible with any future infinite scroll or pagination UI without a breaking API change.

### 8.8 MariaDB Adapter — Not the MySQL Adapter

The project uses `@prisma/adapter-mariadb` (a dedicated community adapter for MariaDB's wire protocol). This is different from the built-in Prisma MySQL driver. The `DATABASE_URL` uses the `mysql://` scheme as required by this adapter, but switching to the standard Prisma MySQL provider would require changes to both the adapter import in `prisma.ts` and the `datasource` block in `schema.prisma`.

### 8.9 `shift_start` / `shift_end` Stored as DateTime, Displayed as Time

The Prisma schema stores shift times as `DateTime` columns. The service layer converts `"HH:MM"` strings to full `DateTime` objects before writing (using an arbitrary date as the date component). Reading these values back returns full `DateTime` ISO strings. The frontend must parse and display only the time portion. If the arbitrary date used during conversion is ever changed, stored values will be inconsistent.

### 8.10 Frontend Type Definitions Are Manually Maintained

`frontend/types/table.ts` contains TypeScript interfaces that mirror the Prisma schema. These are **not auto-generated** — they must be updated manually whenever the Prisma schema changes. If a migration adds or renames a field and `table.ts` is not updated, the TypeScript types will silently diverge from the actual API response shapes.

### 8.11 News Page is Partially Placeholder

`app/news/page.tsx` contains static placeholder content alongside the `News` component. The public news listing page is not yet wired to the `GET /api/news` endpoint. The admin blogs dashboard is functional, but the public-facing display of news articles is incomplete.

### 8.12 `Vacancies.tsx` Uses Dummy Data

The public-facing `Vacancies.tsx` component currently renders from a hardcoded local array of dummy job listings, not from the API. The `GET /api/jobs` endpoint is functional and consumed by the admin dashboard, but the public vacancy grid has not yet been connected to live data.

### 8.13 Better-Auth `callbackURL` Redirect

`LoginForm.tsx` passes `callbackURL: "/admin/dashboard/vacancies"` to `authClient.signIn.email()`. If the Better-Auth client version does not support `callbackURL` as a redirect mechanism, the redirect may not fire and the user will remain on the login page with no visible error. The redirect relies on Better-Auth's client-side behaviour, not a server-side redirect.

---

## 9. New Developer Onboarding Guide

### 9.1 Prerequisites

- **Node.js** 18 or higher
- **MariaDB** running locally on port 3306 (not MySQL — MariaDB specifically, due to the adapter)
- **Cloudflare R2 bucket** (or a local S3-compatible mock such as MinIO for development without R2 access)
- A Cloudflare R2 API token with read/write access to the bucket

### 9.2 Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 9.3 Configure Environment Variables

**Backend — create `backend/.env`:**

```
PORT=4000

DATABASE_URL=mysql://root:<password>@localhost:3306/glowing_partner
DATABASE_USER=root
DATABASE_PASSWORD=<your-mariadb-password>
DATABASE_NAME=glowing_partner
DATABASE_HOST=localhost
DATABASE_PORT=3306

BETTER_AUTH_SECRET=<any-long-random-string-at-least-32-chars>
BETTER_AUTH_URL=http://localhost:4000

ACCESS_KEY_ID=<cloudflare-r2-access-key-id>
SECRET_ACCESS_KEY=<cloudflare-r2-secret-access-key>
S3_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
S3_ACCOUNT_ID=<your-cloudflare-account-id>
```

**Frontend — create `frontend/.env.local`:**

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 9.4 Create the Database and Run Migrations

```bash
# Create the database in MariaDB first (if it doesn't exist):
# mysql -u root -p -e "CREATE DATABASE glowing_partner;"

cd backend
npx prisma migrate dev
# This applies all 6 migrations and regenerates the Prisma client.
# The generated client is written to backend/src/generated/prisma/.
```

### 9.5 Seed the Database (Optional)

```bash
cd backend
npx prisma db seed
# Populates the database with development data defined in prisma/seed.ts.
```

### 9.6 Create an Admin User

There is no admin seeding script by default. Create an admin account via the API:

```bash
curl -X POST http://localhost:4000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "YourPassword123", "name": "Admin"}'
```

Or use Prisma Studio to insert a record directly:

```bash
cd backend
npx prisma studio
# Opens a GUI at http://localhost:5555
```

### 9.7 Start Both Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Starts on http://localhost:4000 with ts-node-dev hot-reload

# Terminal 2 — Frontend
cd frontend
npm run dev
# Starts on http://localhost:3000 with Next.js hot-reload
```

### 9.8 Verify the Setup

| Check | URL / Command |
|---|---|
| Backend health | `GET http://localhost:4000/health` → `{ "status": "ok" }` |
| API documentation | `http://localhost:4000/api-docs` |
| Prisma Studio | `npx prisma studio` → `http://localhost:5555` |
| Frontend homepage | `http://localhost:3000` |
| Admin login | `http://localhost:3000/admin/login` |
| Admin vacancies | `http://localhost:3000/admin/dashboard/vacancies` |
| Admin blogs | `http://localhost:3000/admin/dashboard/blogs` |

### 9.9 Key Mental Models

**Backend request lifecycle:**

```
HTTP Request
  → Express middleware (CORS, Helmet, compression)
  → Route handler in routes/*.ts
  → validateCreate / validateUpdate middleware (Zod safeParse)
      → HTTP 400 + ZodError details if invalid
  → Controller function (jobController / newsController)
  → Service function (Prisma query + business logic)
  → ApiResponse<T> JSON → HTTP 200/201
  → (on any thrown error) → errorMiddleware → HTTP 500
```

**Frontend state model:**

```
Session state      → Better-Auth useSession() hook
Server data state  → TanStack Query (useQuery / useMutation)
Local UI state     → React useState (filters, search inputs, form fields)
Routing            → Next.js App Router (file-based)
```

**Admin dashboard component hierarchy:**

```
app/admin/dashboard/layout.tsx     ← Persistent shell with AdminDrawer
  ├── vacancies/page.tsx           ← TanStack Table for job management
  │     ├── EditableCell.tsx       ← Per-cell inline editor
  │     └── Forms.tsx              ← Add/edit form fields
  └── blogs/page.tsx               ← TanStack Table for news management
```

**Database relation map:**

```
Admin        ──< News               (one Admin authors many News articles)
Job          ──< Application        (one Job receives many Applications)
Job          >──< Language          (many-to-many, via implicit join table)
Job          >──< TechnicalSkill    (many-to-many, via implicit join table)
Job          >── JobCategory        (many Jobs belong to one Category)
Application  >──< Language          (many-to-many)
Application  >──< Skill             (many-to-many)
ContactRequest ──< ContactReply     (one Request has many Replies)
Admin        — Session, Account, Verification  (Better-Auth managed tables)
```

**Prisma model to API resource mapping:**

| Prisma Model | API Resource | Status |
|---|---|---|
| `Job` | `/api/jobs` | Fully implemented |
| `News` | `/api/news` | Fully implemented |
| `Admin` | `/api/auth/*` | Managed by Better-Auth |
| `Application` | (none) | Schema only — stub service |
| `ContactRequest` / `ContactReply` | (none) | Schema only — stub service |
| `JobCategory` | Embedded in Job | No standalone endpoint |
| `Skill` / `Language` | Embedded in Job | No standalone endpoint |

### 9.10 Where to Start When Adding a New Feature

**To add a new API resource** (e.g., Applications):

1. Verify the model exists in `backend/prisma/schema.prisma`. Run `npx prisma migrate dev` if you add fields.
2. Create `backend/src/schemas/application.schema.ts` with Zod schemas.
3. Implement `backend/src/services/application.service.ts` with Prisma queries.
4. Create `backend/src/controllers/applicationController.ts` with thin handler functions.
5. Create `backend/src/routes/application.route.ts` with Express Router and Swagger JSDoc.
6. Mount the new router in `backend/src/index.ts`.
7. Add corresponding TypeScript interfaces to `frontend/types/table.ts`.
8. Build the frontend page and components.

**To add a new admin dashboard page:**

1. Create `frontend/app/admin/dashboard/<name>/page.tsx`.
2. Add a navigation link in `frontend/components/AdminDrawer.tsx`.
3. Fetch data via `useQuery` from the relevant API endpoint.
4. Use TanStack Table for tabular display, following the pattern in `vacancies/page.tsx`.

**To modify the database schema:**

1. Edit `backend/prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name <description>` to create and apply the migration.
3. Update `frontend/types/table.ts` manually to reflect the schema change.
4. Update any Zod schemas in `backend/src/schemas/` if the change affects request validation.

### 9.11 Known Issues to Be Aware Of Immediately

- The `messagge` typo in `ApiResponse<T>` is present in all API responses. Do not fix it without updating every frontend consumer at the same time.
- Job and news mutation endpoints have no authentication guard — do not expose the backend to the public internet in this state.
- Signed image URLs from Cloudflare R2 expire after one hour. During development this means images in the admin table will stop loading if you leave the page idle.
- The public `/vacancy` page and `/news` page are not yet connected to the live API — they show dummy/placeholder data.

---

*Document generated from the `master` branch. Single WIP commit: `b79aaf7`. All file paths are relative to `C:\Projects\GP\`.*
