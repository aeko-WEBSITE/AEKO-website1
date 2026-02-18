# Aeko Creative Suite Backend

Production-ready Node.js backend API for Aeko Creative Suite.

## Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** (MongoDB Atlas) + **Mongoose**
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** enabled
- **express-validator** for request validation

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   └── User.js           # User Mongoose schema
│   ├── controllers/
│   │   ├── authController.js # Auth logic (register, login)
│   │   └── llmController.js  # LLM API proxy
│   ├── routes/
│   │   ├── authRoutes.js     # Auth endpoints
│   │   └── llmRoutes.js      # LLM endpoints
│   ├── middleware/
│   │   ├── auth.js           # JWT protection middleware
│   │   └── validation.js     # Request validation
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your:
   - MongoDB Atlas connection string
   - JWT secret (use a strong random string)
   - ModelsLab API key
   - Port (default: 5000)

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

4. **Run production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
- `GET /` - Returns backend status

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (protected)
  Headers: `Authorization: Bearer <token>`

### LLM (Sarvam AI Integration)
- `POST /api/llm/chat` - Chat with Sarvam AI
  ```json
  {
    "message": "Write a PHP function to make API call",
    "systemPrompt": "Optional custom system prompt",
    "max_tokens": 1000,
    "temperature": 0.7,
    "top_p": 0.9
  }
  ```

- `POST /api/llm/chat-completions` - Sarvam AI chat completions (OpenAI-compatible; used by Agent LLM page)
  ```json
  {
    "prompt": "Tell me about Indian classical music.",
    "model": "sarvam-m",
    "temperature": 0.7,
    "reasoning_effort": "high",
    "stream": false
  }
  ```
  Returns: `{ "choices": [{ "message": { "content": "..." } }] }`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `SARVAM_API_KEY` | Sarvam AI API subscription key | Yes (for LLM) |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |

## Deployment

### Render / Railway / Vercel

1. Set environment variables in your hosting platform
2. Build command: `npm install`
3. Start command: `npm start`
4. Ensure `PORT` environment variable is set (most platforms set this automatically)

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS enabled
- ✅ Request validation
- ✅ Error handling middleware
- ✅ Environment variable management

## Notes

- Passwords are automatically hashed before saving
- JWT tokens expire after 30 days
- API keys are stored securely in environment variables
- All protected routes require valid JWT token in Authorization header

