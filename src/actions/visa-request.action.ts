'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  createDemandRequestSchema, 
  visaRequestDetailsSchema,
  type CreateDemandRequestInput,
  type VisaRequestDetailsInput 
} from '@/src/schemas/visa-request.schemas';
import { apiClient } from '@/lib/api-client';

// Utilitaire d'appel API sécurisé
async function apiRequest({ endpoint, method = 'GET', data, token, headers = {} }) {
  const allHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) {
    allHeaders['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(endpoint, {
    method,
    headers: allHeaders,
    body: data ? JSON.stringify(data) : undefined,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Erreur API');
  return result;
}

export async function createVisaRequest(
  prevState: any,
  formData: FormData
) {
  // Récupère la locale depuis le formulaire ou par défaut 'fr'
  const locale = formData.get('locale') || 'fr';
  // Récupère le token côté serveur
  const token = formData.get('token');

  if (!token) {
    return {
      error: 'Authentification requise',
    };
  }

  const validatedFields = createDemandRequestSchema.safeParse({
    serviceType: formData.get('serviceType'),
    contactPhoneNumber: formData.get('contactPhoneNumber'),
    documents: formData.getAll('documents'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Données de formulaire invalides.',
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { serviceType, contactPhoneNumber, documents } = validatedFields.data;

  // Extraire les données du visa depuis le formData
  const visaData = {
    personFirstName: formData.get('personFirstName') as string,
    personLastName: formData.get('personLastName') as string,
    personGender: formData.get('personGender') as string,
    personNationality: formData.get('personNationality') as string,
    personBirthDate: formData.get('personBirthDate') as string,
    personBirthPlace: formData.get('personBirthPlace') as string,
    personMaritalStatus: formData.get('personMaritalStatus') as string,
    passportType: formData.get('passportType') as string,
    passportNumber: formData.get('passportNumber') as string,
    passportIssuedBy: formData.get('passportIssuedBy') as string,
    passportIssueDate: formData.get('passportIssueDate') as string,
    passportExpirationDate: formData.get('passportExpirationDate') as string,
    profession: formData.get('profession') as string,
    employerAddress: formData.get('employerAddress') as string,
    employerPhoneNumber: formData.get('employerPhoneNumber') as string,
    durationMonths: parseInt(formData.get('durationMonths') as string),
    destinationState: formData.get('destinationState') as string,
    visaType: formData.get('visaType') as string,
  };

  const validatedVisaFields = visaRequestDetailsSchema.safeParse(visaData);

  if (!validatedVisaFields.success) {
    return {
      error: 'Données de visa invalides.',
      details: validatedVisaFields.error.flatten().fieldErrors,
    };
  }

  const visaDetails = validatedVisaFields.data;

  try {
    const requestData: CreateDemandRequestInput = {
      serviceType,
      visaDetails: JSON.stringify(visaDetails),
      contactPhoneNumber,
      documents: documents as File[],
    };

    // Utilise l'utilitaire pour envoyer la requête avec le token
    await apiRequest({
      endpoint: 'http://localhost:8081/api/v1/demandes',
      method: 'POST',
      data: requestData,
      token,
    });

    revalidatePath(`/${locale}/espace-client/mes-demandes`);
    return { success: true };
  } catch (error: any) {
    return {
      error: error.message || 'Une erreur inattendue s\'est produite.',
    };
  }
}

export async function createVisaRequestWithFormData(
  visaData: VisaRequestDetailsInput,
  contactPhoneNumber?: string,
  documents?: File[]
) {
  // On ne vérifie plus la session ici, c'est le front qui doit envoyer le token si besoin

  const validatedVisaFields = visaRequestDetailsSchema.safeParse(visaData);

  if (!validatedVisaFields.success) {
    return {
      error: 'Données de visa invalides.',
      details: validatedVisaFields.error.flatten().fieldErrors,
    };
  }

  try {
    const requestData = {
      serviceType: 'VISA',
      visaDetails: JSON.stringify(visaData),
      contactPhoneNumber,
      documents,
    };

    // Envoie la requête à l'API (ajoute le token dans les headers si besoin)
    const result = await apiClient.createRequest(requestData);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        error: result.error || 'Erreur lors de la création de la demande.',
      };
    }
  } catch (error) {
    return {
      error: 'Une erreur inattendue s\'est produite.',
    };
  }
} 