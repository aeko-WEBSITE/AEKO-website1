// API Base URL configuration
// Priority: VITE_API_URL env variable > https://demo.liquidata.dev/ > localhost:5000
const getApiBaseUrl = (): string => {
  const env = import.meta.env;
  if (env.VITE_API_URL) {
    return env.VITE_API_URL;
  }
  // Default to demo server
  return 'https://demo.liquidata.dev';
};

const API_BASE_URL = getApiBaseUrl();

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
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
  register: async (name: string, email: string, password: string) => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (data.success && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  googleLogin: async (credential: string) => {
    const response = await apiRequest('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    const data = await response.json();
    if (data.success && data.data.token) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
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
   * @param category - Optional category filter
   * @returns Promise with all configurations or filtered by category
   */
  getConfigs: async (category?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (category) {
        queryParams.append('category', category);
      }
      const queryString = queryParams.toString();
      const endpoint = `/api/configs${queryString ? `?${queryString}` : ''}`;

      const response = await adminApiRequest(endpoint, {
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
   * Returns the configuration value for the given key. Requires a valid JWT but does NOT require admin role.
   * Security: If the key does not exist, returns an empty object {} — the API will NOT tell you whether a key exists or not.
   * @param key - Config key to look up (e.g. SMTP_HOST, FEATURE_FLAGS)
   * @returns Promise with config value or empty object {} if key not found
   */
  getConfig: async (key: string) => {
    try {
      // Use apiRequest (not adminApiRequest) since any authenticated user can access this
      const response = await apiRequest(`/api/configs/${key}`, {
        method: 'GET',
      });

      // 200 status means success (even if key doesn't exist, returns {})
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
   * Create a new config key-value pair. Admin-only.
   * @param data - Configuration data with key, category, description, valueType, and value
   * @returns Promise with created config (201 status)
   */
  createConfig: async (data: {
    key: string;
    category?: string;
    description?: string;
    valueType: 'string' | 'number' | 'boolean' | 'object' | 'array';
    value: any;
  }) => {
    try {
      const response = await adminApiRequest('/api/configs', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Accept both 200 and 201 status codes
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Update a configuration (Admin)
   * PATCH /api/configs/{key}
   * Partially update a config by key. Only the fields you send will be changed — uses PATCH, not PUT.
   * @param key - Config key to update
   * @param data - Partial config data to update (only fields you send will be changed)
   * @returns Promise with updated config
   */
  updateConfig: async (key: string, data: {
    category?: string;
    description?: string;
    valueType?: 'string' | 'number' | 'boolean' | 'object' | 'array';
    value?: any;
  }) => {
    try {
      const response = await adminApiRequest(`/api/configs/${key}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend. Make sure the backend server is running.');
      }
      throw error;
    }
  },

  /**
   * Delete a configuration (Admin)
   * DELETE /api/configs/{key}
   * Permanently delete a config key. Admin-only.
   * @param key - Config key to delete
   * @returns Promise with success message
   */
  deleteConfig: async (key: string) => {
    try {
      const response = await adminApiRequest(`/api/configs/${key}`, {
        method: 'DELETE',
      });

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
   * Create a new credit package. Name must be unique.
   * @param data - Package data with new schema
   * @returns Promise with created package (201 status)
   */
  createPackage: async (data: {
    name: string;
    includedCredits: number;
    actualPrice: number;
    currentPrice: number;
    description?: string;
    offer?: string | null;
    isActive?: boolean;
    sortOrder?: number;
  }) => {
    try {
      const response = await adminApiRequest('/api/packages', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      // Accept both 200 and 201 status codes
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
   * Update a package (Admin)
   * PATCH /api/packages/{id}
   * Partially update a package. Only send the fields you want to change — everything else stays untouched (PATCH, not PUT).
   * @param id - Package MongoDB _id
   * @param data - Partial package data to update
   * @returns Promise with updated package
   */
  updatePackage: async (id: string, data: Partial<{
    name: string;
    includedCredits: number;
    actualPrice: number;
    currentPrice: number;
    description: string;
    offer: string | null;
    isActive: boolean;
    sortOrder: number;
  }>) => {
    try {
      const response = await adminApiRequest(`/api/packages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

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
   * User clicks "Buy" on a package → frontend calls this endpoint. Returns a Razorpay orderId + public key.
   * Requires authentication (Bearer token in Authorization header).
   * @param packageId - Package ID
   * @returns Promise with { orderId, amount, currency, keyId } for Razorpay popup
   */
  createOrder: async (packageId: string) => {
    try {
      // Check if user is authenticated
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please sign in to create a payment order.');
      }

      // Validate packageId
      if (!packageId || typeof packageId !== 'string' || packageId.trim() === '') {
        throw new Error('Invalid package ID. Please select a valid package.');
      }

      const response = await apiRequest('/api/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ packageId: packageId.trim() }),
      });

      // Handle different error status codes
      if (!response.ok) {
        let errorData: any = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (e) {
          // If JSON parsing fails, use empty object
          errorData = {};
        }
        
        // Log error for debugging
        console.error('Payment create-order error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          packageId: packageId.trim(),
        });
        
        // Extract error message - check multiple possible fields
        let errorMessage = '';
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else {
          errorMessage = `Server error: ${response.status}`;
        }
        
        // Handle specific error cases with detailed messages
        if (response.status === 400) {
          // 400 can mean: Package not available OR payment gateway not configured
          const lowerMessage = errorMessage.toLowerCase();
          if (lowerMessage.includes('package') && (lowerMessage.includes('not available') || lowerMessage.includes('inactive'))) {
            throw new Error(`Package Error: The selected package is not available. It may be inactive or has been removed.`);
          } else if (lowerMessage.includes('payment') || lowerMessage.includes('gateway') || lowerMessage.includes('razorpay') || lowerMessage.includes('not configured')) {
            throw new Error(`Payment Gateway Error: Razorpay payment gateway is not configured on the server. Please contact support.`);
          } else {
            // Generic 400 error - show the backend message
            throw new Error(errorMessage || 'Package not available or payment gateway not configured. Please contact support.');
          }
        }
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in and try again.');
        }
        if (response.status === 404) {
          throw new Error('Package not found. Please select a valid package.');
        }
        
        throw new Error(errorMessage);
      }

      // Accept both 200 and 201 status codes
      const data = await response.json();
      
      // Validate response has required fields
      if (!data.orderId && !data.id) {
        throw new Error('Invalid response: orderId is missing');
      }
      if (!data.amount) {
        throw new Error('Invalid response: amount is missing');
      }
      if (!data.keyId && !data.key) {
        throw new Error('Invalid response: keyId is missing');
      }

      // Return normalized response format
      return {
        orderId: data.orderId || data.id,
        amount: data.amount,
        currency: data.currency || 'INR',
        keyId: data.keyId || data.key,
      };
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
   * @param params - Query parameters (page, limit, status)
   * @returns Promise with payment history
   */
  getHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: 'created' | 'paid' | 'failed' | 'expired';
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);

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

// Ollama Provider API
export const ollamaAPI = {
  /**
   * Get all available models on cloud
   * GET /v1/provider/list
   * @returns Promise with list of available models
   */
  getModelList: async () => {
    try {
      // Use APIMODULE_BASE_URL if available, otherwise try API_BASE_URL
      const baseUrl = APIMODULE_BASE_URL || API_BASE_URL;
      const endpoint = `${baseUrl}/v1/provider/list`;

      // Try without authentication first
      let response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      // If 401, try with authentication
      if (response.status === 401) {
        const token = getAuthToken();
        if (token) {
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
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
        throw new Error('Cannot connect to Ollama provider. Make sure the service is available.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },

  /**
   * Get chat completion from a model
   * POST /v1/provider/chatcompletion
   * @param data - Request payload with prompt and model
   * @returns Promise with chat completion response
   */
  chatCompletion: async (data: {
    prompt: string;
    model: string;
  }) => {
    try {
      // Use APIMODULE_BASE_URL if available, otherwise try API_BASE_URL
      const baseUrl = APIMODULE_BASE_URL || API_BASE_URL;
      const endpoint = `${baseUrl}/v1/provider/chatcompletion`;

      // Try without authentication first
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      let response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: data.prompt,
          model: data.model,
        }),
        mode: 'cors',
        credentials: 'omit',
      });

      // If 401, try with authentication
      if (response.status === 401) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              prompt: data.prompt,
              model: data.model,
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

      return response.json();
    } catch (error: any) {
      if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        throw new Error('Cannot connect to Ollama provider. Make sure the service is available.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error?.message || error?.toString() || 'An unexpected error occurred');
    }
  },
};

// Config API (for both authenticated users and admins)
export const configAPI = {
  /**
   * Get a config value by key (any authenticated user)
   * GET /api/configs/{key}
   * Returns the configuration value for the given key. Requires a valid JWT but does NOT require admin role.
   * Security: If the key does not exist, returns an empty object {} — the API will NOT tell you whether a key exists or not.
   * @param key - Config key to look up (e.g. SMTP_HOST, FEATURE_FLAGS)
   * @returns Promise with config value or empty object {} if key not found
   */
  get: async (key: string) => {
    try {
      const response = await apiRequest(`/api/configs/${key}`, {
        method: 'GET',
      });

      // 200 status means success (even if key doesn't exist, returns {})
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