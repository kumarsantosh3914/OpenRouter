# OpenRouter

Monorepo for an OpenRouter-style dashboard + backend services.

## Screenshots

Place the screenshots in `assets/screenshots/` (create the folder if it doesn't exist) using the filenames below.

### Landing

![Landing](/assets/screenshots/landing.png)

### Model Explorer — Models

![Model Explorer - Models](/assets/screenshots/model-explorer-models.png)

### Model Explorer — Providers

![Model Explorer - Providers](/assets/screenshots/model-explorer-providers.png)

### Model Explorer — Pricing

![Model Explorer - Pricing](/assets/screenshots/model-explorer-pricing.png)

## Apps

- `apps/dashboard-frontend`
  - React + Vite dashboard
  - Proxies `/api` to `http://localhost:3000` in dev (see `vite.config.ts`)
- `apps/primary-backend`
  - Express API server (defaults to port `3000`)
  - Routes:
    - `/api/v1/auth`
    - `/api/v1/api-keys`
    - `/api/v1/models`
    - `/api/v1/payments`
- `apps/api-backend`
  - Express service (defaults to port `3001`)
