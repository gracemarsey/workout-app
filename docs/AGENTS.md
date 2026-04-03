# Project Context for AI Assistants

This is the **workout-app** project - a full-stack web application template.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS v3
- **Backend**: Fastify + TypeScript + Drizzle ORM + SQLite
- **Ports**: Frontend (5173), Backend (7231)

## Quick Start

```bash
# Install all dependencies
npm run install-all

# Run development servers
npm run dev

# Database migration
cd backend && npm run migrate
```

## Important Notes

- This is a monorepo with `frontend/` and `backend/` directories
- Backend uses SQLite database with Drizzle ORM
- JWT authentication for API endpoints
- PWA support enabled for offline capability
