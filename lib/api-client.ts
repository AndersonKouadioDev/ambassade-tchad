import { ServiceType } from '@/types/request.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL || 'http://localhost:8081/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RequestData {
  serviceType: ServiceType;
  visaDetails?: string;
  passportDetails?: string;
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

  private async getAuthHeaders(tokenOverride?: string): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    let token = tokenOverride;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token') || undefined;
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header envoyé:', headers['Authorization']);
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
    } catch {
      return {
        success: false,
        error: 'Erreur lors du parsing de la réponse',
      };
    }
  }

  async createRequest(requestData: RequestData & { token?: string }): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders(requestData.token);

      if (requestData.documents?.length) {
        const formData = new FormData();
        const jsonData = { ...requestData };
        delete jsonData.documents;
        // Suppression de requestId de visaDetails si présent
        if (jsonData.visaDetails) {
          try {
            const details = typeof jsonData.visaDetails === 'string' ? JSON.parse(jsonData.visaDetails) : jsonData.visaDetails;
            if (details && typeof details === 'object') {
              // Supprime requestId si présent
              if ('requestId' in details) {
                delete details.requestId;
              }
              // Convertit les dates au format ISO si besoin
              const toISODate = (dateStr: string) => {
                if (!dateStr) return dateStr;
                if (/T/.test(dateStr)) return dateStr;
                return new Date(dateStr).toISOString();
              };
              if (details.personBirthDate) {
                details.personBirthDate = toISODate(details.personBirthDate);
              }
              if (details.passportIssueDate) {
                details.passportIssueDate = toISODate(details.passportIssueDate);
              }
              if (details.passportExpirationDate) {
                details.passportExpirationDate = toISODate(details.passportExpirationDate);
              }
            }
            jsonData.visaDetails = JSON.stringify(details);
          } catch (error) {
            // Si parsing échoue, on laisse tel quel
          }
        }
        // Suppression de requestId de birthActDetails si présent
        if (jsonData.birthActDetails) {
          try {
            const details = typeof jsonData.birthActDetails === 'string' ? JSON.parse(jsonData.birthActDetails) : jsonData.birthActDetails;
            if (details && typeof details === 'object') {
              if ('requestId' in details) delete details.requestId;
              if ('personGender' in details) delete details.personGender;
              // Conversion forcée de la date
              if (details.personBirthDate) {
                details.personBirthDate = new Date(details.personBirthDate).toISOString();
              }
              console.log('Détail final birthActDetails avant stringify:', details);
            }
            jsonData.birthActDetails = JSON.stringify(details);
          } catch (e) {}
        }
        // Ajoute explicitement contactPhoneNumber à plat dans le FormData
        const contactPhoneNumber = requestData.contactPhoneNumber || jsonData.contactPhoneNumber || '';
        Object.entries(jsonData).forEach(([key, value]) => {
          formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
        });
        formData.set('contactPhoneNumber', contactPhoneNumber);
        console.log('FormData contactPhoneNumber envoyé :', formData.get('contactPhoneNumber'));
        // Ajoute chaque fichier s'il y en a
        requestData.documents.forEach(file => formData.append('documents', file));
        delete headers['Content-Type'];
        console.log('Payload FormData (clé data):', JSON.stringify(jsonData));
        // Log détaillé du FormData envoyé
        for (const pair of formData.entries()) {
          console.log('FormData:', pair[0], pair[1]);
        }
        const response = await fetch(`${this.baseUrl}/demandes`, {
          method: 'POST',
          headers,
          body: formData,
        });
        console.log('response', response);
        return this.handleResponse(response);
      } else {
        // S'il n'y a pas de documents, NE PAS ajouter le champ 'documents'.
        // Le backend doit gérer le cas où 'documents' est absent ou undefined.
        const formData = new FormData();
        const jsonData = { ...requestData };
        delete jsonData.documents;
        Object.entries(jsonData).forEach(([key, value]) => {
          formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
        });
        delete headers['Content-Type'];
        console.log('Payload FormData (clé data):', JSON.stringify(jsonData));
        const response = await fetch(`${this.baseUrl}/demandes`, {
          method: 'POST',
          headers,
          body: formData,
        });
        console.log('response', response);
        return this.handleResponse(response);
      }
    } catch (error) {
      console.error('Erreur création demande:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
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
      console.error('Erreur récupération demandes:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }

  async getRequestById(requestId: string, tokenOverride?: string): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders(tokenOverride);
      const response = await fetch(`${this.baseUrl}/demandes/${requestId}`, {
        method: 'GET',
        headers,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur récupération demande:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
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
      console.error('Erreur mise à jour demande:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
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
      console.error('Erreur suppression demande:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }

  async uploadDocument(file: File): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      delete headers['Content-Type'];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Erreur upload document:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
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
      console.error('Erreur récupération stats:', error);
      return { success: false, error: 'Erreur de connexion au serveur' };
    }
  }

  async getRequestByTicket(ticket: string, tokenOverride?: string): Promise<ApiResponse> {
    const headers = await this.getAuthHeaders(tokenOverride);
    const response = await fetch(`${this.baseUrl}/demandes/demandeur/${ticket}`, {
      method: 'GET',
      headers,
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();

// ========= APIS SPÉCIFIQUES PAR TYPE =========

function buildRequestClient(serviceType: ServiceType, detailKey: keyof RequestData) {
  return {
    create: (
      data: any,
      contactPhoneNumber?: string,
      documents?: File[],
      token?: string
    ) => {
      return apiClient.createRequest({
        serviceType,
        [detailKey]: JSON.stringify(data),
        contactPhoneNumber,
        documents,
        token,
      } as any);
    },
  };
}

export const visaApi = buildRequestClient(ServiceType.VISA, 'visaDetails');
export const birthActApi = buildRequestClient(ServiceType.BIRTH_ACT_APPLICATION, 'birthActDetails');
export const consularCardApi = buildRequestClient(ServiceType.CONSULAR_CARD, 'consularCardDetails');
export const laissezPasserApi = buildRequestClient(ServiceType.LAISSEZ_PASSER, 'laissezPasserDetails');
export const marriageCapacityApi = buildRequestClient(ServiceType.MARRIAGE_CAPACITY_ACT, 'marriageCapacityActDetails');
export const deathActApi = buildRequestClient(ServiceType.DEATH_ACT_APPLICATION, 'deathActDetails');
export const powerOfAttorneyApi = buildRequestClient(ServiceType.POWER_OF_ATTORNEY, 'powerOfAttorneyDetails');
export const nationalityCertificateApi = buildRequestClient(ServiceType.NATIONALITY_CERTIFICATE, 'nationalityCertificateDetails');
