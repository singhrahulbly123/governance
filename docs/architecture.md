# Architecture

## Application boundary

DIA Thrive is an academic governance ERP with a Laravel API and a Next.js administrator interface. Next.js renders administrator and super-administrator screens in `frontend/`. Laravel Blade screens remain available in `backend/` during the interface transition.

Laravel exposes versioned REST APIs below `/api/v1` for the Next.js interface and approved integrations. Browser administrator sessions use Laravel's server-side session authentication. Sanctum supports authenticated API access and credentials must not be placed in browser storage.

## Backend responsibilities

- Controllers coordinate HTTP requests and responses.
- Form Requests validate input.
- Policies and middleware enforce role and permission checks.
- Eloquent models manage PostgreSQL persistence and relationships.
- API Resources provide stable API representations.
- Services and Actions are introduced only for reusable business operations.
- Jobs execute asynchronous work through Redis-backed queues.

## Infrastructure

PostgreSQL is the primary database. Redis is used for cache and queue workloads. Docker Compose provides both services for local development. Laravel Horizon is a Linux-only deployment concern because it needs the Unix `pcntl` and `posix` extensions.
