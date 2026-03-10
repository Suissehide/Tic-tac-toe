# Tic-Tac-Toe

Online multiplayer Tic-Tac-Toe with authentication, game rooms, move history, scores, and rematch voting.

## Stack

- **Backend**: Fastify + WebSocket + Awilix (IoC) + Zod + JWT
- **Frontend**: React 19 + TanStack Router/Query + Zustand + Tailwind + Radix UI

## Features

- Authentication (register, login, logout, token refresh)
- Create and join game rooms
- Real-time gameplay via WebSocket
- Move history
- Scores per game
- Rematch voting

## Prerequisites

- [Volta](https://docs.volta.sh/guide/getting-started): automatic Node.js and NPM version management

## Quick Start

### Backend

```shell
cd back
npm install
npm run dev
```

### Frontend

```shell
cd front
npm install
npm run dev
```

## Deployment

The `deploy/` folder contains the Docker Compose configuration for production (backend + frontend), with Traefik as reverse proxy.

```shell
cd deploy
docker compose --profile backend --profile frontend up -d
```

Environment variables are configured in `deploy/.env`.

## Useful scripts (backend)

| Command | Description |
| --- | --- |
| `npm run dev` | Start in development mode with watch |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Linter (Biome) |
