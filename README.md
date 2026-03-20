# Storeview

A full-stack web application for managing stores, users, and reviews, featuring role-based dashboards for system admins, store owners, and users.

## Tech Stack

- **Frontend:** Next.js, React 19, Tailwind CSS, ShadCN UI, React Query, Zod, Axios, React Hook Form
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

---

## Prerequisites

Make sure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+
- [PostgreSQL](https://www.postgresql.org/) running locally (or a remote instance)

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/TejasK30/storeview.git
cd storeview
```

### 2. Set up the Backend

```sh
cd backend
pnpm install
```

Create a `.env` file inside the `backend` directory:

```sh
cp .env.example .env
```

Fill in the values:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
JWT_SECRET=your_jwt_secret
PORT=3000
```

> Make sure your PostgreSQL server is running and the database exists before the next step.
> You can create the database manually:
> ```sh
> psql -U <user> -c "CREATE DATABASE <dbname>;"
> ```

Generate the Prisma client and run migrations:

```sh
pnpm prisma generate
pnpm prisma migrate deploy
```

Start the backend dev server:

```sh
pnpm dev
```

The backend runs on `http://localhost:5000` by default.

---

### 3. Set up the Frontend

Open a new terminal:

```sh
cd frontend
pnpm install
```

Create a `.env.local` file inside the `frontend` directory:

```env
NODE_API_URL=http://localhost:5000
```

Start the frontend dev server:

```sh
pnpm dev
```

The frontend runs on `http://localhost:3000` by default.

---

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

---

## API Endpoints Summary

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |
| GET | `/profile` | Get current user profile |
| GET | `/logout` | Logout user |
| PUT | `/profile` | Update user profile |

### User Routes (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all users (system_admin only) |
| POST | `/` | Add a new user (system_admin only) |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Get dashboard statistics (system_admin only) |

### Store Routes (`/api/store`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/overview` | Store overview for owner (store_owner only) |
| GET | `/` | List all stores with pagination, search, and sorting |
| POST | `/` | Add a new store (system_admin only) |

### Review Routes (`/api/review`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/:storeId` | Get ratings for a specific store |
| GET | `/user/:userId` | Get reviews by user ID |
| POST | `/` | Submit a new rating |
| PUT | `/` | Update an existing rating |

---

## Notes

- The backend and frontend must both be running at the same time during development.
- All backend API endpoints are prefixed with `/api`.
- JWT tokens are stored in cookies and handled via the auth middleware.
- React Query is used on the frontend for data fetching and caching.
- Forms are validated using React Hook Form + Zod.
- UI is built with ShadCN UI and Tailwind CSS.
