import { z } from 'zod';
import { VisaRequestDetailsSchema } from './visa.schema';
import { ActeNaissanceDetailsSchema } from './acte-naissance.schema';
import { CarteConsulaireDetailsSchema } from './carte-consulaire.schema';
import { MariageDetailsSchema } from './mariage.schema';
import { DecesDetailsSchema } from './deces.schema';
import { ProcurationDetailsSchema } from './procuration.schema';
import { CertificatNationaliteDetailsSchema } from './certificat-nationalite.schema';
import { LaissezPasserDetailsSchema } from './laissez-passer.schema';
import { DemandeStatus } from '../types/demande.type';
import { ServiceType } from '../types/service.type';


export const DemandeCreateSchema = z.object({
  // serviceType: z.enum(ServiceType, { message: 'Type de service invalide demande.' }),
  visaDetails: VisaRequestDetailsSchema.optional(),
  birthActDetails: ActeNaissanceDetailsSchema.optional(),
  consularCardDetails: CarteConsulaireDetailsSchema.optional(),
  laissezPasserDetails: LaissezPasserDetailsSchema.optional(),
  marriageCapacityActDetails: MariageDetailsSchema.optional(),
  deathActDetails: DecesDetailsSchema.optional(),
  powerOfAttorneyDetails: ProcurationDetailsSchema.optional(),
  nationalityCertificateDetails: CertificatNationaliteDetailsSchema.optional(),

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

export type DemandeCreateDTO = z.infer<typeof DemandeCreateSchema>;

export const DemandUpdateSchema = z.object({
  status: z.enum(DemandeStatus, { message: 'Statut invalide.' }),
  reason: z.string({ message: 'La raison doit être une chaîne de caractères.' })
    .max(1000, 'La raison ne doit pas dépasser 1000 caractères.')
    .optional(),
  observation: z.string().optional(),
});

export type DemandUpdateDTO = z.infer<typeof DemandUpdateSchema>;