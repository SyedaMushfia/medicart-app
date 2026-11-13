# MediCart

The project is separated into two application folders:

- `frontend/` — React application, pages, assets, and frontend tests
- `backend/` — Node.js REST API, database integration, and Supabase schema

The root contains this README, shared TypeScript contracts, and common project configuration.

## Configure Supabase

1. Create a Supabase project. This schema is intended for a new, empty project.
2. In the Supabase dashboard, copy the project URL and a server-side secret API key.
   The legacy `service_role` key is also supported.
3. Copy `.env.example` to `.env` in the project root and fill in the values:
   ```dotenv
   SUPABASE_URL="https://your-project-ref.supabase.co"
   SUPABASE_SECRET_KEY="your-server-side-secret-key"
   ```
   Keep this file local and do not commit it. Never put the secret key in a
   `VITE_` variable, frontend code, or a message/chat.
4. Open the Supabase SQL Editor and run [`backend/supabase-schema.sql`](./backend/supabase-schema.sql).
   It creates the medicines, orders, and order_items tables plus the transactional
   `place_order` function.
5. To load the optional starter products, run
   [`backend/supabase-catalog.sql`](./backend/supabase-catalog.sql) once. You can
   skip this and add medicines directly to the `medicines` table instead.

## Run locally

**Prerequisites:** Node.js and npm

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the backend in one terminal:
   ```sh
   npm run backend
   ```
3. Start the frontend in another terminal:
   ```sh
   npm run dev
   ```

The frontend is available at `http://localhost:5173` and the API at `http://localhost:3001`. During development, Vite proxies `/api` requests to the backend.

Check the backend at `http://localhost:3001/api/health`. A successful response
confirms the backend can reach Supabase and query the medicines table; a 503
response includes the connection or schema error. Orders can be looked up using
both their reference and the customer's email. Expected delivery is one hour
after the order is placed.

To connect a separately deployed frontend directly to an API, set `VITE_API_URL` to the API base URL including `/api`, for example `https://api.example.com/api`. Backend settings such as `PORT`, `SUPABASE_URL`, and Supabase keys are read from the root `.env` file.

## Build and test

- `npm run build` — build the frontend
- `npm run build:backend` — bundle the backend to `backend/dist/`
- `npm run start:backend` — run the built backend
- `npm run test:frontend` — run frontend tests
- `npm run test:backend` — run backend tests
- `npm run test` — run all tests
- `npm run lint` — type-check the project
