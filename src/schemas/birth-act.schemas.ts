import { z } from "zod";

export const birthActFormSchema = z.object({
  personFirstName: z.string().min(2, "Le prénom est requis").max(255, "Le prénom ne doit pas dépasser 255 caractères."),
  personLastName: z.string().min(2, "Le nom est requis").max(255, "Le nom ne doit pas dépasser 255 caractères."),
  personBirthDate: z.string().min(1, "La date de naissance est requise"),
  personBirthPlace: z.string().min(2, "Le lieu de naissance est requis").max(255, "Le lieu de naissance ne doit pas dépasser 255 caractères."),
  personNationality: z.string().min(2, "La nationalité est requise").max(255, "La nationalité ne doit pas dépasser 255 caractères."),
  personDomicile: z.string().max(255, "Le domicile ne doit pas dépasser 255 caractères.").optional(),
  fatherFullName: z.string().min(2, "Le nom du père est requis").max(255, "Le nom du père ne doit pas dépasser 255 caractères."),
  motherFullName: z.string().min(2, "Le nom de la mère est requis").max(255, "Le nom de la mère ne doit pas dépasser 255 caractères."),
  requestType: z.enum(["EXTRAIT", "COPIE_LITTERALE"], { required_error: "Le type de demande est requis" }),
  personGender: z.enum(["MALE", "FEMALE"]).optional(),
});

export type BirthActFormInput = z.infer<typeof birthActFormSchema>; 