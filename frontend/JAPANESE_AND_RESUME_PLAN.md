# Plan: Japanese public-facing site + CV-style Japanese DOCX export

## Context

**Why this is being done**

1. **Site language.** Glowing Partner currently ships in English, but the target audience (candidates and hiring companies) is Japanese-speaking. The client wants the public-facing pages in Japanese while keeping the admin dashboard in English (admins are internal).
2. **Resume export.** The admin panel exports each applicant as a `.docx`, but today it's a linear English paragraph flow. The recruitment team's actual workflow uses a highly structured "ヒアリングシート (スキルシート)" hearing sheet — see `frontend/public/CV - Google Sheets.pdf`. The current export can't be handed to a partner company as-is.

**Intended outcome (minimum viable — "Path 1")**

- Public pages read in Japanese. No i18n framework, no language switcher — English is replaced in place.
- Resume DOCX renders in the same table layout as the reference PDF, with Japanese labels, using **only fields already stored** on `Application`. Template cells for data we don't collect (visa expiry, photo, katakana name, multi-row education/work history, licenses, hobbies, commute route, 所感) render as empty but bordered.
- Admin dashboard unchanged.
- No schema changes, no new applicant form fields, no new dependencies.

## Scope

### Part A — Translation catalog (today)

Client will supply the actual Japanese copy. My job this pass is to produce the catalog file they fill in.

**Deliverable**: `frontend/translations.en-ja.txt` — plain text, grouped by file, every user-facing English string listed with location/context notes and a blank `JA:` slot. Admin excluded.

**Catalog entry format**

```
================================================================
FILE: components/Navbar.tsx
Route(s): (global — appears on every public page)
================================================================

[1] Nav item — desktop + mobile menu, order 1
    EN: Home
    JA: __________

[2] CTA button — top-right of navbar
    EN: Contact us
    JA: __________
```

Every entry includes: a numeric index (for later back-reference when we paste translations in), a one-line "where it appears" note, the English source, and a `JA:` slot.

**Files enumerated** (public/user-facing only — admin excluded):

Navigation & chrome
- `components/Navbar.tsx`
- `components/footer/FooterSection.tsx`, `Column1.tsx`, `Column2.tsx`

Home page
- `app/page.tsx`
- `components/HeroSection.tsx`
- `components/Philosophy.tsx`
- `components/InfoPoint.tsx`
- `components/Employee.tsx`
- `components/FAQ.tsx`

About page
- `app/about/page.tsx`
- `components/about/IntroSection.tsx`
- `components/about/TeamSection.tsx`
- `components/about/Timeline.tsx`
- `components/about/LeadershipSection.tsx`
- `components/about/CorporateInfo.tsx`

Services / Business
- `app/services/for-job-seeker/page.tsx`
- `app/services/for-recruiter/page.tsx`
- `app/business/*/page.tsx` (all four business routes)

Vacancy
- `app/vacancy/page.tsx` (chrome only — DB job data is not translated)
- `components/Vacancies.tsx`
- `app/vacancy/[id]/apply/page.tsx` (form labels, step titles, buttons)

Contact forms
- `app/contact/company/page.tsx`
- `app/contact/customer/page.tsx`

News (chrome only)
- `app/news/page.tsx`
- `components/news/News.tsx`

Shared bits
- `components/Reusables/Reusables.tsx` (upload widget labels)
- `schemas/application.schemas.ts` (Zod error messages + option labels: Male/Female/Other, visa statuses, JLPT, contract types, working-day names)
- `schemas/contact.schemas.ts` (Zod error messages)

**Non-goals for Part A**
- Do NOT translate now — wait for client's filled-in file.
- Do NOT touch admin files (anything under `app/admin/*` or `components/admin*`).
- Do NOT translate DB content (job titles, news bodies, applicant free-text). Data-layer problem, out of scope.
- No new library (no `next-intl`), no locale routing, no cookie/localStorage toggle.

**Follow-up (later session, after client returns the file)**: paste `JA:` values back into their source files as literal string replacements. Mechanical pass, not part of this plan.

### Part B — Rewrite `backend/src/services/resume.service.ts` (next session)

Replace the linear paragraph flow with a `docx` `Table` mirroring the reference PDF layout. Uses only fields already on `Application` (see `backend/prisma/schema.prisma:101`).

**Layout — page 1** (single `Table`, all cells with borders):

