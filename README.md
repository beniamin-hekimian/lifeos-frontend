# 🍀 LifeOS - Frontend

LifeOS frontend repository, plus the coding rules our team follows.

## 🛠️ Tech Stack

- ⚛️ Vite + React + TypeScript (strict mode)
- ⚡ React Router v7 (data mode)
- 🔄 React Query (TanStack Query)
- 🎨 Tailwind CSS + shadcn UI
- 🌐 Axios with `apiClient` wrapper

## 📁 Folder Structure

Feature-based architecture, following [Bulletproof React](https://github.com/alan2207/bulletproof-react).

```
src/
├── app/
│   ├── routes/                      # all pages (one file per URL)
│   │   ├── app/                     # protected routes (login required)
│   │   ├── auth/                    # authentication pages (login, register)
│   │   │   └── login.tsx            # /login
│   │   └── not-found.tsx            # * (404)
│   ├── index.tsx                    # App component
│   ├── provider.tsx                 # QueryClient, Auth, Theme providers
│   └── router.tsx                   # all routes registered here (lazy)
│
├── components/
│   ├── common/                      # shared components
│   │   ├── confirm-dialog.tsx
│   │   ├── data-table.tsx
│   │   └── page-header.tsx
│   ├── errors/
│   ├── layouts/
│   └── ui/                          # shadcn only (CLI-generated)
│
├── config/                          # global config files
│
├── features/                        # features never import each other
│   └── auth/
│       ├── api/
│       │   ├── get-current-user.ts
│       │   ├── login.ts
│       │   └── logout.ts
│       ├── components/
│       │   ├── login-form.tsx
│       │   └── protected-route.tsx
│       ├── context/
│       │   └── auth-context.tsx
│       ├── hooks/
│       │   └── use-auth.ts
│       └── types/
│           └── auth.ts
├── hooks/                           # shared hooks
│   └── use-mobile.ts                # added by shadcn
├── lib/
│   ├── api-client.ts                # Axios apiClient instance
│   ├── query-client.ts              # React Query defaults
│   └── utils.ts                     # shadcn cn() helper
├── styles/
│   └── globals.css                  # Tailwind + shadcn variables
├── types/
│   └── api.ts                       # global types
├── utils/
│   └── format-date.ts               # shared helpers
└── main.tsx                         # vite entry point
```

Only create subfolders when needed.

## 📋 Contribution Rules

### 1. Naming

- **Files and folders: kebab-case.**

  ```
  ✅ product-card.tsx    use-toggle.ts    api-client.ts
  ❌ ProductCard.tsx     useToggle.ts     apiClient.ts
  ```

- **Only allowed dot in a filename is `.test`** (plus tool-mandated names like `vite.config.ts`).

  ```
  ✅ product-card.test.tsx
  ❌ products.api.ts    product.types.ts
  ```

- **Components and types: PascalCase.**

  ```tsx
  export function ProductCard() { ... }
  export type Product = { id: string };
  export interface ProductCardProps { product: Product }
  ```

- **Functions and variables: camelCase.** Hooks start with `use`.

  ```ts
  const totalPrice = 100;
  export function formatPrice(value: number) { ... }
  export function useToggle() { ... }
  ```

- **Constants: UPPER_SNAKE_CASE.**

  ```ts
  export const API_TIMEOUT = 5000;
  export const DEFAULT_PAGE_SIZE = 20;
  ```

- **Route components end with `Route`.**

  ```tsx
  // app/routes/app/products/products.tsx
  export function ProductsRoute() { ... }
  ```

- **The file name matches its main export, in kebab-case.**
  ```
  product-card.tsx   → export function ProductCard()
  get-products.ts    → export function getProducts()
  product-keys.ts    → export const productKeys
  ```

### 2. Exports and imports

- **Named exports only.**

  ```tsx
  ✅ export function ProductCard() { ... }
     import { ProductCard } from '@/features/products/components/product-card';

  ❌ export default function ProductCard() { ... }
     import Card from '@/features/products/components/product-card';
  ```

- **Exception: config files** (`vite.config.ts`, `eslint.config.js`) use default exports because the tools require it.

  ```ts
  // vite.config.ts
  export default defineConfig({ ... });
  ```

- **Use the `@/` alias** for anything outside the current folder.
  ```ts
  ✅ import { Button } from '@/components/ui/button';
  ❌ import { Button } from '../../../components/ui/button';
  ```

### 3. Features

- **Allowed folders:** `api/`, `components/`, `hooks/`, `schemas/`, `types/`, `utils/`, `context/`. Create them only when needed or used.

  ```
  features/products/
  ├── api/
  ├── components/
  └── types/
  ```

- **No pages or routes inside features.** Pages live in `app/routes/`.

  ```
  ❌ features/products/pages/product-list-page.tsx
  ✅ app/routes/app/products/products.tsx
  ```

- **Features cannot import other features or `app/`.** Compose them in a page instead.

  ```tsx
  ❌ // features/orders/components/order-card.tsx
     import { ProductCard } from '@/features/products/components/product-card';

  ✅ // app/routes/app/profile.tsx
     import { UserCard } from '@/features/users/components/user-card';
     import { UserProductsList } from '@/features/products/components/user-products-list';
  ```

- **One-way imports:** `shared → features → app`.
  ```
  components, hooks, lib, utils, config  →  features  →  app
  ```

### 4. Routing

- **Pages live in `src/app/routes/`, one file per URL.**

  ```
  app/routes/app/products/products.tsx   → /products
  ```

- **Register every page in `src/app/router.tsx` using `lazy`.**

  ```tsx
  {
    path: 'products',
    lazy: async () => {
      const { ProductsRoute } = await import('./routes/app/products/products');
      return { Component: ProductsRoute };
    },
  }
  ```

- **Pages are thin:** read params, pick a layout, compose feature components. No business logic or data fetching.

  ```tsx
  export function ProductRoute() {
    const { id } = useParams();
    return <ProductDetail productId={id as string} />;
  }
  ```

- **Layout routes use `<Outlet />`.** The catch-all `*` route renders the not-found page.
  ```tsx
  <MainLayout>
    <Outlet />
  </MainLayout>
  ```

### 5. Data fetching

- One file per action in `api/`: `get-products.ts`, `create-product.ts`, etc...
  The fetcher and its hook live together in the same file.
  ```
  features/products/api/
  ├── create-product.ts    # createProduct + useCreateProduct
  ├── get-product.ts       # getProduct + useProduct
  ├── get-products.ts      # getProducts + useProducts
  └── product-keys.ts      # query key factory
  ```
- Query keys come from a key factory (`product-keys.ts`). Never type keys inline.
  ```ts
  ✅ queryKey: productKeys.detail(id)
  ❌ queryKey: ['products', id]
  ```
- Components never call `apiClient` directly. Use the hooks.

### 6. Shared code

- `components/ui/`: shadcn files only. Do not add custom components here.
- Generic reusable components go in `components/common/`.
- Feature-specific components stay in the feature.
  ```
  components/common/confirm-dialog.tsx            # used by many features
  features/products/components/product-card.tsx   # used only by products
  ```

## ✨ Code Quality

- **TypeScript strict.** No `any` without a comment explaining why.

  ```ts
  ✅ // eslint-disable-next-line @typescript-eslint/no-explicit-any -- lib has no types
  ❌ const data: any = await getProducts();
  ```

- **Prettier is mandatory, with the shared config only.** Install the recommended [VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) when prompted. Do not change Prettier settings locally for this project. Run `npm run format` before every commit.

  ```
  .prettierrc                  # shared Prettier rules (source of truth)
  .vscode/extensions.json      # recommends the Prettier extension
  .vscode/settings.json        # format on save, Prettier as default formatter
  ```

- **Commit messages follow [Conventional Commits](https://www.conventionalcommits.org):** `type(scope): description`, lowercase, present tense.

  ```
  ✅ feat(products): add product filters
  ✅ fix(auth): redirect to login on 401
  ❌ fixed stuff
  ```

  Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`. Scope is the feature or area you changed.
