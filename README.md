# Order Management Dashboard

A small full-stack app for viewing, searching, filtering and updating customer orders. 

- Frontend: React 19, TypeScript, Vite, React Router. Plain CSS, no component library.
- Backend: Node.js, Express 5, TypeScript. Orders live in memory, seeded from a JSON file. No database.
- Tests: Vitest on both sides, Supertest for the HTTP layer, React Testing Library for the component test.

## Project structure

```
├── .nvmrc                             # Node.js version
├── package.json                       # npm workspaces and root scripts
├── backend/
│   ├── src/
│   │   ├── index.ts                   # starts the HTTP server
│   │   ├── app.ts                     # Express app: middleware, routes, error handler
│   │   ├── routes/orders.ts           # HTTP layer: parse request, validate payload, call service
│   │   ├── services/orderService.ts   # business rules: status transitions, lookups
│   │   ├── repositories/orderRepository.ts  # data access over the in-memory list, reset() for tests
│   │   ├── middleware/errorHandler.ts # maps thrown errors to a JSON error body
│   │   ├── errors.ts                  # HttpError plus notFound / badRequest helpers
│   │   ├── types.ts                   # Order, OrderItem, OrderStatus
│   │   └── data/orders.json           # 15 fictional seed orders
│   └── tests/                         # service rule tests and HTTP endpoint tests (Supertest)
└── frontend/
    ├── .env.example                   # VITE_API_URL template
    └── src/
        ├── main.tsx, App.tsx          # entry point and routes
        ├── index.css                  # all styles, including the mobile layout
        ├── pages/DashboardPage.tsx    # list, summary cards, search, filter, sort
        ├── pages/OrderDetailsPage.tsx # items, totals, status update
        ├── pages/NotFoundPage.tsx     # unknown routes and unknown order IDs
        ├── components/
        │   ├── SummaryCards.tsx       # count per status, each card is also a filter
        │   ├── OrderFilters.tsx       # search box, status filter and sort select
        │   ├── OrdersTable.tsx        # order list with View links, stacks into cards on mobile
        │   ├── StatusBadge.tsx        # status pill
        │   ├── StatusActions.tsx      # buttons for the allowed transitions (component test alongside)
        │   └── Feedback.tsx           # loading, error and empty states
        ├── hooks/useFetch.ts          # loading / error / data for any async loader
        ├── api/orders.ts              # the only place that calls fetch
        ├── lib/orders.ts              # pure filter / sort / summary functions (unit tests alongside)
        ├── lib/format.ts              # money and date formatting
        └── types.ts                   # Order types as returned by the API
```

## Getting started

Prerequisites: Node.js 26 or newer (see `.nvmrc`; run `nvm use` if you use nvm) and npm. Vite 7 and React Router 7 need Node 20.19 or 22.12 at minimum.

Install everything from the repository root. The root `package.json` uses npm workspaces, so one install covers both apps.

```bash
npm install
```

Start the backend API (port 3001):

```bash
npm run dev:backend
```

In a second terminal, start the frontend (port 5173) and open http://localhost:5173:

```bash
npm run dev:frontend
```

The frontend reads the API base URL from `VITE_API_URL` and defaults to `http://localhost:3001`. Copy `frontend/.env.example` to `frontend/.env` to change it. The backend port can be changed with the `PORT` environment variable.

Run all automated tests, or type-check both apps, from the repository root:

```bash
npm test
npm run typecheck
```

Each app can also be run on its own from inside its folder with `npm run dev` and `npm test`. The frontend also has `npm run build` for a production bundle.

## API

Base URL: `http://localhost:3001`. All responses are JSON.

| Method | Endpoint | Description | Success | Errors |
|---|---|---|---|---|
| GET | /orders | All orders | 200 | 500 |
| GET | /orders/:id | One order with its items | 200 | 404, 500 |
| PATCH | /orders/:id | Change an order's status | 200 | 400, 404, 500 |

PATCH body:

```json
{ "status": "Processing" }
```

Every order in a response has this shape. `allowedTransitions` is computed by the backend from the status rules, so the UI only ever offers moves the API will accept.

```json
{
  "id": "ORD-1001",
  "customerName": "ABC Veterinary Clinic",
  "orderDate": "2026-10-15",
  "status": "Pending",
  "total": 125.5,
  "items": [
    {
      "productId": "P101",
      "productName": "Omega Supplement",
      "quantity": 2,
      "unitPrice": 42.5
    },
    {
      "productId": "P102",
      "productName": "Vitamin Supplement",
      "quantity": 1,
      "unitPrice": 40.5
    }
  ],
  "allowedTransitions": [
    "Processing",
    "Cancelled"
  ]
}
```

Errors always use one shape:

```json
{ "error": { "status": 400, "message": "Cannot change order ORD-1001 from Pending to Completed" } }
```

Status rules, enforced in `orderService.ts`:

