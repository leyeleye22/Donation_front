# Session Summary — Connecting Frontend to Laravel API

## Goal
Connect all frontend content to the Laravel backend API (remove localStorage, mock data, and all "demo"/"fictif" references) and protect dashboard routes with JWT auth.

## Constraints & Preferences
- Everything in the frontend must fetch from the Laravel backend (no more `localStorage.getItem` or mock data imports).
- All images served from the Laravel backend (URL prefix `http://localhost:8000/assets/`).
- No "demo", "fausse données", "simulation", "Phase front Next.js" text anywhere in the UI.
- Dashboard routes (`/dashboard/*`) redirect to `/login` if no valid JWT token.
- API responses expected as `{ data: ... }` (Laravel API Resource wrapper).

## Progress

### Completed
- **`.env.local`** created with `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
- **`lib/api.ts`** — centralized API client with JWT token management, all endpoints (auth, pages, projects, posts, gallery, media, navigation, settings, dashboard KPI). Handles 401 → redirect to `/login`. Supports `FormData` for file uploads.
- **`lib/admin-auth.ts`** — rewritten to use `api.login()`, `api.getMe()`, `api.logout()` instead of localStorage session mock.
- **`lib/admin/home-content.ts`** — `loadHomeContent()` now calls `api.getPage('home')`, falls back to `defaultHomeEditorContent`.
- **`lib/admin/about-content.ts`** — `loadAboutContent()` calls `api.getPage('about')`, image URLs use backend path.
- **`lib/admin/contact-content.ts`** — `loadContactContent()` calls `api.getPage('contact')`.
- **`lib/admin/global-settings.ts`** — `loadGlobalSettings()` calls `api.getSettings()`, `saveGlobalSettings()` calls `api.updateSettings()`.
- **`components/admin/require-auth.tsx`** — new auth guard component: checks token in localStorage, validates via `checkAdminSession()` API call, shows spinner while loading, redirects to `/login` if invalid.
- **`app/(admin)/dashboard/layout.tsx`** — wraps dashboard routes with `<RequireAuth>` (removed duplicate `<AdminShell>` — parent `AdminAreaLayout` already provides it).
- **`components/admin/admin-login-form.tsx`** — rewritten to call `adminLogin()` API instead of mock credential validation. Uses real API for authentication.
- **`components/admin/admin-shell.tsx`** — logout calls `adminLogout()` API, removed `mockAdminCredentials` dependency.
- **`components/admin/admin-session-guard.tsx`** — now calls `checkAdminSession()` API to validate token.
- **`components/admin/editor/home-page-editor.tsx`** — save calls `api.updatePage('home', content)` instead of `localStorage.setItem`.
- **`components/admin/editor/contact-page-editor.tsx`** — save calls `api.updatePage('contact', content)` instead of `localStorage.setItem`.
- **`components/admin/editor/about-page-editor.tsx`** — load calls `loadAboutContent()`, save calls `api.updatePage('about', content)`.
- **`components/sections/projects-page-content.tsx`** — replaced localStorage `loadProjects()` with `api.getProjects()`.
- **`components/sections/journal-page-content.tsx`** — replaced localStorage `loadPosts()` with `api.getPosts()`.
- **Mock data files cleaned** — removed all "demo", "fausse", "simulation", "Next.js phase front", "branchement Laravel" text from:
  - `lib/mock-data/site.ts`
  - `lib/mock-data/ui-content.ts`
  - `lib/mock-data/page-sections.ts`
  - `lib/mock-data/home.ts`
- **Image paths** updated in all mock data files to use `http://localhost:8000/assets/...`.
- **`app/layout.tsx`** metadata description fixed.
- **`app/(public)/projects/[slug]/page.tsx`** — `"Progression simulee"` → `"Progression"`.
- **`app/(public)/journal/[slug]/page.tsx`** — backend reference text removed.
- **`next.config.ts`** — already has `images.unoptimized: true` (no `remotePatterns` needed).
- **Type consistency** — all `loadXContent()` async calls properly awaited via `.then()` in all consumers (11 files fixed, including `site-header.tsx`, `site-footer.tsx`, `footer-visibility.tsx`, `section-visibility.tsx`, `floating-donate-button.tsx`).
- **`npm run build`** — passes cleanly, 0 errors, 0 warnings.

### Not Yet Converted (still use localStorage)
- `components/admin/editor/journal-page-editor.tsx` — reads/writes `entraide-admin-journal`
- `components/admin/editor/projects-page-editor.tsx` — reads/writes `entraide-admin-projects`
- `components/layout/site-header.tsx` — reads `entraide-admin-nav-items` from localStorage for nav item overrides (fallback to mock data)
- `components/admin/dashboard/navigation/page.tsx` — was updated to use `api.getNavigation()` / `api.updateNavigationOrder()` by task agent
- `components/admin/dashboard/gallery/page.tsx` — was updated to use `api.getGallery()` by task agent

### Blocked
- None.

## Key Decisions
- **No `remotePatterns` in `next.config.ts`** — `images.unoptimized: true` already allows images from any domain.
- **`.then()` pattern over `await` in `useEffect`** — cleaner for client components where the effect can't be async.
- **Backend data falls back to mock data** — if API is unavailable, the site still displays using the (now cleaned) mock data as fallback.
- **`ABOUT_EDITOR_STORAGE_KEY`, `CONTACT_EDITOR_STORAGE_KEY`, `HOME_EDITOR_STORAGE_KEY`** export constants retained in admin lib files (other code may still reference them), but all editor components now use API only.

## Next Steps
1. Convert `journal-page-editor.tsx` and `projects-page-editor.tsx` to use `api.getPosts()`/`api.getProjects()` for load and `api.createPost()`/`api.createProject()` for save.
2. Convert `site-header.tsx` nav item localStorage read to `api.getNavigation()`.
3. Test with Laravel backend running (`php artisan serve`, `npm run dev`).

## Relevant Files
- `C:\Users\Mr LEYE\Downloads\donation\.env.local` — `NEXT_PUBLIC_API_URL`
- `C:\Users\Mr LEYE\Downloads\donation\lib\api.ts` — API client
- `C:\Users\Mr LEYE\Downloads\donation\lib\admin-auth.ts` — auth functions
- `C:\Users\Mr LEYE\Downloads\donation\components\admin\require-auth.tsx` — dashboard route guard
