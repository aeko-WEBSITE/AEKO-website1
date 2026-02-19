import fetch from 'node-fetch';

const MODELSLAB_TEXT2IMG = 'https://modelslab.com/api/v6/images/text2img';

function getModelsLabKey() {
  const k = process.env.MODELSLAB_API_KEY;
  return typeof k === 'string' ? k.trim() : '';
}

/**
 * POST /api/image/text2img
 * ModelsLab text-to-image. Same integration style as videoController.
 * Body: { prompt, model_id?, width?, height?, negative_prompt? }.
 * Returns ModelsLab response: { status, output: [url], ... } or { error }.
 */
export const text2img = async (req, res) => {
  try {
    const key = getModelsLabKey();
    if (!key) {
      return res.status(500).json({ error: 'MODELSLAB_API_KEY not configured' });
    }

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
    } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' });
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
      const msg = data?.message || data?.error || data?.msg || 'Image generation failed';
      console.error('ModelsLab text2img error:', response.status, data);
      return res.status(response.status >= 400 ? response.status : 502).json({
        error: typeof msg === 'string' ? msg : 'Image generation failed',
      });
    }

    if (data.status === 'processing') {
      return res.status(502).json({
        error: 'Image is still generating. Please try again in a few seconds.',
      });
    }

    const output = data.output || data.proxy_links;
    const imageUrl = Array.isArray(output) && output[0] ? output[0] : null;
    if (!imageUrl) {
      const msg = data?.message || data?.error || data?.msg || 'No image in response';
      return res.status(502).json({ error: typeof msg === 'string' ? msg : 'Image generation failed' });
    }

    return res.json({
      status: 'success',
      output: data.output || [],
      proxy_links: data.proxy_links || [],
      image_url: imageUrl,
      generationTime: data.generationTime,
      id: data.id,
    });
  } catch (error) {
    const message = error?.message || 'Image generation failed';
    console.error('Image text2img error:', error);
    return res.status(500).json({ error: message });
  }
};
