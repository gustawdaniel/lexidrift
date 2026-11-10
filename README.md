# Lexidrift 🌍

An open-source language learning application with multiple microservices.
Lexidrift provides a comprehensive set of linguistic tools including a vocabulary app, automated flashcard generation, text vocalization, and image suggestions.

[app.lexidrift.com](https://app.lexidrift.com)

## Architecture

This project is structured as a monorepo consisting of several independent microservices:

- **`app/`** - Main frontend PWA (Progressive Web App) for users.
- **`landing/`** - The promotional landing page marketing the application.
- **`api/`** - The core backend API powering the primary application features.
- **`imagify/`** - Microservice for generating or serving image representations for flashcards.
- **`vocalize/`** - Microservice handling Text-to-Speech (TTS) creation for vocabulary terms.
- **`lexify/`** - Microservice providing definitions, examples, and NLP processing.
- **`data/`** & **`docs/`** & **`video/`** - Supporting tools and resources for the project.

## Getting Started

### Prerequisites
Make sure you have Node.js and Docker installed. Many services also rely on PNPM.

### Local Development
To run individual services locally, navigate to their respective directories and start the development server. For example:

```bash
cd app
pnpm install
pnpm run dev
```

Run the service with its environment loaded, e.g.:

```bash
set -a; . ./.env.dev; set +a     # zmienne z pliku .env.dev
pnpm run dev
```

## Secrets

Infisical is gone (2026-11-10). Every service reads a plain **`.env`** file:

- **produkcja** — `/root/<usługa>.lexidrift.com/.env` na hoście `lexidrift` (600, poza gitem);
  `docker-compose.yml` wczytuje go przez `env_file: [.env]`. CI **nie** wysyła sekretów —
  wysyła tylko `docker-compose.yml` i robi `docker compose up -d`.
- **lokalnie** — `.env.<usługa>` w katalogu repo (np. `.env.api`, `.env.imagify`), wpisy w `.gitignore`.
  Skrypty `dev`/`test`/`migration:*` nie wstrzykują już zmiennych same z siebie — wczytaj plik
  (`set -a; . ./.env.api; set +a`) albo użyj `node --env-file=.env.api`.
- kopia wszystkich środowisk (dev/staging/prod) sprzed wyłączenia Infisicala:
  `~/backups/2026-11-10-infisical/lexidrift/`.

## Deploy

Każda usługa ma własny workflow (`.github/workflows/deploy-<usługa>.yml`): build na `linux/amd64`
→ push do `registry.preciselab.space` → `scp` samego `docker-compose.yml` → `docker compose up -d`
na hoście `lexidrift` (188.245.164.95). Sekrety **nie** jadą przez CI — leżą w `/root/<usługa>.lexidrift.com/.env`.

| usługa | domena | port hosta | workflow |
|---|---|---|---|
| `api` | api.lexidrift.com | 4747 | `deploy-api.yml` |
| `app` | app.lexidrift.com | 7000 | `deploy-app.yml` |
| `imagify` | imagify.lexidrift.com (:80) | 5000 | `test-imagify.yml` → `deploy-imagify.yml` |
| `lexify` | lexify.lexidrift.com | **3100** (3000 zajmuje `fitdrift`) | `deploy-lexify.yml` |
| `vocalize` | vocalize.lexidrift.com (:80) | 4000 | `deploy-vocalize.yml` |
| `video` | video.lexidrift.com | 8080 | `deploy-video.yml` |

## Znane problemy

- **Node 26 usunął `buffer.SlowBuffer`**, a `jsonwebtoken → jwa → buffer-equal-constant-time@1.0.1`
  go wymaga. Dlatego `api` i `imagify` mają `pnpm.patchedDependencies` z patchem
  `patches/buffer-equal-constant-time@1.0.1.patch` (fallback na `Buffer`). Bez tego kontener
  wywala się przy starcie na `TypeError: Cannot read properties of undefined (reading 'prototype')`.
- **Mongo (Atlas `cluster0.3p7sz.mongodb.net`) nie odpowiada** — brak rekordu SRV, więc klaster jest
  prawdopodobnie zatrzymany (M0) albo usunięty. `lexify` bez bazy wpada w restart loop, `api`
  wstaje, ale operacje na danych nie zadziałają. Naprawa: wznowić klaster w panelu Atlas.

## Contributing
Contributions and Pull Requests are welcome!
Any changes to a specific service will automatically trigger its dedicated GitHub Actions pipeline validating the build.

## Support / Analytics
- Product Roadmap & Suggestions: [Lexidrift Canny](https://lexidrift.canny.io/)
- App Analytics: [Umami Dashboard App](https://cloud.umami.is/share/pHfQ5Xuw8lbEHqDs/app.lexidrift.com)
- Landing Analytics: [Umami Dashboard Landing](https://cloud.umami.is/share/jytZJfaJBlReFE1C/lexidrift.com)

## License
Free for non-commercial personal early-adoption testing.
