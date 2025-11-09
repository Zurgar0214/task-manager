## Quick context

This repo is a small NestJS MVC-style task manager with a lightweight React frontend (located under
`src/ui/UI-App-de-Tareas`). Key high-level areas:

- Backend: `src/` (controllers in `src/ui`, services in `src/app`, domain entities in `src/domain`, mongoose schemas in `src/schemas`).
- Frontend static demo: `src/ui/frontend` (simple index.html + assets).
- React app: `src/ui/UI-App-de-Tareas` — a separate mini-app that uses a mock-data toggle.

## What to know first (essential files)

- `src/main.ts` — Nest bootstrap. Swagger served at `http://localhost:3001/api/docs` and app listens on port `3001`.
- `src/app.module.ts` — shows ConfigModule and Mongoose connection (reads `MONGO_URI` via `@nestjs/config`).
- `src/schemas/task.schema.ts` — Mongoose schema used by `MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])`.
- `src/app/task.service.ts` — business methods (findAll, findOne, create, update, remove) using `@InjectModel('Task')`.
- `src/ui/task.controller.ts` — REST endpoints for `/tasks` (uses DTOs in `src/ui/dto`).
- `src/ui/ui.controller.ts` — simple static file endpoints: `GET /ui` and `GET /ui/assets/:file` (serves `src/ui/frontend`).
- Frontend API client: `src/ui/UI-App-de-Tareas/src/services/task.service.ts` — contains `USE_MOCK_DATA` boolean (set to `true` by default).

## How to run & debug locally

- Dev backend (hot reload): `npm run start` (uses `ts-node-dev` and runs `src/main.ts`).
- Build: `npm run build` -> `dist/` (then `npm run start:prod` to run production build).
- To run tests (not pre-wired as npm script): `npx jest` (project has `jest` devDependency).

Notes: The backend listens on 3001 by default. If you run the React app separately (different port), enable CORS in `src/main.ts` with `app.enableCors()` or serve the built frontend via `UiController` which expects files under `src/ui/frontend`.

## Project-specific conventions & patterns

- Architecture: explicit MVC separation — controllers live in `src/ui`, core business logic in `src/app`, domain model in `src/domain`, persistence schemas in `src/schemas`.
- Mongoose model name is the string `'Task'` (used across `TaskService` and module registration). If you rename the model, change both `MongooseModule.forFeature` and `@InjectModel` usages.
- DTOs live under `src/ui/dto` and Swagger decorators are used in controllers (see `TaskController`). Prefer `@ApiProperty` / `@ApiPropertyOptional` there for docs.
- Frontend: the React app ships with a mock backend toggle in `src/ui/UI-App-de-Tareas/src/services/task.service.ts` (look for `USE_MOCK_DATA`). Set it to `false` to call the backend endpoints at `/tasks`.

## Integration points to watch

- Environment: `MONGO_URI` is loaded by `@nestjs/config`. Provide this env var (or `.env`) before starting.
- Swagger docs: `/api/docs` (see `src/main.ts`). Useful for quick API testing.
- Static UI: `UiController` serves files from `src/ui/frontend`. If you update the React build or static assets, make sure they are accessible at those paths or update the controller.

## Minimal examples to copy when making changes

- Add a new entity: create class in `src/domain/entities`, add schema in `src/schemas`, register it in `app.module.ts` via `MongooseModule.forFeature`, then inject with `@InjectModel('YourName')` in services.
- Add an endpoint: create DTO under `src/ui/dto`, add handler in `src/ui/<controller>.ts`, call service methods in `src/app`.

## Small dev tips for contributors/agents

- Prefer local mock flow when iterating on UI: flip `USE_MOCK_DATA` in `src/ui/UI-App-de-Tareas/src/services/task.service.ts`.
- When integrating frontend + backend, run backend on `3001` or change `src/main.ts` listen port and ensure UI fetch base (`/tasks`) matches the backend origin.
- If frontend is served separately, enable CORS in `src/main.ts`.

---

If you'd like I can: add a `test` npm script, wire a build step that outputs the React build into `src/ui/frontend` for the `UiController`, or expand this doc with examples of common edits (e.g., adding a new model + controller).
