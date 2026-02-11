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

3. **Configure API URL (optional):**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   If not set, defaults to `http://localhost:5000`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   MODELSLAB_API_KEY=your_modelslab_api_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Run backend server:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

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

### Frontend (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=your_backend_url`

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set root directory: `backend`
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `.env`

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
