# Sarvam Chat Backend

Production-ready backend for Sarvam AI chat. API key is kept server-side.

## Setup

```bash
cd sarvam-backend
npm install
```

Copy `.env.example` to `.env` and set `SARVAM_API_KEY` (or use the existing `.env` if present).

## Run

```bash
node server.js
```

Server runs on **http://localhost:3000**. Frontend at `/dashboard/tools-old/agent` uses `VITE_SARVAM_CHAT_URL` (defaults to `http://localhost:3000`) to call `POST /api/chat`.

## API

- **GET /** – Health check
- **POST /api/chat** – Body: `{ "messages": [ { "role": "user", "content": "..." } ] }`. Returns `{ "success": true, "reply": "..." }`.
