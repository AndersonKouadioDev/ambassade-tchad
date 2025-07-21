import { z } from "zod";

export const consularCardFormSchema = z.object({
  personFirstName: z.string().min(2, "Le prénom est requis"),
  personLastName: z.string().min(2, "Le nom est requis"),
  personBirthDate: z.string().min(1, "La date de naissance est requise"),
  personBirthPlace: z.string().min(2, "Le lieu de naissance est requis"),
  personProfession: z.string().min(2, "La profession est requise"),
  personNationality: z.string().min(2, "La nationalité est requise"),
  personDomicile: z.string().min(2, "Le domicile est requis"),
  personAddressInOriginCountry: z.string().min(2, "L'adresse au pays d'origine est requise"),
  fatherFullName: z.string().min(2, "Le nom du père est requis"),
  motherFullName: z.string().min(2, "Le nom de la mère est requis"),
  justificationDocumentType: z.string().min(2, "Le type de pièce est requis"),
  justificationDocumentNumber: z.string().min(2, "Le numéro de pièce est requis"),
  contactPhoneNumber: z.string().min(8, "Le téléphone est requis"),
});

export type ConsularCardFormInput = z.infer<typeof consularCardFormSchema>; 