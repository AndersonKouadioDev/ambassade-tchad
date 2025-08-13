import { z } from 'zod';
import { ActeNaissanceType } from '../types/acte-naissance.type';
import { Genre } from '../types/demande.type';

export const ActeNaissanceDetailsSchema = z.object({
  personFirstName: z.string({ message: "Le prénom est obligatoire." })
    .min(1, { message: "Le prénom est obligatoire." })
    .max(255, { message: "Le prénom ne doit pas dépasser 255 caractères." }),
  personLastName: z.string({ message: "Le nom est obligatoire." })
    .min(1, { message: "Le nom est obligatoire." })
    .max(255, { message: "Le nom ne doit pas dépasser 255 caractères." }),
  personBirthDate: z.string({ message: 'La date de naissance est obligatoire.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'La date de naissance doit être une date ISO valide.' })
    .min(1, { message: 'La date de naissance est obligatoire.' }),
  personBirthPlace: z.string({ message: 'Le lieu de naissance est obligatoire.' })
    .min(1, { message: 'Le lieu de naissance est obligatoire.' })
    .max(255, { message: 'Le lieu de naissance ne doit pas dépasser 255 caractères.' }),
  personNationality: z.string({ message: 'La nationalité est obligatoire.' })
    .min(1, { message: 'La nationalité est obligatoire.' })
    .max(255, { message: 'La nationalité ne doit pas dépasser 255 caractères.' }),
  personDomicile: z.string({ message: 'Le domicile ne doit pas dépasser 255 caractères.' })
    .max(255, { message: 'Le domicile ne doit pas dépasser 255 caractères.' })
    .optional(),
  fatherFullName: z.string({ message: 'Le nom du père est obligatoire.' })
    .min(1, { message: 'Le nom du père est obligatoire.' })
    .max(255, { message: 'Le nom du père ne doit pas dépasser 255 caractères.' }),
  motherFullName: z.string({ message: 'Le nom de la mère est obligatoire.' })
    .min(1, { message: 'Le nom de la mère est obligatoire.' })
    .max(255, { message: 'Le nom de la mère ne doit pas dépasser 255 caractères.' }),
  requestType: z.enum(ActeNaissanceType, { message: 'Le type de demande est invalide.' }).optional(),
  personGender: z.enum(Genre, { message: 'Le genre est invalide.' }).optional(),
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

export type ActeNaissanceDetailsDTO = z.infer<typeof ActeNaissanceDetailsSchema>;