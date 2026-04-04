# Workout App - Project Documentation

## Overview

This is a monorepo template for a full-stack web application using:

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS v3
- **Backend**: Fastify + TypeScript + Drizzle ORM + SQLite
- **PWA**: Service worker support for offline capability

## Project Structure

```
workout-app/
├── backend/              # Fastify API server
│   ├── db/
│   │   ├── schema/       # Drizzle ORM table definitions
│   │   ├── services/     # Business logic layer
│   │   ├── repositories/ # Data access layer
│   │   ├── router/       # Fastify route definitions
│   │   ├── index.ts      # Database connection
│   │   └── migrate.ts    # Migration runner
│   ├── index.ts          # Server entry point (port 9205)
│   └── drizzle.config.ts # Drizzle configuration
│
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── routes/       # TanStack Router setup
│   │   ├── queries/      # React Query hooks for API calls
│   │   ├── zustand/      # State management
│   │   ├── main.tsx      # App entry point
│   │   └── routeTree.gen.ts # Generated route tree
│   └── package.json
│
├── .templates/           # Code generation templates
├── .vscode/              # VS Code settings
└── package.json          # Root scripts for running both apps
```

## Tech Stack Details

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS v3** for styling
- **TanStack Router** for routing
- **React Query** for data fetching
- **Zustand** for client state management
- **Axios** for HTTP requests
- **Ladle** for component storybook

### Backend

- **Fastify** web framework
- **Drizzle ORM** with SQLite driver
- **Better-SQLite3** as the database
- **JWT** for authentication
- **Bcrypt** for password hashing

## Getting Started

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Set Up Database

```bash
cd backend
npm run migrate
```

### 3. Run Development Servers

```bash
npm run dev
```

This starts:

- Frontend on http://localhost:9204
- Backend on http://localhost:9205

### 4. Run in Production (with PM2)

```bash
npm run start
```

### 5. Stop Production

```bash
npm run stop
```

## Database

### Schema

Currently includes a `users` table:

- `username` (text, unique, required)
- `password` (text, required)

### Migrations

Generate new migration:

```bash
cd backend
npm run migration
```

Apply migrations:

```bash
npm run migrate
```

## API Routes

The backend exposes routes under `/api`:

- `GET /api/users/:id` - Get user by ID
- `GET /api/users/me` - Get current user (JWT required)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login and get JWT token

## Frontend Structure

### Components

- `/components/Button/` - Example component with stories

### Pages

- `/pages/Home/` - Home page

### Queries

- `useLoginUser` - Login mutation hook
- `useRegisterUser` - Registration mutation hook
- `useGetMe` - Get current user hook
- `useGetUser` - Get user by ID hook

### State (Zustand)

- `useUserStore` - Token storage with persistence

## Scripts Reference

| Script                | Description                               |
| --------------------- | ----------------------------------------- |
| `npm run install-all` | Install all dependencies                  |
| `npm run dev`         | Run both frontend and backend in dev mode |
| `npm run start`       | Start both apps in production with PM2    |
| `npm run stop`        | Stop PM2 processes                        |
| `npm run restart`     | Pull, stop, and restart                   |
