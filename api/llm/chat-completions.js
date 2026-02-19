const SARVAM_API_URL = 'https://api.sarvam.ai/v1/chat/completions';

function stripThinkBlocks(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<think>[\s\S]*/gi, '').trim();
}

const AGENT_SYSTEM_PROMPT = `You are AEKO AI, a capable and professional AI assistant. Respond like a top-tier global assistant (e.g. GPT-level): clear, helpful, concise, and appropriate for any user worldwide.

Rules:
- Be direct and natural. Do not expose internal reasoning, <think> blocks, or meta-commentary to the user.
- Answer in the same language the user uses unless they ask otherwise.
- Be helpful for general knowledge, coding, writing, analysis, and casual conversation.
- Keep responses focused. Use short paragraphs or lists when it helps.
- If you are unsure, say so briefly and offer to clarify.
- Do not repeat the user's message back at length; get to the point.`;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return jsonResponse({ success: false, message: 'Method not allowed' }, 405);
    }

    try {
      const apiKey = process.env.SARVAM_API_KEY;
      if (!apiKey) {
        return jsonResponse({
          success: false,
          message: 'Sarvam API key is not configured (SARVAM_API_KEY). Add it in Vercel project Environment Variables.',
        }, 500);
      }

      const body = await request.json().catch(() => ({}));
      const { prompt, messages: reqMessages, model, temperature, reasoning_effort, stream } = body;

      const hasPrompt = typeof prompt === 'string' && prompt.trim();
      const hasMessages = Array.isArray(reqMessages) && reqMessages.length > 0;

      if (!hasPrompt && !hasMessages) {
        return jsonResponse({
          success: false,
          message: 'Either "prompt" (string) or "messages" (array) is required',
        }, 400);
      }

      let messages;
      if (hasMessages) {
        const rest = reqMessages.filter((m) => m.role !== 'system');
        messages = [{ role: 'system', content: AGENT_SYSTEM_PROMPT }, ...rest];
      } else {
        messages = [
          { role: 'system', content: AGENT_SYSTEM_PROMPT },
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
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (!response.ok) {
        const errBody = isJson ? await response.json().catch(() => ({})) : await response.text();
        return jsonResponse({
          success: false,
          message: 'Sarvam API error',
          status: response.status,
          data: errBody,
        }, response.status);
      }

      if (payload.stream) {
        return new Response(response.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        });
      }

      const data = await response.json().catch(() => null);
      if (data?.choices?.[0]?.message?.content) {
        data.choices[0].message.content = stripThinkBlocks(data.choices[0].message.content);
      }
      return jsonResponse(data, 200);
    } catch (error) {
      console.error('chat-completions error:', error);
      return jsonResponse({
        success: false,
        message: 'Server error while calling Sarvam AI',
        error: error?.message || 'Unknown error',
      }, 500);
    }
  },
};