| Current status | Allowed next status |
|---|---|
| Pending | Processing, Cancelled |
| Processing | Completed, Cancelled |
| Completed | none |
| Cancelled | none |

A PATCH with a missing or unknown status returns 400. A PATCH that breaks the rules above returns 400. An unknown order id returns 404. Anything unexpected returns 500 with a generic message and is logged on the server.

## Architecture and technical decisions

Backend layers. The backend has three layers. The route reads the request and checks that the body makes sense. The service holds the business rules and throws an `HttpError` with the right status code when a rule is broken. The repository is the only file that reads or changes the order data, so if the in-memory list were replaced by a database, only that file would change. One error-handling middleware turns any thrown error into the JSON error shape, so the routes never build error responses themselves.

Transitions come from the API. The rules for which status can follow which live in one place, the backend. Every order the API returns includes `allowedTransitions`, the list of statuses it can move to next. The details page shows one button per entry in that list, and a "can no longer be changed" notice when the list is empty. Adding a new status would be a backend-only change.

Search, filter and sort happen in the browser. The brief allows this and the dataset is small. The dashboard loads the full list once, then works out the visible rows from the search text, status filter and sort option. That logic is a set of plain functions in `lib/orders.ts` with unit tests, and `useMemo` makes sure it only reruns when one of those inputs changes. The summary cards count the same list, so after a status change the cards and the table update together without another request. With a large dataset this work would move to the server as query parameters on `GET /orders`.

No optimistic updates. A status change sends a PATCH request, and the screen only changes after the server answers 200. The buttons are disabled while the request is running so it cannot be sent twice. If the request fails, the old status stays and the server's message is shown. A 400 answer also reloads the order, because it usually means the order was changed somewhere else.

State management. Each page keeps its own state, and one small `useFetch` hook does the loading. The hook tracks loading, error and data, ignores a response that arrives after the user has moved to another page, and offers `retry` and `setData`. The dashboard fetches again when you come back to it, so the list and the cards always show the latest backend state. A global store or TanStack Query would be the next step if more pages needed to share data.

Consistent feedback. Every page has clear loading, error (with a retry button), empty and not-found states. Status is shown as a coloured badge with its text, so colour is never the only signal.

Responsive layout. Below 700px the order table becomes a stack of cards, done with CSS only. Each cell gets its label from a `data-label` attribute. The items table on the details page scrolls sideways on narrow screens. Buttons and cards show a visible focus ring for keyboard users.

Dates and money. `orderDate` is a date-only string such as 2026-10-15. It is formatted in UTC on purpose: parsing a date-only string gives midnight UTC, and formatting that in a North American time zone would show the previous day. Totals are formatted as CAD.

## Features completed

Priority 1

- Order listing with ID, customer, date, status badge, total and a View action
- Loading, error with retry, and empty states
- Search by order ID or customer name, combined with a status filter, with no page reload
- Order details with items, quantity, unit price, line total and order total
- Not-found handling for unknown order IDs, with a way back to the list
- Status update via buttons that only offer legal transitions; Completed and Cancelled orders are locked
- UI updates only after a successful API response; failures show the server's message
- REST API with GET /orders, GET /orders/:id, PATCH /orders/:id, JSON responses, correct status codes, transition validation and exception handling

Priority 2

- Summary cards for total, pending, processing, completed and cancelled orders; each card also acts as a filter
- Sorting by order date or total, ascending or descending, applied on top of search and filter
- Responsive layout for desktop and mobile, keyboard-accessible controls with visible focus
- Automated tests: 14 backend (service rules, seed integrity, HTTP endpoints) and 8 frontend (filter, sort, summary, status action buttons)
- Backend split into routes, service and repository, with structured error responses and payload validation

## Assumptions and limitations

- No authentication. A single internal staff user may view and update any order.
- Data is in memory. Restarting the backend resets every order to the seed file.
- Orders cannot be created, edited or deleted. Status is the only field that changes.
- Order totals in the seed data equal the sum of their line totals, and a test enforces that. The UI displays the stored total.
- Currency is assumed to be CAD. Dates are date-only ISO strings.
- The `Order` type is declared in both apps rather than in a shared package, to keep the two apps independently runnable. A shared types package would be the next step.
- Search, filter and sort run on the client. Pagination and server-side querying would be needed for large datasets.
- Cancelling asks for confirmation with the browser's native dialog.

## Use of AI tools

I used GitHub Copilot and Claude Code as assistants during this exercise. I treated their output like a pull request from a teammate: I read every suggestion, changed what did not fit, and kept only code I understood and could explain. The design decisions and tradeoffs described in this README are my own, and I ran the app and the tests myself to confirm everything works.

I used them for:

- Boilerplate code, and suggested implementations for some functions, which I adapted to fit the rest of the codebase
- Seed data for the backend
- Test case ideas, and a review of my tests to find missing edge cases
- A review of the code against common best practices, with refactoring suggestions
- First drafts of parts of this documentation, which I edited for accuracy