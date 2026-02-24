const MODELSLAB_TEXT2IMG = 'https://modelslab.com/api/v6/images/text2img';

// On Vercel: set MODELSLAB_API_KEY in Project Settings → Environment Variables.

function getModelsLabKey() {
  const k = process.env.MODELSLAB_API_KEY;
  return typeof k === 'string' ? k.trim() : '';
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
      const key = getModelsLabKey();
      if (!key) {
        return jsonResponse(
          { error: 'MODELSLAB_API_KEY not configured. Add it in Vercel project Environment Variables.' },
          500
        );
      }

      const body = await request.json().catch(() => ({}));
      const {
        prompt,
        model_id = 'z-image-turbo',
        negative_prompt = '',
        width = 512,
        height = 512,
        samples = 1,
        num_inference_steps = 31,
        guidance_scale = 7.5,
        seed,
        base64 = false,
      } = body;

      if (!prompt || typeof prompt !== 'string') {
        return jsonResponse({ error: 'prompt is required' }, 400);
      }

      const payload = {
        key,
        prompt: prompt.trim(),
        model_id: String(model_id),
        negative_prompt: String(negative_prompt || ''),
        enhance_prompt: 'yes',
        width: Number(width) || 512,
        height: Number(height) || 512,
        samples: Number(samples) || 1,
        num_inference_steps: Number(num_inference_steps) || 31,
        safety_checker: false,
        safety_checker_type: 'sensitive_content_text',
        seed: seed != null ? Number(seed) : Math.floor(Math.random() * 1e9),
        guidance_scale: Number(guidance_scale) || 7.5,
        use_karras_sigmas: true,
        algorithm_type: 'none',
        clip_skip: 2,
        base64: Boolean(base64),
        temp: false,
        scheduler: 'DDPMScheduler',
        multi_lingual: false,
        upscale: false,
        highres_fix: false,
      };

      const response = await fetch(MODELSLAB_TEXT2IMG, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = data?.message || data?.error || data?.msg || data?.detail || 'Image generation failed';
        const errMsg = typeof msg === 'string' ? msg : (Array.isArray(msg) ? msg.join(' ') : 'Image generation failed');
        return jsonResponse(
          { error: errMsg, status: response.status },
          response.status >= 400 ? response.status : 502
        );
      }

      if (data.status === 'processing') {
        return jsonResponse(
          { error: 'Image is still generating. Please try again in a few seconds.' },
          502
        );
      }

      const output = data.output || data.proxy_links;
      const imageUrl = Array.isArray(output) && output[0] ? output[0] : null;
      if (!imageUrl) {
        const msg = data?.message || data?.error || data?.msg || 'No image in response';
        return jsonResponse(
          { error: typeof msg === 'string' ? msg : 'Image generation failed' },
          502
        );
      }

      return jsonResponse({
        status: 'success',
        output: data.output || [],
        proxy_links: data.proxy_links || [],
        image_url: imageUrl,
        generationTime: data.generationTime,
        id: data.id,
      });
    } catch (error) {
      console.error('text2img error:', error);
      const msg = error?.message || '';
      const isTimeout = /timeout|ETIMEDOUT|timed out/i.test(msg);
      return jsonResponse(
        {
          error: isTimeout
            ? 'Image generation timed out. Try again or use a shorter prompt.'
            : (msg || 'Image generation failed'),
        },
        500
      );
    }
  },
};
