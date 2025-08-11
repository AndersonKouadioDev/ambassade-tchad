// Configuration de l'API
export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:8081/api/v1',
  
  // Endpoints d'authentification
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  
  // Endpoints des demandes
  REQUESTS: {
    CREATE: '/demandes',
    LIST: '/demandes',
    GET_BY_ID: (id: string) => `/demandes/${id}`,
    UPDATE: (id: string) => `/demandes/${id}`,
    DELETE: (id: string) => `/demandes/${id}`,
    STATS: '/demandes/stats',
  },
  
  // Endpoints des documents
  DOCUMENTS: {
    UPLOAD: '/documents/upload',
    GET: (id: string) => `/documents/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
  },
  
  // Configuration des timeouts
  TIMEOUT: 10000, // 10 secondes
  
  // Configuration des headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Fonction pour construire l'URL complète
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Fonction pour vérifier si l'API est accessible
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(buildApiUrl('/health'), {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
    });
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'API:', error);
    return false;
  }
} 