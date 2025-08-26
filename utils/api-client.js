/**
 * Platform-agnostic API client utilities
 * Supports web (fetch) and mobile (various HTTP libraries)
 */

/**
 * HTTP Client Factory - Returns appropriate client for platform
 */
export function createHttpClient(platform = 'web', customConfig = {}) {
  switch (platform) {
    case 'web':
      return new WebHttpClient(customConfig);
    case 'react-native':
      return new ReactNativeHttpClient(customConfig);
    case 'node':
      return new NodeHttpClient(customConfig);
    default:
      return new WebHttpClient(customConfig);
  }
}

/**
 * Base HTTP Client Interface
 */
class BaseHttpClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 30000;
    this.headers = config.headers || {};
    this.interceptors = {
      request: [],
      response: []
    };
  }

  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  async request(url, options = {}) {
    throw new Error('request method must be implemented by subclass');
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

/**
 * Web HTTP Client (using fetch)
 */
class WebHttpClient extends BaseHttpClient {
  async request(url, options = {}) {
    const fullUrl = this.baseURL + url;
    
    // Apply request interceptors
    let requestConfig = {
      headers: { ...this.headers, ...options.headers },
      ...options
    };

    for (const interceptor of this.interceptors.request) {
      requestConfig = await interceptor(requestConfig);
    }

    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(fullUrl, {
        ...requestConfig,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Apply response interceptors
      let processedResponse = response;
      for (const interceptor of this.interceptors.response) {
        processedResponse = await interceptor(processedResponse);
      }

      if (!processedResponse.ok) {
        throw new Error(`HTTP ${processedResponse.status}: ${processedResponse.statusText}`);
      }

      // Return appropriate response type
      const contentType = processedResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return processedResponse.json();
      } else if (contentType && contentType.includes('audio/')) {
        return processedResponse; // Return response object for audio
      } else {
        return processedResponse.text();
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }
}

/**
 * React Native HTTP Client (would use react-native libraries)
 */
class ReactNativeHttpClient extends BaseHttpClient {
  async request(url, options = {}) {
    // Implementation would use react-native-fetch-api or similar
    // For now, fallback to fetch if available
    if (typeof fetch !== 'undefined') {
      return new WebHttpClient(this).request(url, options);
    }
    
    throw new Error('React Native HTTP client not implemented');
  }
}

/**
 * Node.js HTTP Client (would use node-fetch or axios)
 */
class NodeHttpClient extends BaseHttpClient {
  async request(url, options = {}) {
    // Implementation would use node-fetch, axios, or native http
    throw new Error('Node.js HTTP client not implemented');
  }
}

/**
 * Error handling utilities
 */
export class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

export function isNetworkError(error) {
  return error.name === 'TypeError' && error.message.includes('fetch');
}

export function isTimeoutError(error) {
  return error.message.includes('timeout');
}

export function isApiError(error) {
  return error instanceof ApiError;
}

/**
 * Request/Response interceptor utilities
 */
export function createAuthInterceptor(getToken) {
  return async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
}

export function createRetryInterceptor(maxRetries = 3, delay = 1000) {
  return async (response) => {
    if (!response.ok && response.status >= 500 && maxRetries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      // Note: Actual retry logic would need to be implemented differently
      // This is a simplified example
    }
    return response;
  };
}

export function createLoggingInterceptor(logger = console) {
  return {
    request: async (config) => {
      logger.log('API Request:', config.method, config.url);
      return config;
    },
    response: async (response) => {
      logger.log('API Response:', response.status, response.url);
      return response;
    }
  };
}