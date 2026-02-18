import fetch from 'node-fetch';

const MODELSLAB_TEXT2VIDEO = 'https://modelslab.com/api/v6/video/text2video';
const MODELSLAB_FETCH = 'https://modelslab.com/api/v6/video/fetch';

/**
 * POST /api/video/generate-video
 * Start ModelsLab text2video job. Returns request_id for polling.
 */
export const generateVideo = async (req, res) => {
  try {
    const key = process.env.MODELSLAB_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'MODELSLAB_API_KEY not configured' });
    }

    const { prompt, negative_prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const response = await fetch(MODELSLAB_TEXT2VIDEO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        model_id: 'wanx',
        prompt: prompt.trim(),
        negative_prompt: negative_prompt || '',
        height: 512,
        width: 512,
        num_frames: 25,
        fps: 15,
        output_type: 'mp4',
        instant_response: false,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = data?.message || data?.error || data?.msg || 'Video generation failed';
      console.error('ModelsLab text2video error:', response.status, data);
      return res.status(500).json({ error: typeof msg === 'string' ? msg : 'Video generation failed' });
    }

    return res.json(data);
  } catch (error) {
    const message = error?.message || 'Video generation failed';
    console.error('Video generate error:', error);
    return res.status(500).json({ error: message });
  }
};

/**
 * POST /api/video/video-status
 * Poll ModelsLab for job result. Returns status and output (video URL) when success.
 */
export const getVideoStatus = async (req, res) => {
  try {
    const key = process.env.MODELSLAB_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'MODELSLAB_API_KEY not configured' });
    }

    const { request_id } = req.body;
    if (!request_id) {
      return res.status(400).json({ error: 'request_id is required' });
    }

    const response = await fetch(MODELSLAB_FETCH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, request_id }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = data?.message || data?.error || data?.msg || 'Status check failed';
      console.error('ModelsLab fetch error:', response.status, data);
      return res.status(500).json({ error: typeof msg === 'string' ? msg : 'Status check failed' });
    }

    return res.json(data);
  } catch (error) {
    const message = error?.message || 'Status check failed';
    console.error('Video status error:', error);
    return res.status(500).json({ error: message });
  }
};
