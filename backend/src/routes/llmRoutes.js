import express from 'express';
import { llmChat, chatCompletions } from '../controllers/llmController.js';

const router = express.Router();

// LLM chat endpoint - public access (no authentication required)
router.post('/chat', llmChat);

// Sarvam AI chat completions (OpenAI-compatible shape for Agent LLM page)
router.post('/chat-completions', chatCompletions);

export default router;


