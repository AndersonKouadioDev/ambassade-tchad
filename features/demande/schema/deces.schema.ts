import { z } from 'zod';

export const DecesDetailsSchema = z.object({
  deceasedFirstName: z.string({ message: "Le prénom du défunt est obligatoire." })
    .min(1, { message: "Le prénom du défunt est obligatoire." })
    .max(255, { message: "Le prénom du défunt ne doit pas dépasser 255 caractères." }),
  deceasedLastName: z.string({ message: "Le nom du défunt est obligatoire." })
    .min(1, { message: "Le nom du défunt est obligatoire." })
    .max(255, { message: "Le nom du défunt ne doit pas dépasser 255 caractères." }),
  deceasedBirthDate: z.string({ message: "La date de naissance du défunt est obligatoire." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La date de naissance du défunt doit être au format YYYY-MM-DD." })
    .min(1, { message: "La date de naissance du défunt est obligatoire." }),
  deceasedDeathDate: z.string({ message: "La date de décès du défunt est obligatoire." })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La date de décès du défunt doit être au format YYYY-MM-DD." })
    .min(1, { message: "La date de décès du défunt est obligatoire." }),
  deceasedNationality: z.string({ message: "La nationalité du défunt est obligatoire." })
    .min(1, { message: "La nationalité du défunt est obligatoire." })
    .max(255, { message: "La nationalité du défunt ne doit pas dépasser 255 caractères." }),
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

export type DecesDetailsDTO = z.infer<typeof DecesDetailsSchema>;