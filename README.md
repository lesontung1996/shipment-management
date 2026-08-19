# Shipment Management

Take-home assignment for Jitsu. Shipments arrive at a warehouse, get assigned to a delivery route, and move through **OPEN → IN_TRANSIT → DELIVERED**. Invalid transitions (for example OPEN → DELIVERED) are not allowed.

Here is a quick video of me walking through the application: https://www.loom.com/share/6aff0c9141854e728442d23073f641c2

## Prerequisites

- **Node.js** 20.9 or later
- **pnpm** 10 (this repo is pinned to `pnpm@10.27.0` via `packageManager`)
- **json-server** — used by `pnpm api` to serve mock data from `shipments.json`. Install it globally (`npm install -g json-server`) or as a project dependency (`pnpm add -D json-server`)

If you use [Corepack](https://nodejs.org/api/corepack.html), enable it and pnpm will match the version in `package.json`:

```bash
corepack enable
```

## Install dependencies

From the repository root:

```bash
pnpm install
```

## Run the application

The Next.js app proxies `/api/*` to `http://localhost:3001`, so the mock API and the frontend must both be running.

1. Start the mock API (port **3001**):

```bash
pnpm api
```

2. In a second terminal, start the Next.js app (port **3000** by default):

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Brief description

This app implements the **Core** and **Stretch** tiers of the take-home:
- a two-panel shipment list/detail page
- search and scale for large lists
- editable details
- status transitions with assignment rules
- a location map
- create/delete shipments
- *The Extra Credit assignment-management page is out of scope.*

### Overview

- **Left panel**
  - Shipments grouped by status
  - Each row shows client, label, and arrival date
  - Search filters by label or client name
  - Status groups paginate from the API
  - Shipment list uses a virtual list for better DOM performance with a large number of shipments
- **Right panel**
  - Selected shipment details
  - `delivery_by_date`, coordinates, and status are editable; save persists via the API
  - Moving to IN_TRANSIT requires an assignment; reverting to OPEN clears it
  - The dropdown only offers valid next statuses
  - A Leaflet map shows the delivery pin
  - New shipments can be created with defaults; existing ones can be deleted

Status rules live in `lib/shipment-status.ts` so the form and dropdown share one source of truth. Mock data is served by json-server; Next.js rewrites `/api` to that process.

## Tradeoffs

### Server data: TanStack Query vs custom fetch hooks

I used **TanStack Query** so lists, detail, and mutations share the same loading, error, and cache behavior. A custom hook around `fetch` would have been enough for a few endpoints, but I would have reimplemented pagination, cache invalidation after save/create/delete, and placeholder data for the selected row.

| | TanStack Query | Custom fetch hook |
| --- | --- | --- |
| Loading / error | Built-in `isPending`, `isError`, retry | Hand-roll `useState` / `useEffect` per hook |
| Caching | Shared cache keyed by query (`status`, search, id) | Easy to duplicate fetches or pass data through props |
| Pagination | `useInfiniteQuery` for per-status pages | Extra page state and merge logic |
| Mutations | Invalidate or patch cache after save / create / delete | Manual list updates; easy to miss a panel |
| Cost | Extra dependency and QueryClient setup | No library, but more code as the API surface grows |

Query was the better fit because the list has three independent paginated groups plus a detail view that must stay in sync after edits.

### Client UI state: Zustand vs Context + provider

The only global UI state today is **`selectedShipmentId`**. A Context provider and custom hook would have worked. I still chose **Zustand** for less wiring and a clearer path if Extra Credit (assignment management) lands later.

| | Zustand | Context API + provider |
| --- | --- | --- |
| Boilerplate | Store file, `useShipmentStore((s) => …)` | Provider, context object, custom hook, wrap the tree |
| Re-renders | Selectors subscribe to one field | Default context re-renders all consumers unless split or memoized |
| Usage | Import the store anywhere (list row, detail, dialogs) | Must sit under the provider; easy to miss in tests or dialogs |
| Growth | Add fields or slices (e.g. selected assignment) without new providers | More providers or a fatter context as screens grow |
| Fit here | Slightly heavier than needed for one id | Simpler mental model for a single value |

For this take-home, Context would have been a valid, smaller choice. Zustand is the tradeoff toward less boilerplate and future assignment UI, not because the current state graph is large.
