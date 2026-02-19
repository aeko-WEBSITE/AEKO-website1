# Aeko Creative Suite

AI-powered creative platform for generating images, videos, and content.

## 🚀 Quick Start

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:8080`

3. **API URL:** In development, the app uses the Vite proxy: requests to `/api` go to `http://localhost:5000`. Do **not** set `VITE_API_URL` in `.env` unless you want to point to a different backend.

### Backend Setup (required for Agent LLM and auth)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file in the `backend` directory (copy from below). At minimum you need `SARVAM_API_KEY` for the Agent LLM page.
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   SARVAM_API_KEY=your_sarvam_api_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Run backend server (must be running for frontend to connect):**
   ```bash
   npm run dev
   ```
   Backend runs on **http://localhost:5000**. Keep this terminal open.

### Local connection checklist

- **Frontend:** `npm run dev` → open **http://localhost:8080**
- **Backend:** `cd backend && npm run dev` → must be running on **http://localhost:5000**
- If the app says "Cannot connect to backend", start the backend first, then refresh the frontend.
- Test backend: open **http://localhost:5000/api/health** in the browser; you should see `{"success":true,"message":"Backend connected",...}`.

## 📁 Project Structure

```
aeko-creative-suite/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities (API client)
│   └── hooks/             # Custom React hooks
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── models/        # Mongoose models
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Auth & validation
│   └── package.json
└── package.json           # Frontend dependencies
```

## 🔑 Features

### Frontend
- ✅ Modern React + TypeScript + Vite
- ✅ Beautiful UI with Tailwind CSS & shadcn/ui
- ✅ Dashboard with AI tools
- ✅ Chat interface integrated with ModelsLab LLM
- ✅ Responsive design

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication
- ✅ ModelsLab LLM API integration
- ✅ Secure password hashing
- ✅ Request validation

## 🔌 API Integration

The frontend communicates with the backend through the API client in `src/lib/api.ts`.

### Authentication Flow

1. **Register/Login:**
   ```typescript
   import { authAPI } from '@/lib/api';
   
   // Register (requires email, username, password)
   const result = await authAPI.register(email, username, password);
   // Returns: { accessToken, refreshToken, tokenType, user }
   
   // Login (identifier can be email or username)
   const result = await authAPI.login(identifier, password);
   // Returns: { accessToken, refreshToken, tokenType, user }
   
   // Logout
   await authAPI.logout();
   
   // Refresh token
   const result = await authAPI.refresh(refreshToken);
   ```

2. **Using LLM Chat:**
   ```typescript
   import { llmAPI } from '@/lib/api';
   
   const response = await llmAPI.chat("Your message here", {
     temperature: 0.7,
     max_tokens: 1000
   });
   ```

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- express-validator

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Backend (backend/.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
MODELSLAB_API_KEY=your_api_key
PORT=5000
NODE_ENV=development
```

## 🚢 Deployment

### Vercel (frontend + Agent chat)

The repo includes a **Vercel serverless function** at `api/llm/chat-completions.js`, so the **Agent chat** works on Vercel without a separate backend.

1. Deploy the repo to Vercel (connect GitHub, build command `npm run build`, output `dist`).
2. In Vercel → **Project → Settings → Environment Variables**, add:
   - **Name:** `SARVAM_API_KEY`
   - **Value:** your Sarvam API key
   - Apply to **Production** (and Preview if you want).
3. Redeploy. The Agent page will call `/api/llm/chat-completions` on the same domain, handled by the serverless function.

**Optional:** If you deploy the full backend elsewhere (Railway, Render, etc.), set **`VITE_API_URL`** on Vercel to that backend URL (no trailing slash). Then auth, image, video, and payment will use the external backend; if `VITE_API_URL` is not set, only the Agent chat (via the serverless function) works on Vercel.

### Full backend (Railway, Render, etc.)

For auth, image, video, and payment in production, deploy the **backend** folder:

- Root directory: `backend`
- Build: `npm install`
- Start: `npm start` or `node src/app.js`
- Add env vars from `backend/.env.example` (e.g. `MONGODB_URI`, `JWT_SECRET`, `SARVAM_API_KEY`, `MODELSLAB_API_KEY`).
- Then set **`VITE_API_URL`** on Vercel to your backend URL so the frontend uses it.

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Components](./src/components/README.md) (if exists)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC
