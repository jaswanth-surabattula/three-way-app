# CLAUDE.md

## Project Overview

Three-Way App is a full-stack application with a React (TypeScript) frontend and Python (FastAPI) backend.

## Architecture

- `frontend/` — React app bootstrapped with Vite and TypeScript
- `backend/` — Python FastAPI server

## Development Commands

### Frontend
- `cd frontend && npm install` — install dependencies
- `cd frontend && npm run dev` — start dev server
- `cd frontend && npm run build` — production build
- `cd frontend && npm run lint` — run linter

### Backend
- `cd backend && pip install -r requirements.txt` — install dependencies
- `cd backend && uvicorn app.main:app --reload` — start dev server
- `cd backend && pytest` — run tests

## Conventions

- Frontend uses functional React components with hooks
- Backend follows FastAPI project structure with routers in `app/api/`
- All API endpoints are prefixed with `/api/v1/`
