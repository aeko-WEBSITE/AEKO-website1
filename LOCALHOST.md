# Running on localhost

## 1. Start the backend (Terminal 1)

```bash
cd backend
cp .env.example .env
# Edit .env and set SARVAM_API_KEY=your_key
npm install
npm run dev
```

Backend runs on **port 5000**. Test: http://localhost:5000/api/health

## 2. Start the frontend (Terminal 2)

From the **project root**:

```bash
npm install
npm run dev
```

Open **http://localhost:8080** in your browser.

## If it still doesn't connect

- Start **backend first**, then frontend.
- Use **http://localhost:8080** for the app (Vite proxies /api to backend).
- Set **SARVAM_API_KEY** in backend/.env for the Agent LLM page.
- Ensure nothing else is using port 5000 or 8080.

## URLs

- App: http://localhost:8080
- Backend health: http://localhost:5000/api/health
