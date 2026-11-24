# LifeOS Frontend

Minimal React app for daily life management. Frontend is a separate repo from the Laravel/Sanctum backend; a mobile app is planned later.

## Stack

- Vite + React + TypeScript (strict)
- React Router in data mode (`createBrowserRouter`, `lazy`)
- React Query v5
- Tailwind CSS + shadcn/ui
- Axios

## Layout

```text
src/
├── app/
│   ├── routes/
│   │   ├── app/
│   │   ├── auth/
│   │   └── not-found.tsx
│   ├── index.tsx
│   ├── provider.tsx
│   └── router.tsx
├── components/
│   ├── common/
│   ├── errors/
│   ├── layouts/
│   └── ui/
├── config/
├── features/
│   └── auth/
├── hooks/
├── lib/
├── styles/
├── types/
├── utils/
└── main.tsx
```

## Rules

- Files and folders are kebab-case. The only allowed dot is `.test`.
- Components/types use PascalCase; functions/variables use camelCase; constants use UPPER_SNAKE_CASE.
- Route components end with `Route`; the filename matches the main export.
- Named exports only; config files are excepted.
- Use `@/` for anything outside the current folder.
- Allowed feature folders: `api/`, `components/`, `context/`, `hooks/`, `schemas/`, `types/`, `utils/`.
- No pages or routes inside features.
- Features cannot import other features or `app/`.
- Dependency direction is one-way: `shared → features → app`.
- Import boundaries are a convention, not currently ESLint-enforced.
- Pages live in `src/app/routes/` and are registered in `router.tsx` with `lazy`.
- Pages stay thin: params, layout, feature composition.
- Layout routes use `<Outlet />`; `*` renders not-found.
- `components/ui/` is for shadcn only; `components/common/` holds generic reusable pieces.
- Prioritize using Shadcn components over building your own if available. If you must build your own, put it in `components/common/` for global components.
- Feature-specific components stay inside their feature.
- One file per API action in `api/`, with fetcher and hook together, e.g. `get-products.ts`.
- Query keys come from a factory, e.g. `product-keys.ts`.
- Components never call `apiClient` directly.

## Auth

- Laravel Sanctum bearer tokens.
- Token is stored in `localStorage` because mobile is planned.
- On `401`, clear the token and redirect to `/login`.
- `VITE_API_URL` is exposed as `env.API_URL`.

## Commands

```bash
npm install           # install dependencies
npm run dev           # start Vite
npm run lint          # ESLint
npm run format        # write Prettier formatting
npm run format:check  # check formatting only
npm run build         # tsc -b + vite build
```

## CI and Git

- GitHub Actions job `verify` runs `lint`, `format:check`, and `build` on PRs into `main` and pushes to `main`.
- Branch protection requires `verify` before merge.
- Don't forget to run `npm run format` before committing.
- Use Conventional Commits: `type(scope): description`.

## Dependencies

- `.env` is ignored; `.env.example` is tracked.
- Moderate audit findings come from `shadcn → ts-morph → @ts-morph/common → minimatch`.
- They are tooling-only, not shipped to the browser.
- Do **not** run `npm audit fix --force`: it downgrades shadcn to `1.0.0` and breaks the CLI. Wait for a shadcn CLI update instead.

## Skills

Project skills live in `.agents/skills/`. Follow their `SKILL.md` files when relevant, and keep them updated with `npx skills update`.
