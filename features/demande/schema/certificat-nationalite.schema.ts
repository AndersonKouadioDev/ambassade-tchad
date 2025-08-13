import { z } from 'zod';
import { PaysParentType } from '../types/certificat-nationalite.type';
import { ServiceType } from '../types/service.type';

export const CertificatNationaliteDetailsSchema = z.object({
  // serviceType: z.enum(ServiceType, { message: 'Type de service invalide certificat nationalité.' }),
  applicantFirstName: z.string({ message: "Le prénom est obligatoire." })
    .min(1, { message: "Le prénom est obligatoire." })
    .max(255, { message: "Le prénom ne doit pas dépasser 255 caractères." }),
  applicantLastName: z.string({ message: "Le nom est obligatoire." })
    .min(1, { message: "Le nom est obligatoire." })
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères." }),
  applicantBirthDate: z.string({ message: "La date de naissance est obligatoire." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La date de naissance doit être une date valide." })
    .min(1, { message: "La date de naissance est obligatoire." }),
  applicantBirthPlace: z.string({ message: "Le lieu de naissance est obligatoire." })
    .min(1, { message: "Le lieu de naissance est obligatoire." })
    .max(255, { message: "Le lieu de naissance ne doit pas dépasser 255 caractères." }),
  applicantNationality: z.string({ message: "La nationalité est obligatoire." })
    .min(1, { message: "La nationalité est obligatoire." })
    .max(255, { message: "La nationalité ne doit pas dépasser 255 caractères." }),
  originCountryParentFirstName: z.string({ message: "Le prénom du parent est obligatoire." })
    .min(1, { message: "Le prénom du parent est obligatoire." })
    .max(255, { message: "Le prénom du parent ne doit pas dépasser 255 caractères." }),
  originCountryParentLastName: z.string({ message: "Le nom du parent est obligatoire." })
    .min(1, { message: "Le nom du parent est obligatoire." })
    .max(255, { message: "Le nom du parent ne doit pas dépasser 255 caractères." }),
  originCountryParentRelationship: z.enum(PaysParentType, { message: "le type de relation est invalide." }),
  contactPhoneNumber: z.string({ message: 'Le numéro de téléphone doit être une chaîne.' }).optional(),
  documents: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file.type.startsWith('image/') || file.type === 'application/pdf',
          { message: "Seuls les fichiers image ou PDF sont autorisés" }
        )
        .refine((file) => file.size <= 10 * 1024 * 1024, {
          message: "La taille de chaque image ne doit pas dépasser 10 Mo",
        })
    )
    .optional(),
});

export type CertificatNationaliteDetailsDTO = z.infer<typeof CertificatNationaliteDetailsSchema>;