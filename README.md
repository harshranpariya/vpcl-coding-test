# Order Management Dashboard

A small full-stack app for viewing, searching, filtering and updating customer orders. 

- Frontend: React 19, TypeScript, Vite, React Router. Plain CSS, no component library.
- Backend: Node.js, Express 5, TypeScript. Orders live in memory, seeded from a JSON file. No database.

## Project structure

```
├── .nvmrc                             # Node.js version
├── package.json                       # npm workspaces and root scripts
├── backend/
│   └── src/
│       ├── index.ts                   # starts the HTTP server
│       ├── app.ts                     # Express app: middleware, routes, error handler
│       ├── routes/orders.ts           # HTTP layer: parse request, validate payload, call service
│       ├── services/orderService.ts   # business rules: status transitions, lookups, data
│       ├── middleware/errorHandler.ts # maps thrown errors to a JSON error body
│       ├── errors.ts                  # HttpError plus notFound / badRequest helpers
│       ├── types.ts                   # Order, OrderItem, OrderStatus
│       └── data/orders.json           # 15 fictional seed orders
└── frontend/
    ├── .env.example                   # VITE_API_URL template
    └── src/
        ├── main.tsx, App.tsx          # entry point and routes
        ├── index.css                  # all styles
        ├── pages/DashboardPage.tsx    # list, search, filter
        ├── pages/OrderDetailsPage.tsx # items, totals, status update
        ├── pages/NotFoundPage.tsx     # unknown routes and unknown order IDs
        ├── components/
        │   ├── OrdersTable.tsx        # order list with View links
        │   ├── OrderFilters.tsx       # search box and status filter
        │   ├── StatusBadge.tsx        # status pill
        │   ├── StatusActions.tsx      # buttons for the allowed transitions
        │   └── Feedback.tsx           # loading, error and empty states
        ├── hooks/useFetch.ts          # loading / error / data for any async loader
        ├── api/orders.ts              # the only place that calls fetch
        ├── lib/orders.ts              # pure helpers: filtering, line totals
        ├── lib/format.ts              # money and date formatting
        └── types.ts                   # Order types as returned by the API
```

## Getting started

Prerequisites: Node.js 26 or newer (see `.nvmrc`; run `nvm use` if you use nvm) and npm.

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

Every order in a response carries `allowedTransitions`, computed by the backend from the status rules, so the UI only ever offers moves the API will accept.

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

## Architecture notes

Routes only parse and validate the HTTP request. The service owns the business rules and throws `HttpError` with the right status. One error-handling middleware converts any thrown error into the JSON error shape.

The frontend fetches the full list once and derives the visible rows on the client with pure functions. A status change calls PATCH and the UI only changes after a 200 response; on failure the old status stays and the server's message is shown.

## Features completed

- Order listing with ID, customer, date, status badge, total and a View action
- Loading, error with retry, and empty states
- Search by order ID or customer name, combined with a status filter, with no page reload
- Order details with items, quantity, unit price, line total and order total
- Not-found handling for unknown order IDs, with a way back to the list
- Status update via buttons that only offer legal transitions; Completed and Cancelled orders are locked
- REST API with GET /orders, GET /orders/:id, PATCH /orders/:id, JSON responses, correct status codes, transition validation and exception handling

## Assumptions

- No authentication. A single internal staff user may view and update any order.
- Data is in memory. Restarting the backend resets every order to the seed file.
- Orders cannot be created, edited or deleted. Status is the only field that changes.
- Currency is assumed to be CAD. Dates are date-only ISO strings.