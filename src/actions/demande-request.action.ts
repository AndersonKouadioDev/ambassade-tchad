'use server';

// Utilitaire d'appel API sécurisé
// async function apiRequest({ endpoint, method = 'GET', data, token, headers = {} }) {
//   const allHeaders = {
//     'Content-Type': 'application/json',
//     ...headers,
//   };
//   if (token) {
//     allHeaders['Authorization'] = `Bearer ${token}`;
//   }
//   const res = await fetch(endpoint, {
//     method,
//     headers: allHeaders,
//     body: data ? JSON.stringify(data) : undefined,
//   });
//   const result = await res.json();
//   if (!res.ok) throw new Error(result.message || 'Erreur API');
//   return result;
// }

// Action générique pour toutes les demandes
export async function createDemande({
  type, // 'VISA', 'CONSULAR_CARD', etc.
  details,
  contactPhoneNumber,
  documents,
  tokenFromClient,
}) {
  const token = tokenFromClient;
  if (!token) {
    return { error: 'Authentification requise' };
  }
  try {
    // Détermine la clé details attendue par le backend
    let typeKey = '';
    switch (type) {
      case 'BIRTH_ACT_APPLICATION': typeKey = 'birthAct'; break;
      case 'VISA': typeKey = 'visa'; break;
      case 'CONSULAR_CARD': typeKey = 'consularCard'; break;
      case 'LAISSEZ_PASSER': typeKey = 'laissezPasser'; break;
      case 'POWER_OF_ATTORNEY': typeKey = 'powerOfAttorney'; break;
      default: typeKey = type.toLowerCase(); break;
    }
    let response;
    if (documents && documents.length > 0) {
      // Envoi multipart/form-data
      const formData = new FormData();
      formData.append('serviceType', type);
      formData.append(`${typeKey}Details`, JSON.stringify(details));
      formData.append('contactPhoneNumber', contactPhoneNumber);
      documents.forEach(file => formData.append('documents', file));
      response = await fetch('http://localhost:8081/api/v1/demandes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // NE PAS mettre Content-Type ici !
        },
        body: formData,
      });
    } else {
      // Envoi JSON pur
      const requestData = {
        serviceType: type,
        [`${typeKey}Details`]: details,
        contactPhoneNumber,
      };
      response = await fetch('http://localhost:8081/api/v1/demandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur backend:', errorData);
      return { error: errorData.message || 'Erreur lors de la création de la demande.' };
    }
    const result = await response.json();
    console.log('Réponse backend:', result);
    return { success: true };
  } catch (error) {
    console.error('Erreur backend:', error);
    return { error: error.message || 'Une erreur inattendue s\'est produite.' };
  }
} 