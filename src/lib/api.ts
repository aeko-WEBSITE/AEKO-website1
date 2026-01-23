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
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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
          stream: data.stream ?? false, // Always false as per requirements
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