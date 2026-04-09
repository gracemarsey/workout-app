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

## Gym Equipment Configuration

The app is configured for the following gym equipment located at the user's gym:

### Available Equipment
- **Cardio**: 2 cross trainers, 2 rowing machines, 3 treadmills, 2 stationery bikes, 1 stairmaster
- **Free Weights**: Dumbbells, a couple of standard bars, weight plates, 1 EZ curl bar, kettlebells
- **Machines**: Cable machine, chest fly machine, high pull/low rowing trainer, 2 leg press machines, leg extension, squat rack, bench press machine
- **Other**: 2 benches, exercise ball, resistance bands, box (for box jumps)

### Supported Exercise Equipment Types
The workout generator supports the following equipment types from the exercise database:
- `dumbbell` - Dumbbell exercises
- `barbell` - Barbell exercises (standard bars for squat rack, bench press, weight plate exercises like plate rows, plate presses)
- `e-z curl bar` - EZ curl bar exercises
- `cable` - Cable machine exercises
- `machine` - Machine exercises (leg press, leg extension, chest fly, etc.)
- `kettlebells` - Kettlebell exercises
- `bands` - Resistance band exercises
- `exercise ball` - Exercise ball exercises
- `body only` - Bodyweight exercises (including cardio and stretching)
- `other` - Other equipment (box jumps, etc.)

### Home Equipment
For home workouts, the following equipment is supported:
- `dumbbell` - Dumbbells
- `bands` - Resistance bands
- `body only` - Bodyweight exercises

## Workout Structure

### Balanced Muscle Groups
Each workout type ensures balanced muscle group targeting:

**Upper Body Workout:**
- Push muscles: chest, shoulders, triceps
- Pull muscles: lats, biceps
- Each workout targets 1 exercise per major upper body muscle group

**Lower Body Workout:**
- Quads, hamstrings, glutes, calves
- Balanced distribution with 2 quad exercises, 1 hamstring, 1 glute, 1 calf exercise

**Full Body Workout:**
- All major muscle groups covered
- 1 exercise per: chest, lats, shoulders, biceps, triceps, quads, hamstrings, glutes, abdominals

### Workout Components
Each generated workout includes:
- **Main Exercises (6-8)**: Strength exercises targeting the workout's muscle groups
- **Stretches (2-3)**: Targeted stretches specific to the workout type

### Exercise Replacement
When skipping an exercise:
- If the skipped muscle group would become under-represented, a replacement targeting the same muscle group is suggested
- Otherwise, a replacement from a different muscle group is suggested to maintain overall balance
- This ensures workouts stay balanced and effective
