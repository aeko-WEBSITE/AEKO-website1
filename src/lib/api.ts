// API Base URL configuration
// In dev: use '' so Vite proxy (vite.config proxy /api -> localhost:5000) is used.
// In production: VITE_API_URL if set, else defaults to https://demo.liquidata.dev for auth
const getApiBaseUrl = (): string => {
  const env = import.meta.env;
  if (env.VITE_API_URL !== undefined && env.VITE_API_URL !== '') {
    // Remove trailing slash if present
    const url = env.VITE_API_URL.trim().replace(/\/$/, '');
    return url;
  }
  // In development, empty string uses Vite proxy
  // In production, default to demo.liquidata.dev for auth endpoints
  if (import.meta.env.PROD) {
    return 'https://demo.liquidata.dev';
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();

// Apimodule Base URL configuration (can be different from main API)
// This is ONLY for apimodule endpoints (image gen, video gen, etc.), NOT for auth
const getApimoduleBaseUrl = (): string => {
  const env = import.meta.env;
  if (env.VITE_APIMODULE_URL !== undefined && env.VITE_APIMODULE_URL !== '') {
    return env.VITE_APIMODULE_URL;
  }
  // Only default to demo server for apimodule endpoints, not for auth
  // Auth endpoints should use API_BASE_URL which uses VITE_API_URL or same-origin
  return 'https://demo.liquidata.dev';
};

const APIMODULE_BASE_URL = getApimoduleBaseUrl();

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Get admin auth token from localStorage
const getAdminAuthToken = (): string | null => {
  return localStorage.getItem('adminAccessToken');
};

// Get refresh token from localStorage
const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// Helper to refresh token (used internally, doesn't use apiRequest to avoid circular calls)
const refreshTokenInternal = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    // Use /api/auth/refresh when using same-origin in dev, otherwise use /auth/refresh
    const refreshEndpoint = (!API_BASE_URL && !import.meta.env.PROD) ? '/api/auth/refresh' : '/auth/refresh';
    const response = await fetch(`${API_BASE_URL}${refreshEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({ refreshToken }),
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// API request helper with automatic token refresh on 401
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  retryOn401: boolean = true
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If API_BASE_URL is empty (same-origin in dev) and endpoint doesn't start with /api, add /api prefix
  // This ensures auth endpoints work with Vite proxy in development
  let fullEndpoint = endpoint;
  if (!API_BASE_URL && !endpoint.startsWith('/api') && !import.meta.env.PROD) {
    fullEndpoint = `/api${endpoint}`;
  }

  let response = await fetch(`${API_BASE_URL}${fullEndpoint}`, {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'omit',
  });

  // If 401 and retry is enabled, try to refresh token and retry once
  // Check both with and without /api prefix
  const isAuthEndpoint = endpoint === '/auth/refresh' || endpoint === '/auth/login' || endpoint === '/auth/register' ||
                         endpoint === '/api/auth/refresh' || endpoint === '/api/auth/login' || endpoint === '/api/auth/register';
  if (response.status === 401 && retryOn401 && !isAuthEndpoint) {
    const refreshed = await refreshTokenInternal();
    if (refreshed) {
      // Retry the request with new token
      const newToken = getAuthToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          mode: 'cors',
          credentials: 'omit',
        });
      }
    }
  }

  return response;
};

// Admin API request helper (uses admin token)
const adminApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAdminAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'omit',
  });

  return response;
};

// Auth API
export const authAPI = {
  /**
   * Register a new user
   * POST /auth/register
   * @param email - User email
   * @param username - Username
   * @param password - User password
   * @returns Promise with accessToken, refreshToken, tokenType, and user data
   */
  register: async (email: string, username: string, password: string) => {
    try {
      // Backend expects: { username, email, password } (not name)
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      // Accept both 200 and 201 status codes for registration
      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        // Handle validation errors array
        if (Array.isArray(errorData.message)) {
          const errorMessage = errorData.message.join(", ");
          const error = new Error(errorMessage);
          (error as any).message = errorData.message; // Keep array for detailed handling
          throw error;
        }
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error: any) {
      // Handle network/fetch errors
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      // Re-throw the original error if it's already an Error instance
      if (error instanceof Error) {
        throw error;
      }
      // Handle other error types
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred during registration');
    }
  },

  /**
   * Login with email/username and password
   * POST /auth/login
   * @param identifier - Email or username
   * @param password - User password
   * @returns Promise with accessToken, refreshToken, tokenType, and user data
   */
  login: async (identifier: string, password: string) => {
    try {
      // Backend expects: { identifier, password } (not email)
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Handle validation errors array
        if (Array.isArray(errorData.message)) {
          const errorMessage = errorData.message.join(", ");
          const error = new Error(errorMessage);
          (error as any).message = errorData.message; // Keep array for detailed handling
          throw error;
        }
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Logout current device/session
   * POST /auth/logout
   * @returns Promise
   */
  logout: async () => {
    try {
      const response = await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({}), // Send empty JSON body to avoid "Body cannot be empty" error
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return response.json().catch(() => ({}));
    } catch (error: any) {
      // Clear local storage even if request fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Logout from all devices/sessions
   * POST /auth/logout-all
   * @returns Promise
   */
  logoutAll: async () => {
    try {
      const response = await apiRequest('/auth/logout-all', {
        method: 'POST',
        body: JSON.stringify({}), // Send empty JSON body to avoid "Body cannot be empty" error
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return response.json().catch(() => ({}));
    } catch (error: any) {
      // Clear local storage even if request fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Get current user from localStorage
   * @returns User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  /**
   * Initiate Google OAuth login
   * GET /auth/google
   * @returns Promise with redirectUrl
   */
  googleLogin: async () => {
    try {
      const response = await apiRequest('/auth/google', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      // If redirectUrl is provided, redirect the user
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Google OAuth callback handler
   * GET /auth/google/callback
   * This is typically called by the OAuth provider after authentication
   * @returns Promise with accessToken, refreshToken, tokenType, and user data
   */
  googleCallback: async () => {
    try {
      const response = await apiRequest('/auth/google/callback', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Refresh access token using refresh token
   * POST /auth/refresh
   * @param refreshToken - Optional refresh token (uses stored token if not provided)
   * @returns Promise with new accessToken, refreshToken, tokenType, and user data
   */
  refresh: async (refreshToken?: string) => {
    try {
      const token = refreshToken || getRefreshToken();
      if (!token) {
        throw new Error('No refresh token available');
      }

      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: token }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   * @param email - User email address
   * @returns Promise
   */
  forgotPassword: async (email: string) => {
    try {
      const response = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json().catch(() => ({}));
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Reset password using reset token
   * POST /auth/reset-password
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns Promise
   */
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json().catch(() => ({}));
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Get all active sessions/devices
   * GET /auth/sessions
   * @returns Promise with array of active sessions
   */
  getSessions: async () => {
    try {
      const response = await apiRequest('/auth/sessions', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },
};

// LLM API (Sarvam AI via backend)
export const llmAPI = {
  chat: async (
    message: string,
    options?: {
      systemPrompt?: string;
      max_tokens?: number;
      temperature?: number;
      top_p?: number;
    }
  ) => {
    try {
      const response = await apiRequest('/api/llm/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          ...options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors (backend not running, CORS, etc.)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running on port 5000.');
      }
      throw error;
    }
  },

  /** Sarvam AI chat completions (used by Agent LLM page). Returns OpenAI-compatible shape. */
  chatCompletions: async (data: {
    prompt: string;
    model?: string;
    temperature?: number;
    reasoning_effort?: string;
    stream?: boolean;
  }) => {
    try {
      const response = await apiRequest('/api/llm/chat-completions', {
        method: 'POST',
        body: JSON.stringify({
          prompt: data.prompt,
          model: data.model ?? 'sarvam-m',
          temperature: data.temperature ?? 0.7,
          reasoning_effort: data.reasoning_effort ?? 'high',
          stream: data.stream ?? false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running on port 5000.');
      }
      throw error;
    }
  },
};

// Sarvam chat – use main backend (same origin / proxy) so no separate server on 3000
const SARVAM_CHAT_BASE = (import.meta.env.VITE_SARVAM_CHAT_URL || '').trim();

/** WebSocket URL for voice agent. Only set if using a separate chat server. */
export const SARVAM_VOICE_WS_URL = SARVAM_CHAT_BASE ? SARVAM_CHAT_BASE.replace(/^http/, 'ws').replace(/\/$/, '') : '';

function stripThinkBlocks(text: string): string {
  if (typeof text !== 'string') return text;
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/<think>[\s\S]*/gi, '').trim();
}

export const sarvamChatAPI = {
  chat: async (messages: { role: string; content: string }[]) => {
    const response = await apiRequest('/api/llm/chat-completions', {
      method: 'POST',
      body: JSON.stringify({ messages, stream: false }),
    });
    const data = await response.json().catch(() => ({})) as {
      choices?: Array<{ message?: { content?: string } }>;
      message?: string;
    };
    if (!response.ok) {
      throw new Error((data as { message?: string }).message || `Server error: ${response.status}`);
    }
    let reply = data.choices?.[0]?.message?.content;
    if (reply === undefined) {
      throw new Error((data as { message?: string }).message || 'Invalid response from chat API');
    }
    return stripThinkBlocks(reply);
  },
};

// Video API (ModelsLab Text2Video - key on backend)
export const videoAPI = {
  generateVideo: async (body: { prompt: string; negative_prompt?: string }) => {
    const response = await apiRequest('/api/video/generate-video', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((data as { error?: string }).error || 'Video generation failed');
    return data as { request_id?: string; [k: string]: unknown };
  },
  getVideoStatus: async (request_id: string) => {
    const response = await apiRequest('/api/video/video-status', {
      method: 'POST',
      body: JSON.stringify({ request_id }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((data as { error?: string }).error || 'Status check failed');
    return data as { status?: string; output?: string[]; [k: string]: unknown };
  },
};

// Image API (backend text2img – z-image-turbo via ModelsLab)
export const imageAPI = {
  text2img: async (params: {
    prompt: string;
    model_id?: string;
    width?: number;
    height?: number;
    negative_prompt?: string;
  }) => {
    const response = await apiRequest('/api/image/text2img', {
      method: 'POST',
      body: JSON.stringify({
        prompt: params.prompt,
        model_id: params.model_id ?? 'z-image-turbo',
        width: params.width ?? 1024,
        height: params.height ?? 1024,
        negative_prompt: params.negative_prompt ?? '',
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error((data as { error?: string }).error || 'Image generation failed');
    return data as { status?: string; output?: string[]; proxy_links?: string[]; image_url?: string; [k: string]: unknown };
  },
};

// Crawl API
export const crawlAPI = {
  crawlWebsite: async (url: string) => {
    try {
      const response = await apiRequest('/api/crawl/website', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      return response.json();
    } catch (error: any) {
      // Handle network errors (backend not running, CORS, etc.)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running on port 5000.');
      }
      throw error;
    }
  },
};

// Module API - Professional implementation for apimodule endpoints
export const moduleAPI = {
  /**
   * Chat Completions (non-streaming)
   * POST /apimodule/v1/chat/completions
   * Request body: application/json
   * @param data - Request payload with prompt, model, and stream flag
   * @returns Promise with chat completion response
   */
  chatCompletions: async (data: {
    prompt: string;
    model: string;
    stream?: boolean;
  }) => {
    try {
      // Try without authentication first (apimodule might not require auth)
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      let response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: data.prompt,
          model: data.model,
          stream: data.stream ?? false,
        }),
        mode: 'cors',
        credentials: 'omit',
      });

      // If 401, try with authentication
      if (response.status === 401) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              prompt: data.prompt,
              model: data.model,
              stream: data.stream ?? false,
            }),
            mode: 'cors',
            credentials: 'omit',
          });
        }
      }

      // Accept both 200 and 201 status codes
      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message || errorData.error || `Server error: ${response.status}`
        );
      }

      // Check content type - API returns text/plain, not JSON
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        return response.json();
      } else {
        // Plain text response - return as string
        const text = await response.text();
        return text;
      }
    } catch (error: any) {
      // Handle CORS errors specifically
      if (error?.name === 'TypeError' && (error?.message?.includes('fetch') || error?.message?.includes('CORS'))) {
        throw new Error('CORS error: Cannot connect to API. The API server may not allow cross-origin requests from this domain.');
      }
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Chat Completions (streaming)
   * POST /apimodule/v1/chat/completions
   * @param data - Request payload with prompt, model
   * @param onChunk - Callback function called for each chunk of data
   * @returns Promise that resolves when stream completes
   */
  chatCompletionsStream: async (
    data: {
      prompt: string;
      model: string;
    },
    onChunk: (chunk: string) => void
  ) => {
    try {
      // Try without authentication first (apimodule might not require auth)
      const streamHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      };

      let response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/chat/completions`, {
        method: 'POST',
        headers: streamHeaders,
        body: JSON.stringify({
          prompt: data.prompt,
          model: data.model,
          stream: true,
        }),
        mode: 'cors',
        credentials: 'omit',
      });

      // If 401, try with authentication
      if (response.status === 401) {
        const token = getAuthToken();
        if (token) {
          streamHeaders['Authorization'] = `Bearer ${token}`;
          response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/chat/completions`, {
            method: 'POST',
            headers: streamHeaders,
            body: JSON.stringify({
              prompt: data.prompt,
              model: data.model,
              stream: true,
            }),
            mode: 'cors',
            credentials: 'omit',
          });
        }
      }

      // Accept both 200 and 201 status codes
      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message || errorData.error || `Server error: ${response.status}`
        );
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Check content type to determine response format
      const contentType = response.headers.get('content-type') || '';
      const isPlainText = contentType.includes('text/plain');

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        
        // For plain text streaming, send chunks directly as they arrive
        if (isPlainText) {
          if (chunk) {
            onChunk(chunk);
          }
        } else {
          // Handle SSE or JSON streaming format
          buffer += chunk;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            
            // Handle SSE format: data: {...}
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                continue;
              }
              
              try {
                const json = JSON.parse(dataStr);
                let content = '';
                if (json.choices && Array.isArray(json.choices) && json.choices[0]) {
                  content = json.choices[0].delta?.content || 
                            json.choices[0].message?.content || 
                            json.choices[0].text || 
                            json.choices[0].content || '';
                } else if (json.delta?.content) {
                  content = json.delta.content;
                } else if (json.content) {
                  content = json.content;
                } else if (json.text) {
                  content = json.text;
                } else if (typeof json === 'string') {
                  content = json;
                }
                
                if (content) {
                  onChunk(content);
                }
              } catch (e) {
                if (dataStr.trim()) {
                  onChunk(dataStr);
                }
              }
            } else if (line.trim()) {
              onChunk(line);
            }
          }
        }
      }

      // Process any remaining buffer (only for non-plain-text)
      if (!isPlainText && buffer.trim()) {
        try {
          const json = JSON.parse(buffer);
          let content = '';
          if (json.choices && Array.isArray(json.choices) && json.choices[0]) {
            content = json.choices[0].delta?.content || 
                      json.choices[0].message?.content || 
                      json.choices[0].text || 
                      json.choices[0].content || '';
          } else if (json.content) {
            content = json.content;
          }
          if (content) {
            onChunk(content);
          }
        } catch (e) {
          if (buffer.trim()) {
            onChunk(buffer);
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('CORS'))) {
        throw new Error('CORS error: Cannot connect to API. The API server may not allow cross-origin requests from this domain.');
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Image Generation (returns base64, no polling)
   * POST /apimodule/v1/image-gen
   * Note: API rejects properties in body, using query parameters instead
   * @param data - Request payload with prompt, model_id, width, and height
   * @returns Promise with base64 image data
   */
  imageGen: async (data: {
    prompt: string;
    model_id: string;
    width?: number;
    height?: number;
  }) => {
    try {
      const token = getAuthToken();
      
      // API rejects properties in body, use query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('prompt', data.prompt);
      queryParams.append('model_id', data.model_id);
      if (data.width !== undefined) queryParams.append('width', data.width.toString());
      if (data.height !== undefined) queryParams.append('height', data.height.toString());

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/image-gen?${queryParams.toString()}`, {
        method: 'POST',
        headers,
        body: null, // Empty body since all data is in query params
        mode: 'cors',
        credentials: 'omit',
      });

      // Accept 201 status code as per API docs
      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message || errorData.error || `Server error: ${response.status}`
        );
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Image to Image transformation
   * POST /apimodule/v1/image-to-image
   * @param data - Request payload with prompt, model_id, init_image (base64), strength, and file
   * @returns Promise with transformed image data
   */
  imageToImage: async (data: {
    prompt: string;
    model_id?: string;
    init_image?: string; // Base64 string
    strength?: number; // 0.0 to 1.0
    file?: File; // File upload
  }) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      
      // Required field
      formData.append('prompt', data.prompt);
      
      // Optional fields
      if (data.model_id) {
        formData.append('model_id', data.model_id);
      }
      
      if (data.init_image) {
        // init_image should be base64 string (without data:image/...;base64, prefix)
        const base64String = data.init_image.includes(',') 
          ? data.init_image.split(',')[1] 
          : data.init_image;
        formData.append('init_image', base64String);
      }
      
      if (data.strength !== undefined) {
        formData.append('strength', data.strength.toString());
      }
      
      if (data.file) {
        formData.append('file', data.file);
      }

      // Build headers without Content-Type for FormData (browser will set it with boundary)
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/image-to-image`, {
        method: 'POST',
        headers,
        body: formData,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Text to Video Generation
   * POST /apimodule/v1/text-to-video
   * Note: API rejects properties in body, using query parameters instead
   * @param data - Request payload with prompt and optional parameters
   * @returns Promise with video generation response (may include ID for polling or direct video URL)
   */
  textToVideo: async (data: {
    prompt: string;
    model_id?: string;
    num_frames?: number;
    width?: number;
    height?: number;
    num_inference_steps?: number;
    guidance_scale?: number;
    fps?: number;
  }) => {
    try {
      const token = getAuthToken();
      
      // API rejects properties in body, use query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('prompt', data.prompt);
      if (data.model_id !== undefined) queryParams.append('model_id', data.model_id);
      if (data.num_frames !== undefined) queryParams.append('num_frames', data.num_frames.toString());
      if (data.width !== undefined) queryParams.append('width', data.width.toString());
      if (data.height !== undefined) queryParams.append('height', data.height.toString());
      if (data.num_inference_steps !== undefined) queryParams.append('num_inference_steps', data.num_inference_steps.toString());
      if (data.guidance_scale !== undefined) queryParams.append('guidance_scale', data.guidance_scale.toString());
      if (data.fps !== undefined) queryParams.append('fps', data.fps.toString());

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/text-to-video?${queryParams.toString()}`, {
        method: 'POST',
        headers,
        body: null, // Empty body since all data is in query params
        mode: 'cors',
        credentials: 'omit',
      });

      // Accept 201 status code as per API docs
      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message || errorData.error || `Server error: ${response.status}`
        );
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Fetch Result by ID
   * GET /apimodule/v1/fetch-result/{id}
   * @param id - Result ID to fetch
   * @returns Promise with base64 image data
   */
  fetchResult: async (id: string) => {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/fetch-result/${id}`, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Fetch Image Result by ID
   * GET /apimodule/v1/fetch-image-result/{id}
   * @param id - Result ID to fetch
   * @returns Promise with base64 image data
   */
  fetchImageResult: async (id: string) => {
    try {
      // Try without authentication first (apimodule might not require auth)
      const headers: HeadersInit = {};

      let response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/fetch-image-result/${id}`, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'omit',
      });

      // If 401, try with authentication
      if (response.status === 401) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/fetch-image-result/${id}`, {
            method: 'GET',
            headers,
            mode: 'cors',
            credentials: 'omit',
          });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message || errorData.error || `Server error: ${response.status}`
        );
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Background Removal
   * POST /apimodule/v1/background-removal
   * @param data - Request payload with file or init_image (base64)
   * @returns Promise with base64 image data (transparent background)
   */
  backgroundRemoval: async (data: {
    file?: File;
    init_image?: string; // Base64 string
  }) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      
      if (data.file) {
        formData.append('file', data.file);
      }
      
      if (data.init_image) {
        // init_image should be base64 string (without data:image/...;base64, prefix)
        const base64String = data.init_image.includes(',') 
          ? data.init_image.split(',')[1] 
          : data.init_image;
        formData.append('init_image', base64String);
      }

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${APIMODULE_BASE_URL}/apimodule/v1/background-removal`, {
        method: 'POST',
        headers,
        body: formData,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },
};

