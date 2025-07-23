// lib/api-client-http.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  Method,
} from 'axios';

class ApiClientHttp {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          try {
            const logoutUrl = new URL(
              '/api/auth/logout',
              process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
            );
            await fetch(logoutUrl.toString(), { method: 'POST' });
          } catch (logoutError) {
            console.error('Erreur pendant la déconnexion automatique :', logoutError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Ajoute le token manuellement si besoin (pour serveur ou client)
  private getAuthHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;
    }
    return headers;
  }

  async request<T = any>(options: {
    endpoint: string;
    method: Method;
    data?: any;
    params?: Record<string, any>;
    token?: string;
    config?: AxiosRequestConfig;
  }): Promise<T> {
    const { endpoint, method, data, params, token, config } = options;

    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        method,
        data,
        params,
        headers: this.getAuthHeaders(token),
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Request failed:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  }
}

export const apiClientHttp = new ApiClientHttp(
  process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:4000'
);
