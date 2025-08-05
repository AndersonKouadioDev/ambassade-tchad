import { revalidatePath } from "next/cache";

export async function createVisaRequest(formData: FormData) {
  const locale = formData.get('locale') || 'fr';
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

    await apiRequest({
      endpoint: 'http://localhost:8081/api/v1/demandes',
      method: 'POST',
      data: requestData,
      token,
    });

    revalidatePath(`/${locale}/espace-client/mes-demandes`);
    return { success: true };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'Erreur inconnue.' };
  }
}