| Row | Contents | Notes |
|---|---|---|
| 1 | Merged title bar: `(株)Glowing Partner ヒアリングシート(スキルシート)` centered, plus today's date right-aligned | Dark-green shading `#145652`, white bold text |
| 2 | `Alphabet` \| `full_name.toUpperCase()` \| *(photo cell — merged rows 2–4, blank)* | Photo cell empty; footprint preserved |
| 3 | `氏名` \| `full_name` \| *(photo cont.)* | Same name — we only store one name field |
| 4 | `生年月日` \| `YYYY年 M月 D日 ( 満 N 歳 )` \| `性別` \| Japanese gender \| *(photo cont.)* | Age computed from `date_of_birth` |
| 5 | `在留資格` \| Japanese residence status \| `在留期限` \| *(blank)* | No `visa_expiry` field |
| 6 | `現住所` \| `〒` blank + address merged, `国籍` \| `country` | Postal code cell blank |
| 7 | `最寄駅` \| `nearest_station` \| `通勤時間` \| *(blank)* | Commute time not stored |
| 8 | `TEL` \| `phone_number` \| `E-mail` \| `email` | |
| 9 | Section header `年 \| 月 \| 【学歴】` | Dark-green header |
| 10 | *(blank year/month)* \| `school_college` — `degree` | One combined row |
| 11 | Section header `年 \| 月 \| 【職歴（アルバイトを含む）】` | Dark-green header |
| 12 | Three blank rows preserving template footprint | |
| 13 | Section header `年 \| 月 \| 【免許・資格】` | Dark-green header |
| 14 | Two blank rows | |
| 15 | Section header `言語スキル・PCスキル・趣味 など` (merged) | Dark-green header |
| 16 | Two-column: **left** `【言語スキル】` + `・日本語: {japanese_ability}` + one line per `languages[]`; **right** `【PCスキル】` + `technical_skills[]` list | `soft_skills` appended under left as "その他" |

**Layout — page 2** (continues via page break, or a second table):

| Row | Contents |
|---|---|
| 17 | Section header `勤務可能曜日・時間 (出勤可能: ◯、出勤不可: ×)` |
| 18 | `月曜: X` `火曜: X` … `日曜: X` where X is `◯` if the day is in `working_days` JSON, else `×`. No time line (not stored). |
| 19 | Section header `所感 (カウンセリング等を踏まえての、当社評価など)` |
| 20 | Blank — `Note` records are admin-internal; Path 1 leaves this empty |
| 21 | Section header `通勤時間の目安` |
| 22 | Blank — not stored |

**Enum → Japanese maps** (replace the existing English `RESIDENCE_LABELS` / `CONTRACT_LABELS` at the top of `resume.service.ts`):

- `Gender`: Male → 男性, Female → 女性, Other → その他
- `ResidenceStatus`: Permanent_Resident → 永住者, Work_Visa → 就労ビザ, Student_Visa → 留学生, Spouse_Visa → 配偶者ビザ, Other → その他
- `Contract` (used by `availability`): Full_time → 正社員, Part_time → パートタイム, Internship → インターン, Flexible → 応相談
- `JapaneseAbility`: N1..N5 unchanged, None → なし
- Weekday name → 月 / 火 / 水 / 木 / 金 / 土 / 日

**docx-library specifics**

- Use `Table`, `TableRow`, `TableCell`, `WidthType`, `ShadingType`, `BorderStyle` from `docx` (already installed — see `resume.service.ts:1-8`).
- Section-header cells: `shading: { fill: "145652", type: ShadingType.CLEAR }`, text runs `color: "FFFFFF", bold: true`.
- Every `TextRun` sets `font: "MS Gothic"` for consistent Japanese rendering on Word/Windows.
- Page margins stay at 720 twips (0.5 inch) — matches existing config at `resume.service.ts:139-141`.
- Cell widths in twips (page ~ 12240 twips at A4, 0.5" margins → usable ~ 10800). Rough allocation: labels 1800, values 3600, right-half label 1800, right-half value 3600 for four-column rows; two-column rows split 1800 / 9000.
- Photo cell (~2400 wide × three rows tall): empty cell, no `ImageRun` — visual footprint preserved for later.

**Files touched by Part B**

- `backend/src/services/resume.service.ts` — full rewrite of `generateResumeDocx()`; `fetchApplicationForResume()` unchanged.
- Nothing else. Controller (`applicationController.ts`), route (`application.route.ts`), and the frontend download link keep working — endpoint URL, filename, and content-type are unchanged.

## Verification

**Part A**
1. `frontend/translations.en-ja.txt` exists, grouped by file with numbered entries.
2. Spot-check three files (Navbar, FAQ, ApplicationForm) — every visible English string in the source appears in the catalog.
3. Send file to client.

**Part B**
1. `cd backend && npm run build` compiles clean.
2. `npm run dev` in backend and frontend.
3. Log in as admin → open a job with an applicant → open the application detail modal → click resume `.docx` download.
4. Open the file in Word (or LibreOffice). Compare side-by-side with `frontend/public/CV - Google Sheets.pdf`:
   - Title bar green, correct text, date auto-fills to today.
   - Personal info block: 8 rows, correct Japanese labels, DOB shows `満 N 歳`, empty cells (visa expiry, 通勤時間, postal code) render blank but bordered.
   - Section headers render with dark-green background + white text.
   - Weekday row shows ◯ for days in `working_days`, × for others.
   - Language block on page 2 lists JLPT + languages left, technical skills right.
   - No layout collapse when text is long (e.g., a 40-char address).

## Explicit non-goals

- No i18n library, no `next-intl`, no `/en` `/ja` routing, no language switcher.
- No admin-facing translations. Admin dashboard stays English.
- No changes to `schema.prisma`, no new applicant form fields, no changes to the public application wizard.
- No PDF export — stays `.docx`.
- Missing template fields remain blank cells; revisited only if the client requests Path 2 later.
- No translation of DB content (job titles, news bodies, applicant free-text) — data problem, not code.
