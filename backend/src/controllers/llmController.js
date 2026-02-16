import fetch from 'node-fetch';

const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';

// POST /api/llm/chat - uses Sarvam AI
export const llmChat = async (req, res) => {
  try {
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Sarvam API key is not configured on the server (SARVAM_API_KEY)',
      });
    }

    const { message, systemPrompt, max_tokens, temperature, top_p } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Field "message" (string) is required',
      });
    }

    const payload = {
      model: 'sarvam-m',
      messages: [
        {
          role: 'system',
          content:
            systemPrompt ||
            'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: max_tokens || 1000,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
      reasoning_effort: 'high',
    };
    if (typeof top_p === 'number') payload.top_p = top_p;

    const response = await fetch(SARVAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Sarvam API error',
        status: response.status,
        data,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('LLM chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while calling Sarvam AI',
      error: error.message,
    });
  }
};

// POST /api/llm/chat-completions - Sarvam AI (OpenAI-compatible response for Agent LLM page)
export const chatCompletions = async (req, res) => {
  try {
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Sarvam API key is not configured (SARVAM_API_KEY)',
      });
    }

    const { prompt, messages: reqMessages, model, temperature, reasoning_effort, stream } = req.body;

    const hasPrompt = typeof prompt === 'string' && prompt.trim();
    const hasMessages = Array.isArray(reqMessages) && reqMessages.length > 0;

    if (!hasPrompt && !hasMessages) {
      return res.status(400).json({
        success: false,
        message: 'Either "prompt" (string) or "messages" (array) is required',
      });
    }

    let messages;
    if (hasMessages) {
      messages = reqMessages;
    } else {
      messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt.trim() },
      ];
    }

    const payload = {
      model: model || 'sarvam-m',
      messages,
      temperature: typeof temperature === 'number' ? temperature : 0.7,
      reasoning_effort: reasoning_effort || 'high',
      stream: stream === true,
    };

    const response = await fetch(SARVAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const errBody = isJson ? await response.json().catch(() => ({})) : await response.text();
      return res.status(response.status).json({
        success: false,
        message: 'Sarvam API error',
        status: response.status,
        data: errBody,
      });
    }

    if (payload.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();
      if (response.body) {
        response.body.pipe(res);
      } else {
        res.end();
      }
      return;
    }

    const data = await response.json().catch(() => null);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Sarvam chat-completions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while calling Sarvam AI',
      error: error.message,
    });
  }
};


