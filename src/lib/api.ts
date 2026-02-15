// API Base URL configuration
// In dev: use '' so Vite proxy (vite.config proxy /api -> localhost:5000) is used for crawl/auth/llm.
// Otherwise: VITE_API_URL if set, else demo server.
const getApiBaseUrl = (): string => {
  const env = import.meta.env;
  if (env.VITE_API_URL !== undefined && env.VITE_API_URL !== '') {
    return env.VITE_API_URL;
  }
  if (import.meta.env.DEV) {
    return ''; // same-origin so Vite proxies /api to backend (e.g. port 5000)
  }
 
};

const API_BASE_URL = getApiBaseUrl();

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Get refresh token from localStorage
const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
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
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      });

      // Accept both 200 and 201 status codes for registration
      if (!response.ok && response.status !== 201) {
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
   * Login with email/username and password
   * POST /auth/login
   * @param identifier - Email or username
   * @param password - User password
   * @returns Promise with accessToken, refreshToken, tokenType, and user data
   */
  login: async (identifier: string, password: string) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
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
   * Logout current device/session
   * POST /auth/logout
   * @returns Promise
   */
  logout: async () => {
    try {
      const response = await apiRequest('/auth/logout', {
        method: 'POST',
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

// LLM API
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
   * @param data - Request payload with prompt, model, and stream flag
   * @returns Promise with chat completion response
   */
  chatCompletions: async (data: {
    prompt: string;
    model: string;
    stream?: boolean;
  }) => {
    try {
      const response = await apiRequest('/apimodule/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          prompt: data.prompt,
          model: data.model,
          stream: data.stream ?? false,
        }),
      });

      // Accept both 200 and 201 status codes
      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
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
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/apimodule/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: data.prompt,
          model: data.model,
          stream: true,
        }),
        mode: 'cors',
        credentials: 'omit',
      });

      // Accept both 200 and 201 status codes
      if (!response.ok && response.status !== 201) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
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
      const response = await apiRequest('/apimodule/v1/image-gen', {
        method: 'POST',
        body: JSON.stringify({
          prompt: data.prompt,
          model_id: data.model_id,
          width: data.width || 512,
          height: data.height || 512,
        }),
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

      const response = await fetch(`${API_BASE_URL}/apimodule/v1/image-to-image`, {
        method: 'POST',
        headers,
        body: formData,
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
   * Fetch Result by ID
   * GET /apimodule/v1/fetch-result/{id}
   * @param id - Result ID to fetch
   * @returns Promise with base64 image data
   */
  fetchResult: async (id: string) => {
    try {
      const response = await apiRequest(`/apimodule/v1/fetch-result/${id}`, {
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
   * Fetch Image Result by ID
   * GET /apimodule/v1/fetch-image-result/{id}
   * @param id - Result ID to fetch
   * @returns Promise with base64 image data
   */
  fetchImageResult: async (id: string) => {
    try {
      const response = await apiRequest(`/apimodule/v1/fetch-image-result/${id}`, {
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

      const response = await fetch(`${API_BASE_URL}/apimodule/v1/background-removal`, {
        method: 'POST',
        headers,
        body: formData,
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
   * @param email - Admin email
   * @param password - Admin password
   * @returns Promise with accessToken, refreshToken, and admin data
   */
  login: async (email: string, password: string) => {
    try {
      const response = await apiRequest('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
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
      const response = await apiRequest('/api/configs', {
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
      const response = await apiRequest(`/api/configs/${key}`, {
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
      const response = await apiRequest('/api/configs', {
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
      const response = await apiRequest(`/api/configs/${key}`, {
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
      const response = await apiRequest(`/api/configs/${key}`, {
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
      const response = await apiRequest('/api/wallet/admin/action', {
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

  /**
   * Get wallet balance for any user (Admin)
   * GET /api/wallet/admin/balance/{userId}
   * @param userId - User ID
   * @returns Promise with wallet balance
   */
  getWalletBalance: async (userId: string) => {
    try {
      const response = await apiRequest(`/api/wallet/admin/balance/${userId}`, {
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