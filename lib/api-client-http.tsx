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

    // Intercepteur de réponse pour gérer les erreurs
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

  async request<T = any>(options: {
    endpoint: string;
    method: Method; // utilisation du type `Method` d'Axios
    data?: any;
    params?: Record<string, any>;
    config?: AxiosRequestConfig;
  }): Promise<T> {
    const { endpoint, method, data, params, config } = options;

    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        method,
        data,
        params,
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
