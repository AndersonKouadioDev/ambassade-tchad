import { z } from 'zod';

export const genderSchema = z.enum(['MALE', 'FEMALE']);
export const maritalStatusSchema = z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']);
export const passportTypeSchema = z.enum(['ORDINARY', 'DIPLOMATIC', 'SERVICE']);
export const visaTypeSchema = z.enum(['SHORT_STAY', 'LONG_STAY', 'TRANSIT', 'BUSINESS', 'STUDENT', 'WORK']);
export const serviceTypeSchema = z.enum(['VISA', 'BIRTH_ACT', 'CONSULAR_CARD', 'LAISSEZ_PASSER', 'MARRIAGE_CAPACITY_ACT', 'DEATH_ACT', 'POWER_OF_ATTORNEY', 'NATIONALITY_CERTIFICATE']);

export const visaRequestDetailsSchema = z.object({
  // Informations personnelles
  personFirstName: z.string()
    .min(1, 'Le prénom est obligatoire')
    .max(255, 'Le prénom ne doit pas dépasser 255 caractères')
    .trim(),
  
  personLastName: z.string()
    .min(1, 'Le nom est obligatoire')
    .max(255, 'Le nom ne doit pas dépasser 255 caractères')
    .trim(),
  
  personGender: genderSchema,
  
  personNationality: z.string()
    .min(1, 'La nationalité est obligatoire')
    .max(255, 'La nationalité ne doit pas dépasser 255 caractères')
    .trim(),
  
  personBirthDate: z.string()
    .min(1, 'La date de naissance est obligatoire')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, 'La date de naissance doit être dans le passé'),
  
  personBirthPlace: z.string()
    .min(1, 'Le lieu de naissance est obligatoire')
    .max(255, 'Le lieu de naissance ne doit pas dépasser 255 caractères')
    .trim(),
  
  personMaritalStatus: maritalStatusSchema,
  
  // Informations du passeport
  passportType: passportTypeSchema,
  
  passportNumber: z.string()
    .min(1, 'Le numéro de passeport est obligatoire')
    .max(255, 'Le numéro de passeport ne doit pas dépasser 255 caractères')
    .trim(),
  
  passportIssuedBy: z.string()
    .min(1, 'Le pays de délivrance est obligatoire')
    .max(255, 'Le pays de délivrance ne doit pas dépasser 255 caractères')
    .trim(),
  
  passportIssueDate: z.string()
    .min(1, 'La date de délivrance est obligatoire')
    .refine((date) => {
      const issueDate = new Date(date);
      const today = new Date();
      return issueDate <= today;
    }, 'La date de délivrance ne peut pas être dans le futur'),
  
  passportExpirationDate: z.string()
    .min(1, 'La date d\'expiration est obligatoire')
    .refine((date) => {
      const expirationDate = new Date(date);
      const today = new Date();
      return expirationDate > today;
    }, 'Le passeport ne doit pas être expiré'),
  
  // Informations professionnelles (optionnelles)
  profession: z.string()
    .max(255, 'La profession ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  employerAddress: z.string()
    .max(255, 'L\'adresse de l\'employeur ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  employerPhoneNumber: z.string()
    .max(255, 'Le numéro de téléphone de l\'employeur ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  // Informations du visa
  durationMonths: z.number()
    .int('La durée doit être un nombre entier')
    .min(1, 'La durée doit être d\'au moins 1 mois')
    .max(60, 'La durée ne peut pas dépasser 60 mois'),
  
  destinationState: z.string()
    .max(255, 'La ville de destination ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  visaType: visaTypeSchema.optional(),
});

export const createDemandRequestSchema = z.object({
  serviceType: serviceTypeSchema,
  visaDetails: z.string().optional(),
  birthActDetails: z.string().optional(),
  consularCardDetails: z.string().optional(),
  laissezPasserDetails: z.string().optional(),
  marriageCapacityActDetails: z.string().optional(),
  deathActDetails: z.string().optional(),
  powerOfAttorneyDetails: z.string().optional(),
  nationalityCertificateDetails: z.string().optional(),
  contactPhoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide')
    .optional(),
  documents: z.array(z.instanceof(File)).optional(),
});

export const visaFormSchema = z.object({
  // Informations personnelles
  personFirstName: z.string()
    .min(1, 'Le prénom est obligatoire')
    .max(255, 'Le prénom ne doit pas dépasser 255 caractères')
    .trim(),
  
  personLastName: z.string()
    .min(1, 'Le nom est obligatoire')
    .max(255, 'Le nom ne doit pas dépasser 255 caractères')
    .trim(),
  
  personGender: genderSchema,
  
  personNationality: z.string()
    .min(1, 'La nationalité est obligatoire')
    .max(255, 'La nationalité ne doit pas dépasser 255 caractères')
    .trim(),
  
  personBirthDate: z.string()
    .min(1, 'La date de naissance est obligatoire'),
  
  personBirthPlace: z.string()
    .min(1, 'Le lieu de naissance est obligatoire')
    .max(255, 'Le lieu de naissance ne doit pas dépasser 255 caractères')
    .trim(),
  
  personMaritalStatus: maritalStatusSchema,
  
  // Informations du passeport
  passportType: passportTypeSchema,
  
  passportNumber: z.string()
    .min(1, 'Le numéro de passeport est obligatoire')
    .max(255, 'Le numéro de passeport ne doit pas dépasser 255 caractères')
    .trim(),
  
  passportIssuedBy: z.string()
    .min(1, 'Le pays de délivrance est obligatoire')
    .max(255, 'Le pays de délivrance ne doit pas dépasser 255 caractères')
    .trim(),
  
  passportIssueDate: z.string()
    .min(1, 'La date de délivrance est obligatoire'),
  
  passportExpirationDate: z.string()
    .min(1, 'La date d\'expiration est obligatoire'),
  
  // Informations professionnelles (optionnelles)
  profession: z.string()
    .max(255, 'La profession ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  employerAddress: z.string()
    .max(255, 'L\'adresse de l\'employeur ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  employerPhoneNumber: z.string()
    .max(255, 'Le numéro de téléphone de l\'employeur ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  // Informations du visa
  durationMonths: z.number()
    .int('La durée doit être un nombre entier')
    .min(1, 'La durée doit être d\'au moins 1 mois')
    .max(60, 'La durée ne peut pas dépasser 60 mois'),
  
  destinationState: z.string()
    .max(255, 'La ville de destination ne doit pas dépasser 255 caractères')
    .trim()
    .optional(),
  
  visaType: visaTypeSchema.optional(),
  
  // Contact
  contactPhoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide')
    .optional(),
  
  // Documents
  documents: z.array(z.instanceof(File)).optional(),
});

export type VisaRequestDetailsInput = z.infer<typeof visaRequestDetailsSchema>;
export type CreateDemandRequestInput = z.infer<typeof createDemandRequestSchema>;
export type VisaFormInput = z.infer<typeof visaFormSchema>; 