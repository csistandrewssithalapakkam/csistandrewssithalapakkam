# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CSI St. Andrew's Church (Sithalapakkam, Chennai) portal — a church website combined with an interactive quiz platform and admin dashboard.

## Commands

```bash
ng serve          # Dev server (frontend, port 3000)
node server.ts    # Express backend (WebSocket + API stubs)
ng build          # Production build
```

No test or lint scripts are configured.

## Architecture

**Frontend:** Angular 21 standalone components, zoneless change detection (OnPush everywhere), lazy-loaded routes, Angular Material + Tailwind CSS.

**Backend:** `server.ts` — Express 5 + Socket.IO for real-time quiz events. Quizzes are stored **in-memory only** (no database on the Express side).

**API base URL** is configured per environment in `src/environments/`. Dev points to `http://localhost/csistandrewssithalapakkam_api/public/api`.

### Route layout

| Path | Area |
|---|---|
| `/` | Landing page (`src/main/`) with all church sections |
| `/quiz` | Quiz list + quiz taker (`src/quiz/`) |
| `/admin` | Admin login + dashboard (`src/admin/`) |
| `/gallery`, `/history`, `/fellowship/:name`, `/forms` | Public feature pages |

All routes use `loadComponent()` / `loadChildren()` for lazy loading.

### Auth

Two separate token systems, both stored in `localStorage`:
- **Admin** — `admin_*` keys; managed by `src/admin/auth.service.ts`
- **Quiz takers** — `quiz_taker_*` keys; managed by `src/shared/services/token.service.ts`

`src/shared/interceptors/auth.interceptor.ts` attaches the correct token per request, handles 401 → token refresh, and injects `createdBy`/`updatedBy` audit fields on mutating requests.

### Key files

- `src/shared/models/quiz.model.ts` — all core interfaces (`Quiz`, `QuizQuestion`, `QuizSection`, `QuizSubmission`, `QuizSubmissionResult`, question type enums)
- `src/shared/services/quiz.service.ts` — quiz CRUD, submissions, stats; uses Angular signals for reactive state
- `src/quiz/quiz-taker.component.ts` — flattens all sections into a single question array for navigation
- `src/admin/auth.guard.ts` — protects `/admin/dashboard` and its children

### Real-time

Socket.IO events (`quiz:created`, `quiz:updated`, `quiz:deleted`) are emitted from `server.ts` and consumed in the quiz components for live updates.
