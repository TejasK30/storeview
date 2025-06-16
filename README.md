# Storeview

A full-stack web application for managing stores, users, and reviews, featuring role-based dashboards for system admins, store owners, and users.

## Tech Stack

- **Frontend:** Next.js, React 19, Tailwind CSS, ShadCN UI, React Query, Zod, Axios, React Hook Form,
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, JWT, Bcrypt, Dotenv, Cookie Parser, CORS
- **Database:** PostgreSQL (managed via Prisma)

## Features

- User authentication (register, login, logout, profile update)
- Role-based dashboards: System Admin, Store Owner, User
- Store management (add, view, and manage stores)
- User management (add, view users)
- Store ratings and reviews (submit, edit, view)
- Admin dashboard with statistics
- Responsive UI with modern components

## Installation

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (v8+)
- PostgreSQL database

### Setup

1. **Clone the repository:**

   ```sh
   git clone  https://github.com/TejasK30/storeview.git
   ```

   ```sh
   cd storeview
   ```

2. **Install dependencies:**

   ```sh
   cd backend
   pnpm install

   cd frontend
   pnpm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` in backend and fill in the required values (see below).

- Environment Variables

Create a `.env` file in the backend directory with the following:

```
DATABASE_URL=postgresql://<user>:<password>localhost:5432/<db>
JWT_SECRET=your_jwt_secret
```

4. **Set up the database:**

```sh
cd backend
pnpm generate
pnpm migrate
```

## Running the Project

### Backend

```sh
cd backend
pnpm dev
```

- Runs TypeScript in watch mode and starts the server with nodemon.

### Frontend

```sh
cd frontend
pnpm dev
```

- Starts the Next.js development server.

## Folder Structure

```
storeview/
│
├── backend/
│   ├── src/
│   │   ├── app.ts                # Express app entry
│   │   ├── controllers/          # Route controllers
│   │   ├── db/                   # Database connection
│   │   ├── middlewares/          # Auth middleware
│   │   └── routes/               # API route definitions
│   ├── prisma/                   # Prisma schema and migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js pages and layouts
│   │   ├── components/           # UI components
│   │   ├── contexts/             # React contexts
│   │   ├── hooks/                # Custom hooks
│   │   └── lib/                  # Utilities, schemas, services
│   └── package.json
│
└── README.md
```

## API Endpoints Summary

### Auth Routes (`/api/auth`)

- `POST /register` — Register a new user
- `POST /login` — Login user
- `GET /profile` — Get current user profile
- `GET /logout` — Logout user
- `PUT /updateprofile` — Update user profile

### Admin Routes (`/api/admin`)

- `GET /stats` — Get dashboard statistics
- `GET /users` — List all users
- `GET /stores` — List all stores
- `POST /users` — Add a new user
- `POST /stores` — Add a new store

### Store Routes (`/api/store`)

- `GET /overview` — Store overview for owner
- `GET /:storeId/ratings` — Get ratings for a store
- `GET /getstores` — List all stores
- `GET /reviews/user/:userId` — Get reviews by user
- `POST /reviews/submit` — Submit a new rating
- `PUT /reviews/edit` — Edit an existing rating

### Additional Notes for Storeview

- **Project Structure:**

  - The project uses separate `backend` and `frontend` folders.

- **Backend:**

  - Uses Prisma ORM for database access.
  - Environment variables are loaded via `dotenv`.
  - JWT authentication is implemented in `middlewares/auth.ts`.
  - All API endpoints are prefixed with `/api`.

- **Frontend:**

  - Built with Next.js and React.
  - Uses React Query for data fetching and caching.
  - UI components are built with Shadcn UI and Tailwind CSS.
  - Forms use React Hook Form and Zod for validation.

- **API Integration:**
  - API services are defined in `frontend/src/lib/services/`.
