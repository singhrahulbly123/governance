# DIA Thrive

DIA Thrive is an academic governance ERP built as a Laravel 13 application.

## Architecture decision

The administrator login and ERP dashboard are delivered by the `frontend/` Next.js application. It uses Laravel's versioned REST API and Sanctum session authentication. Laravel Blade templates remain in `backend/` during the interface transition.

Laravel is responsible for session authentication, versioned REST APIs, background jobs, and persistence. PostgreSQL is the intended production database and Redis is reserved for cache and queues.

## Repository layout

- `backend/` — Laravel 13 ERP application, Blade views, REST API, migrations, tests, and Vite assets
- `docs/` — architecture, setup, and coding standards
- `docker-compose.yml` — PostgreSQL and Redis development services

## Local development

Install PHP 8.3–8.5, Composer 2, Node.js, and Docker Desktop. Configure `backend/.env` for PostgreSQL before running migrations.

```powershell
Copy-Item .env.example .env
docker compose up -d

cd backend
composer install
php artisan migrate
php artisan serve

cd ../frontend
npm install
npm run dev
```

Start Laravel on port 8000 and Next.js on port 3000. The Next.js application uses Laravel Sanctum sessions and the `/api/v1` API.
