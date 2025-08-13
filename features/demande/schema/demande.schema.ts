import { z } from 'zod';
import { LaissezPasserDetailsSchema } from './laissez-passer.schema';
import { DemandeStatus } from '../types/demande.type';


export const DemandeCreateSchema = z.object({
  // serviceType: z.enum(ServiceType, { message: 'Type de service invalide demande.' }),
  visaDetails: z.string().optional(),
  birthActDetails: z.string().optional(),
  consularCardDetails: z.string().optional(),
  laissezPasserDetails: LaissezPasserDetailsSchema.optional(),
  marriageCapacityActDetails: z.string().optional(),
  deathActDetails: z.string().optional(),
  powerOfAttorneyDetails: z.string().optional(),
  nationalityCertificateDetails: z.string().optional(),

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
          message: "La taille de chaque fichier ne doit pas dépasser 10 Mo",
        })
    )
    .optional(),
});

export type DemandeCreateDTO = z.infer<typeof DemandeCreateSchema>;

export const DemandUpdateSchema = z.object({
  status: z.enum(DemandeStatus, { message: 'Statut invalide.' }),
  reason: z.string({ message: 'La raison doit être une chaîne de caractères.' })
    .max(1000, 'La raison ne doit pas dépasser 1000 caractères.')
    .optional(),
  observation: z.string().optional(),
});

export type DemandUpdateDTO = z.infer<typeof DemandUpdateSchema>;