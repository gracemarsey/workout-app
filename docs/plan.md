# Workout App - Implementation Plan

## Overview

A personalized workout app for building overall strength, supporting both home and gym workouts with three sessions per week: upper body, lower body, and full body/cardio.

## Data Source

Uses the [free-exercise-db](https://github.com/yuhonas/free-exercise-db) open-source database (873 exercises) located at `/free-exercise-db/`.

- **Home equipment**: dumbbell, bands, body only
- **Gym equipment**: All equipment types (barbell, cable, machine, etc.)
- **Image URL pattern**: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{id}/{index}.jpg`

---

## Phase 1: Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `users` (existing) | User authentication |
| `user_preferences` | User settings (location, current week/cycle) |
| `user_exercise_preferences` | Per-exercise tracking (preferred reps/weight) |
| `user_dismissed_equipment` | Track dismissed equipment types per user |
| `completed_workouts` | Workout completion logs with duration |
| `workout_templates` | Pre-built workout configurations for variety |

---

## Phase 2: Backend

### Exercise Service (`backend/db/services/exercises.ts`)
- Load and cache `exercises.json` at startup
- Filter by equipment type (home vs gym)
- Filter by muscle groups (upper/lower/full body)
- Query by equipment availability

### Workout Generation (`backend/db/services/workoutGenerator.ts`)
- **Variety Algorithm**:
  - Exclude exercises used in last 2 weeks
  - Respect dismissed equipment
  - Random selection from eligible pool
- **Progressive Overload**:
  - Track avg reps/weight per exercise per week
  - Week 4: Auto-increase weight by 5-10% or add reps
- **Exercise Structure** (per workout):
  - 5-8 exercises
  - Include warmup and cooldown
  - Each with target reps and weight

### API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | List filtered exercises |
| GET | `/api/exercises/:id` | Single exercise with images |
| POST | `/api/workouts/generate` | Generate workout (type + location + exclusions) |
| POST | `/api/workouts/complete` | Mark workout complete (save duration) |
| POST | `/api/workouts/dismiss` | Dismiss exercise with reason |
| GET | `/api/progress/weekly` | Weekly stats (0-3 completed) |
| GET | `/api/progress/suggestion` | Next recommended workout |

### Dismissal Logic
- **"Equipment not available"**: Block equipment for current workout only
- **"Don't feel like it"**: Persist dismissal, exclude equipment from future workouts

---

## Phase 3: Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Welcome + weekly progress + suggested workout |
| `/workouts` | WorkoutsPage | Three sections (Upper/Lower/Full) |
| `/workouts/:type` | WorkoutDetailPage | Individual workout with timer |

---

## Phase 4: Components

### New Components

| Component | Description |
|-----------|-------------|
| `ProgressTracker` | Weekly progress (0/3 workouts) |
| `WorkoutCard` | Preview card for each workout type |
| `WorkoutTimer` | Start/Pause/Resume, MM:SS display |
| `WorkoutProgress` | Progress bar showing % complete |
| `ExerciseItem` | Exercise card with reps/weight, complete/dismiss buttons |
| `DismissModal` | Modal with dropdown for dismissal reason |
| `LocationSelector` | Home vs Gym toggle |
| `ExerciseImage` | Image component with loading state |

### Timer States
```
idle → running → paused → completed
```

### Timer Logic
- Start: Sets state to running, records start time
- Pause: Pauses timer, stores elapsed time
- Resume: Continues from paused time
- Complete: Stops timer, saves duration

---

## Phase 5: State Management

### Zustand Store (`frontend/src/zustand/workoutStore.ts`)

```typescript
interface WorkoutStore {
  location: 'home' | 'gym';
  currentWorkout: Workout | null;
  timerState: 'idle' | 'running' | 'paused' | 'completed';
  elapsedSeconds: number;
  weeklyProgress: { upper: boolean; lower: boolean; full: boolean };
  
  setLocation: (loc: 'home' | 'gym') => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  markExerciseComplete: (exerciseId: string) => void;
  dismissExercise: (exerciseId: string, reason: string) => void;
}
```

### React Query Hooks

| Hook | Purpose |
|------|---------|
| `useExercises` | Fetch filtered exercises |
| `useGenerateWorkout` | Generate new workout |
| `useCompleteWorkout` | Mark workout complete |
| `useDismissExercise` | Dismiss exercise |
| `useWeeklyProgress` | Get weekly stats |
| `useSuggestedWorkout` | Get next recommended workout |

---

## Implementation Order

1. **Database Schema** - Create all tables, run migrations
2. **Exercise Service** - Load & filter free-exercise-db
3. **Workout Generator** - Variety + dismissal + progressive logic
4. **Backend Routes** - All API endpoints
5. **Frontend Routing** - Pages structure
6. **WorkoutTimer Component** - Timer with states
7. **WorkoutProgress Component** - Progress bar
8. **ExerciseItem Component** - With dismiss functionality
9. **DismissModal Component** - Reason dropdown
10. **State & Queries** - Connect everything
11. **Home Page** - Welcome + progress + suggestion
12. **Workouts Page** - Three sections
13. **Workout Detail Page** - Full workout experience
14. **Testing & Polish**

---

## File Summary

| Area | Files |
|------|-------|
| Schema | `user_preferences.ts`, `user_exercise_preferences.ts`, `user_dismissed_equipment.ts`, `completed_workouts.ts` |
| Backend Services | `exercises.ts`, `workoutGenerator.ts` |
| Backend Routes | `exercises.ts`, `workouts.ts` |
| Components | `ProgressTracker/`, `WorkoutCard/`, `WorkoutTimer/`, `WorkoutProgress/`, `ExerciseItem/`, `DismissModal/`, `LocationSelector/` |
| Pages | `Home/`, `Workouts/`, `WorkoutDetail/` |
| Zustand | `workoutStore.ts` |
| Queries | `useExercises.ts`, `useGenerateWorkout.ts`, `useCompleteWorkout.ts`, `useDismissExercise.ts`, `useWeeklyProgress.ts`, `useSuggestedWorkout.ts` |
