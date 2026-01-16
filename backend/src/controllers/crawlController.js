import fetch from 'node-fetch';

// POST /api/crawl/website
export const crawlWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    // Validate URL format
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format',
      });
    }

    // Extract main domain (remove path, query, hash)
    const mainDomain = `${validUrl.protocol}//${validUrl.hostname}`;

    // Fetch the website with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    let response;
    try {
      response = await fetch(mainDomain, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return res.status(408).json({
          success: false,
          message: 'Request timeout - website took too long to respond',
        });
      }
      throw error;
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `Failed to fetch website: ${response.statusText}`,
      });
    }

    const html = await response.text();

    // Extract basic information
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    // Extract favicon
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i);
    let favicon = faviconMatch ? faviconMatch[1] : null;
    if (favicon && !favicon.startsWith('http')) {
      favicon = new URL(favicon, mainDomain).href;
    } else if (!favicon) {
      favicon = new URL('/favicon.ico', mainDomain).href;
    }

    // Extract logo (try common patterns)
    const logoMatch = html.match(/<img[^>]*class=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i) ||
                     html.match(/<img[^>]*src=["']([^"']*logo[^"']*)["']/i);
    let logo = logoMatch ? logoMatch[1] : null;
    if (logo && !logo.startsWith('http')) {
      logo = new URL(logo, mainDomain).href;
    }

    return res.status(200).json({
      success: true,
      data: {
        url: mainDomain,
        title,
        description,
        favicon,
        logo,
        crawledAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Crawl error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to crawl website',
    });
  }
};