// Profile API
export const profileAPI = {
  /**
   * Get my profile
   * GET /api/profile/me
   * @returns Promise with user profile data
   */
  getProfile: async () => {
    try {
      const response = await apiRequest('/api/profile/me', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Change my password
   * POST /api/profile/change-password
   * @param currentPassword - Current password
   * @param newPassword - New password (must be ≥ 6 characters)
   * @returns Promise with success message
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiRequest('/api/profile/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Get my wallet balance
   * GET /api/profile/wallet/balance
   * @returns Promise with wallet balance
   */
  getWalletBalance: async () => {
    try {
      const response = await apiRequest('/api/profile/wallet/balance', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Get my wallet transaction history
   * GET /api/profile/wallet/history
   * @param params - Query parameters (page, limit, type, fromDate, toDate, sortOrder)
   * @returns Promise with transaction history
   */
  getWalletHistory: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    fromDate?: string;
    toDate?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params?.toDate) queryParams.append('toDate', params.toDate);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = `/api/profile/wallet/history${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },
};

// Admin API
export const adminAPI = {
  /**
   * Admin login
   * POST /admin/auth/login
   * @param identifier - Admin identifier (username or email - backend accepts both)
   * @param password - Admin password
   * @returns Promise with accessToken, refreshToken, and admin data
   */
  login: async (identifier: string, password: string) => {
    try {
      // Admin login doesn't need token, use regular fetch
      // Use /api/admin/auth/login when using same-origin in dev, otherwise use /admin/auth/login
      const adminLoginEndpoint = (!API_BASE_URL && !import.meta.env.PROD) ? '/api/admin/auth/login' : '/admin/auth/login';
      const response = await fetch(`${API_BASE_URL}${adminLoginEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message || errorData.error || `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem('adminAccessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('adminRefreshToken', data.refreshToken);
        }
        if (data.admin) {
          localStorage.setItem('admin', JSON.stringify(data.admin));
        }
      }
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Get all configurations (Admin)
   * GET /api/configs
   * @returns Promise with all configurations
   */
  getConfigs: async () => {
    try {
      const response = await adminApiRequest('/api/configs', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Get a config value by key (any authenticated user)
   * GET /api/configs/{key}
   * @param key - Config key
   * @returns Promise with config value
   */
  getConfig: async (key: string) => {
    try {
      const response = await adminApiRequest(`/api/configs/${key}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Create a configuration (Admin)
   * POST /api/configs
   * @param key - Config key
   * @param value - Config value
   * @returns Promise with created config
   */
  createConfig: async (key: string, value: any) => {
    try {
      const response = await adminApiRequest('/api/configs', {
        method: 'POST',
        body: JSON.stringify({ key, value }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Update a configuration (Admin)
   * PATCH /api/configs/{key}
   * @param key - Config key
   * @param value - New config value
   * @returns Promise with updated config
   */
  updateConfig: async (key: string, value: any) => {
    try {
      const response = await adminApiRequest(`/api/configs/${key}`, {
        method: 'PATCH',
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Delete a configuration (Admin)
   * DELETE /api/configs/{key}
   * @param key - Config key
   * @returns Promise with success message
   */
  deleteConfig: async (key: string) => {
    try {
      const response = await adminApiRequest(`/api/configs/${key}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Credit or Debit user wallet (Admin)
   * POST /api/wallet/admin/action
   * @param userId - User ID
   * @param amount - Amount to credit/debit
   * @param action - 'credit' or 'debit'
   * @param remark - Transaction remark
   * @param metadata - Optional metadata object
   * @returns Promise with transaction result
   */
  walletAction: async (data: {
    userId: string;
    amount: number;
    action: 'credit' | 'debit';
    remark: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const response = await adminApiRequest('/api/wallet/admin/action', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Get wallet history for any user (Admin)
   * GET /api/wallet/admin/history/{userId}
   * @param userId - User ID
   * @param params - Query parameters (page, limit, type, fromDate, toDate, sortOrder)
   * @returns Promise with transaction history
   */
  getWalletHistory: async (userId: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    fromDate?: string;
    toDate?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params?.toDate) queryParams.append('toDate', params.toDate);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const queryString = queryParams.toString();
      const endpoint = `/api/wallet/admin/history/${userId}${queryString ? `?${queryString}` : ''}`;

      const response = await adminApiRequest(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Get wallet balance for any user (Admin)
   * GET /api/wallet/admin/balance/{userId}
   * @param userId - User ID
   * @returns Promise with wallet balance
   */
  getWalletBalance: async (userId: string) => {
    try {
      const response = await adminApiRequest(`/api/wallet/admin/balance/${userId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Create a package (Admin)
   * POST /api/packages
   * @param data - Package data
   * @returns Promise with created package
   */
  createPackage: async (data: {
    name: string;
    description?: string;
    price: number;
    credits: number;
    features?: string[];
    duration?: number;
    isActive?: boolean;
  }) => {
    try {
      const response = await adminApiRequest('/api/packages', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Update a package (Admin)
   * PATCH /api/packages/{id}
   * @param id - Package ID
   * @param data - Updated package data
   * @returns Promise with updated package
   */
  updatePackage: async (id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    credits: number;
    features: string[];
    duration: number;
    isActive: boolean;
  }>) => {
    try {
      const response = await adminApiRequest(`/api/packages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Delete a package (Admin)
   * DELETE /api/packages/{id}
   * @param id - Package ID
   * @returns Promise with success message
   */
  deletePackage: async (id: string) => {
    try {
      const response = await adminApiRequest(`/api/packages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * List ALL packages including inactive (Admin)
   * GET /api/packages/admin/all
   * @returns Promise with all packages
   */
  getAllPackages: async () => {
    try {
      const response = await adminApiRequest('/api/packages/admin/all', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },
};

// Package API (Public)
export const packageAPI = {
  /**
   * List all active packages (Public)
   * GET /api/packages
   * @returns Promise with array of active packages
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/packages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Get a package by ID (Public)
   * GET /api/packages/{id}
   * @param id - Package ID
   * @returns Promise with package data
   */
  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },
};

// Admin Users API
export const adminUsersAPI = {
  /**
   * Search user by email (Admin)
   * GET /api/admin/users/search
   * @param email - Email to search
   * @returns Promise with user data
   */
  search: async (email: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/search?email=${encodeURIComponent(email)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Get all users (Admin)
   * GET /api/admin/users
   * @param params - Query parameters (page, limit, search)
   * @returns Promise with users list
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      const endpoint = `/api/admin/users${queryString ? `?${queryString}` : ''}`;

      const response = await adminApiRequest(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Create a new user (Admin)
   * POST /api/admin/users
   * @param data - User data
   * @returns Promise with created user
   */
  create: async (data: {
    email: string;
    username: string;
    password: string;
    role?: string;
  }) => {
    try {
      const response = await adminApiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Get user by ID (Admin)
   * GET /api/admin/users/{id}
   * @param id - User ID
   * @returns Promise with user data
   */
  getById: async (id: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/${id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Delete a user (Admin)
   * DELETE /api/admin/users/{id}
   * @param id - User ID
   * @returns Promise with success message
   */
  delete: async (id: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Partially update a user (Admin)
   * PATCH /api/admin/users/{id}
   * @param id - User ID
   * @param data - Updated user data
   * @returns Promise with updated user
   */
  update: async (id: string, data: Partial<{
    email: string;
    username: string;
    role: string;
    isBanned: boolean;
  }>) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Ban a user (Admin)
   * PUT /api/admin/users/{id}/ban
   * @param id - User ID
   * @returns Promise with success message
   */
  ban: async (id: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/${id}/ban`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Unban a user (Admin)
   * PUT /api/admin/users/{id}/unban
   * @param id - User ID
   * @returns Promise with success message
   */
  unban: async (id: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/${id}/unban`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Force-reset a user's password (Admin)
   * PATCH /api/admin/users/{id}/password
   * @param id - User ID
   * @param newPassword - New password
   * @returns Promise with success message
   */
  resetPassword: async (id: string, newPassword: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/${id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Make user an admin (Admin)
   * POST /api/admin/users/{userId}/make-admin
   * @param userId - User ID
   * @returns Promise with success message
   */
  makeAdmin: async (userId: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/users/${userId}/make-admin`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },
};

// Admin Tokens API
export const adminTokensAPI = {
  /**
   * Get all active tokens (Admin Only)
   * GET /api/admin/tokens
   * @returns Promise with all active tokens
   */
  getAll: async () => {
    try {
      const response = await adminApiRequest('/api/admin/tokens', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Revoke a specific token (Admin Only)
   * DELETE /api/admin/tokens/{tokenId}
   * @param tokenId - Token ID
   * @returns Promise with success message
   */
  revoke: async (tokenId: string) => {
    try {
      const response = await adminApiRequest(`/api/admin/tokens/${tokenId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },
};

// Payment API
export const paymentAPI = {
  /**
   * Create a Razorpay order for a package
   * POST /api/payment/create-order
   * @param packageId - Package ID
   * @returns Promise with Razorpay order details
   */
  createOrder: async (packageId: string) => {
    try {
      const response = await apiRequest('/api/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Verify payment after Razorpay popup completes
   * POST /api/payment/verify
   * @param data - Payment verification data
   * @returns Promise with verification result
   */
  verify: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      // Convert to camelCase for backend
      const requestData = {
        razorpayOrderId: data.razorpay_order_id,
        razorpayPaymentId: data.razorpay_payment_id,
        razorpaySignature: data.razorpay_signature,
      };
      const response = await apiRequest('/api/payment/verify', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Get my payment history
   * GET /api/payment/history
   * @param params - Query parameters (page, limit)
   * @returns Promise with payment history
   */
  getHistory: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = `/api/payment/history${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },
};