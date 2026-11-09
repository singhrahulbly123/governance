# Development setup

## Requirements

- PHP 8.3–8.5 and Composer 2
- Node.js and npm for the Next.js administration interface
- Docker Desktop for PostgreSQL and Redis

## Infrastructure

Copy `.env.example` to `.env`, set a strong local `POSTGRES_PASSWORD`, and start the local dependencies:

```powershell
docker compose up -d
```

## Laravel ERP application

Configure `backend/.env` with the PostgreSQL credentials, then run:

```powershell
cd backend
composer install
php artisan migrate
php artisan serve
```

## Next.js administration interface

The administrator and super-administrator interface runs in `frontend/` on port 3000. Laravel must run on port 8000 and its local environment must include `localhost:3000` in `SANCTUM_STATEFUL_DOMAINS` and `CORS_ALLOWED_ORIGINS`.

```powershell
cd frontend
npm install
npm run dev
```

## Verification

```powershell
cd backend
php artisan test
vendor/bin/pint --format agent
```

Install Laravel Horizon only in a Linux Docker or production environment; native Windows PHP does not provide its required `pcntl` and `posix` extensions.
