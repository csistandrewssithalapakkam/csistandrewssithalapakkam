# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CSI St. Andrew's Church (Sithalapakkam, Chennai) portal — a church website combined with an interactive quiz platform and admin dashboard.

## Commands

```bash
ng serve                              # Dev server (frontend, port 3000, development config)
ng serve --configuration=uat          # Serve pointing at UAT API
ng build                              # Production build (default configuration)
ng build --configuration=development  # Dev build with source maps, no optimization
node server.ts                        # Express backend (WebSocket + API stubs)
```

No test or lint scripts are configured.

## Architecture

**Frontend:** Angular 21 standalone components, zoneless change detection (`provideZonelessChangeDetection()`), `OnPush` everywhere, lazy-loaded routes, Angular Material + Tailwind CSS.

**Entry point:** `index.tsx` (not the conventional `main.ts`). Bootstrap wires up `provideZonelessChangeDetection()`, hash-based routing (`withHashLocation()`), `authInterceptor`, and an app initializer that silently logs in a read-only "web user" before the app renders.

**Routing:** Hash-based (`#/path`), so the server never needs to handle client routes.

**Backend:** `server.ts` — Express 5 + Socket.IO for real-time quiz events only. The primary data API is a separate Laravel/PHP backend at `csistandrewssithalapakkam_api`; quizzes stored there are persisted in a real database. The Express server only serves Socket.IO broadcast duties.

**API base URL** is configured per environment in `src/environments/`:
- `environment.ts` → `http://localhost/csistandrewssithalapakkam_api/public/api`
- `environment.prod.ts` → `https://www.csistandrewssithalapakkam.com/api/api`
- `environment.uat.ts` → placeholder UAT URL

### Route layout

| Path | Area |
|---|---|
| `/` | Landing page (`src/main/`) — all church sections composed inline |
| `/quiz` | Quiz list (`src/quiz/quiz-list.component.ts`) |
| `/quiz/:id` | Quiz taker (`src/quiz/quiz-taker.component.ts`) |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard shell + child managers (guarded by `authGuard`) |
| `/gallery`, `/history`, `/fellowship/:name`, `/forms`, `/vbs2026` | Public feature pages |

All routes use `loadComponent()` / `loadChildren()` for lazy loading.

### Admin dashboard children

`/admin/dashboard` is a shell with these child routes: `gallery`, `banners`, `missions`, `prayers`, `events`, `blessing-verses`, `fellowship/:name`, `quiz`, `users`, `pages`.

### Auth — three token types

All tokens stored in `localStorage`, managed by `src/shared/services/token.service.ts`:

| Token type | Keys prefix | Purpose |
|---|---|---|
| **Admin** | `admin_*` | Full admin CRUD access |
| **Quiz taker** | `quiz_taker_*` | Submit/save quiz answers |
| **Web user** | `web_user_*` | Read-only public access (auto-obtained at startup) |

`WebUserAuthService` (`src/shared/services/web-user-auth.service.ts`) runs as an app initializer and silently logs in with hardcoded credentials to get a web-user token for public API reads.

`src/shared/interceptors/auth.interceptor.ts` selects the right token per request, handles 401 → token refresh for all three types. For quiz takers, if the refresh fails it re-registers from `localStorage.quiz_user_info` (the name+mobile saved at quiz start). For admin, a failed refresh redirects to `/admin/login`.

`AuthService` (`src/admin/auth.service.ts`) manages admin login/logout/refresh.

### Admin RBAC

`src/admin/permission.service.ts` — loads per-page access rules for the logged-in admin user. Each page has `can_view`, `can_create`, `can_edit`, `can_delete` flags. Empty access list means no restrictions (super-admin). Use `PermissionService.hasAccess(slug)` / `canCreate(slug)` / etc. in manager components.

### Key files

- `src/shared/models/quiz.model.ts` — all core interfaces (`Quiz`, `QuizQuestion`, `QuizSection`, `QuizSubmission`, `QuizSubmissionResult`) and enums (`QuizType`, `QuestionType`)
- `src/shared/services/quiz.service.ts` — quiz CRUD, submissions, stats; uses Angular signals for reactive state; `mapQuiz()` normalises snake_case backend fields to camelCase
- `src/quiz/quiz-taker.component.ts` — flattens all sections into a single question array for navigation; manages registration flow (name + mobile only), save/submit lifecycle, and leaderboard
- `src/admin/auth.guard.ts` — protects `/admin/dashboard` and its children
- `src/shared/launch-popup/` — `LaunchPopupService` shows a campaign popup on navigation; suppressed on the `/vbs2026` route

### Real-time

Socket.IO events (`quiz:created`, `quiz:updated`, `quiz:deleted`) are emitted from `server.ts` and consumed in quiz components for live updates.

### Analytics

Google Analytics (`G-21D02Q4E3B`) is tracked in `AppComponent` via `gtag` on every `NavigationEnd` event.
