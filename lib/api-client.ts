// Client API pour les appels vers le backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RequestData {
  serviceType: string;
  visaDetails?: string;
  birthActDetails?: string;
  consularCardDetails?: string;
  laissezPasserDetails?: string;
  marriageCapacityActDetails?: string;
  deathActDetails?: string;
  powerOfAttorneyDetails?: string;
  nationalityCertificateDetails?: string;
  contactPhoneNumber?: string;
  documents?: File[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Si on est côté client, on peut récupérer le token depuis le localStorage ou une session
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      return {
        success: false,
        error: errorData.message || `Erreur ${response.status}: ${response.statusText}`,
      };
    }

    try {
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors du parsing de la réponse',
      };
    }
  }

  async createRequest(requestData: RequestData): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      // Si on a des fichiers, on utilise FormData
      if (requestData.documents && requestData.documents.length > 0) {
        const formData = new FormData();
        
        // Ajouter les données JSON
        const jsonData = { ...requestData };
        delete jsonData.documents;
        formData.append('data', JSON.stringify(jsonData));
        
        // Ajouter les fichiers
        requestData.documents.forEach((file, index) => {
          formData.append(`documents`, file);
        });

        // Mettre à jour les headers pour FormData
        delete headers['Content-Type'];
        
        const response = await fetch(`${this.baseUrl}/demandes`, {
          method: 'POST',
          headers,
          body: formData,
        });

        return this.handleResponse(response);
      } else {
        // Pas de fichiers, on envoie du JSON
        const response = await fetch(`${this.baseUrl}/demandes`, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestData),
        });

        return this.handleResponse(response);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  async getRequests(filters?: {
    status?: string;
    serviceType?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });
      }

      const response = await fetch(`${this.baseUrl}/demandes?${params.toString()}`, {
        method: 'GET',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  async getRequestById(requestId: string): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/demandes/${requestId}`, {
        method: 'GET',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération de la demande:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  async updateRequest(requestId: string, updateData: Partial<RequestData>): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/demandes/${requestId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  async deleteRequest(requestId: string): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/demandes/${requestId}`, {
        method: 'DELETE',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  async uploadDocument(file: File): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      delete headers['Content-Type']; // FormData gère le Content-Type

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de l\'upload du document:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  async getRequestStats(): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/demandes/stats`, {
        method: 'GET',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient();

// Fonctions utilitaires pour les demandes spécifiques
export const visaApi = {
  create: (visaData: any, contactPhoneNumber?: string, documents?: File[]) => {
    return apiClient.createRequest({
      serviceType: 'VISA',
      visaDetails: JSON.stringify(visaData),
      contactPhoneNumber,
      documents,
    });
  },
};

export const passportApi = {
  create: (passportData: any, contactPhoneNumber?: string, documents?: File[]) => {
    return apiClient.createRequest({
      serviceType: 'PASSPORT',
      passportDetails: JSON.stringify(passportData),
      contactPhoneNumber,
      documents,
    });
  },
};

export const consularCardApi = {
  create: (cardData: any, contactPhoneNumber?: string, documents?: File[]) => {
    return apiClient.createRequest({
      serviceType: 'CONSULAR_CARD',
      consularCardDetails: JSON.stringify(cardData),
      contactPhoneNumber,
      documents,
    });
  },
}; 