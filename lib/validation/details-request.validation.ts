// lib/validation/details-request.validation.ts

import { z } from "zod";
import {
  Gender,
  MaritalStatus,
  PassportType,
  VisaType,
  BirthActRequestType,
  JustificationDocumentType,
  OriginCountryParentRelationshipType,
} from "@/types/request.types";
// import { visaFormSchema } from "@/src/schemas/visa-request.schemas";

// ==================== ENUMS ====================

const GenderEnum = z.nativeEnum(Gender);
const MaritalStatusEnum = z.nativeEnum(MaritalStatus);
const PassportTypeEnum = z.nativeEnum(PassportType);
const VisaTypeEnum = z.nativeEnum(VisaType);
const BirthActRequestTypeEnum = z.nativeEnum(BirthActRequestType);
const JustificationDocumentTypeEnum = z.nativeEnum(JustificationDocumentType);
const OriginCountryParentRelationshipTypeEnum = z.nativeEnum(OriginCountryParentRelationshipType);

// ==================== VISA ====================


export const visaRequestDetailsSchema = z.object({
  requestId: z.string().nonempty({ message: 'ID de la demande requis.' }).uuid('ID invalide.'),
  
  personFirstName: z.string({ message: 'Le prénom est requis.' }),
  personLastName: z.string({ message: 'Le nom est requis.' }),
  personGender: GenderEnum,
  personNationality: z.string({ message: 'La nationalité est requise.' }),
  personBirthDate: z.string({ message: 'La date de naissance est requise.' }).or(z.date()),
  personBirthPlace: z.string({ message: 'Le lieu de naissance est requis.' }),
  personMaritalStatus: MaritalStatusEnum,
  
  passportType: PassportTypeEnum,
  passportNumber: z.string({ message: 'Le numéro de passeport est requis.' }),
  passportIssuedBy: z.string({ message: 'Le pays de délivrance est requis.' }),
  passportIssueDate: z.string({ message: 'La date de délivrance est requise.' }).or(z.date()),
  passportExpirationDate: z.string({ message: 'La date d\'expiration est requise.' }).or(z.date()),

  profession: z.string().optional(),
  employerAddress: z.string().optional(),
  employerPhoneNumber: z.string().optional(),

  visaType: VisaTypeEnum,
  durationMonths: z.number().optional(),
  destinationState: z.string().optional(),
  visaExpirationDate: z.string().or(z.date()).optional(),
});


export type VisaRequestDetails = z.infer<typeof visaRequestDetailsSchema>;

// ==================== BIRTH ACT ====================

export const birthActRequestDetailsSchema = z.object({
  personFirstName: z.string(),
  personLastName: z.string(),
  personBirthDate: z.string().or(z.date()),
  personBirthPlace: z.string(),
  personNationality: z.string(),
  personDomicile: z.string().optional(),
  fatherFullName: z.string(),
  motherFullName: z.string(),
  requestType: BirthActRequestTypeEnum.optional(),
  personGender: GenderEnum.optional(),
  contactPhoneNumber: z.string().min(6, 'Numéro de téléphone requis'),
});

// ==================== CONSULAR CARD ====================

export const consularCardRequestDetailsSchema = z.object({
  requestId: z.string().uuid(),
  personFirstName: z.string(),
  personLastName: z.string(),
  personBirthDate: z.string().or(z.date()),
  personBirthPlace: z.string(),
  personProfession: z.string().optional(),
  personNationality: z.string(),
  personDomicile: z.string().optional(),
  personAddressInOriginCountry: z.string().optional(),
  fatherFullName: z.string().optional(),
  motherFullName: z.string().optional(),
  justificationDocumentType: JustificationDocumentTypeEnum.optional(),
  justificationDocumentNumber: z.string().optional(),
  cardExpirationDate: z.string().or(z.date()).optional(),
});

// ==================== LAISSEZ-PASSER ====================


export const laissezPasserRequestDetailsSchema = z.object({
  personFirstName: z.string().min(1, "Le prénom est requis"),
  personLastName: z.string().min(1, "Le nom est requis"),
  personBirthDate: z.string().min(1, "La date de naissance est requise")
    .refine(val => !isNaN(new Date(val).getTime()), {
      message: "Date invalide"
    }),
  personBirthPlace: z.string().min(1, "Le lieu de naissance est requis"),
  personProfession: z.string().optional(),
  personNationality: z.string().min(1, "La nationalité est requise"),
  personDomicile: z.string().optional(),
  fatherFullName: z.string().optional(),
  motherFullName: z.string().optional(),
  destination: z.string().min(1, "La destination est requise"),
  travelReason: z.string().min(1, "Le motif du voyage est requis"),
  accompanied: z.boolean().default(false),
  justificationDocumentType: JustificationDocumentTypeEnum.optional(),
  justificationDocumentNumber: z.string().optional(),
  laissezPasserExpirationDate: z.string().min(1, "La date d'expiration est requise")
    .refine(val => !isNaN(new Date(val).getTime()), {
      message: "Date invalide"
    }),
  contactPhoneNumber: z.string().min(1, "Le numéro de contact est requis")
    .regex(/^\+?[0-9\s\-]+$/, "Numéro de téléphone invalide"),
  accompanierFirstName: z.string().optional(),
  accompanierLastName: z.string().optional(),
  accompanierBirthDate: z.string().optional(),
  accompanierBirthPlace: z.string().optional(),
  accompanierNationality: z.string().optional(),
  accompanierDomicile: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.accompanied) {
    if (!data.accompanierFirstName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le prénom de l'accompagnateur est requis",
        path: ["accompanierFirstName"]
      });
    }
    if (!data.accompanierLastName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le nom de l'accompagnateur est requis",
        path: ["accompanierLastName"]
      });
    }
    if (!data.accompanierBirthDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de naissance de l'accompagnateur est requise",
        path: ["accompanierBirthDate"]
      });
    } else if (isNaN(new Date(data.accompanierBirthDate).getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date de naissance invalide",
        path: ["accompanierBirthDate"]
      });
    }
    if (!data.accompanierBirthPlace) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le lieu de naissance de l'accompagnateur est requis",
        path: ["accompanierBirthPlace"]
      });
    }
    if (!data.accompanierNationality) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La nationalité de l'accompagnateur est requise",
        path: ["accompanierNationality"]
      });
    }
  }
});

export type LaissezPasserFormInput = z.infer<typeof laissezPasserRequestDetailsSchema>;
// ==================== MARRIAGE CAPACITY ====================

export const marriageCapacityActRequestDetailsSchema = z.object({
  requestId: z.string().uuid(),
  husbandFirstName: z.string(),
  husbandLastName: z.string(),
  husbandBirthDate: z.string().or(z.date()),
  husbandBirthPlace: z.string(),
  husbandNationality: z.string(),
  husbandDomicile: z.string().optional(),
  wifeFirstName: z.string(),
  wifeLastName: z.string(),
  wifeBirthDate: z.string().or(z.date()),
  wifeBirthPlace: z.string(),
  wifeNationality: z.string(),
  wifeDomicile: z.string().optional(),
});

// ==================== DEATH ACT ====================

export const deathActRequestDetailsSchema = z.object({
  requestId: z.string().uuid(),
  deceasedFirstName: z.string(),
  deceasedLastName: z.string(),
  deceasedBirthDate: z.string().or(z.date()),
  deceasedDeathDate: z.string().or(z.date()),
  deceasedNationality: z.string(),
});

// ==================== POWER OF ATTORNEY ====================

export const powerOfAttorneyRequestDetailsSchema = z.object({
  requestId: z.string().uuid(),
  agentFirstName: z.string(),
  agentLastName: z.string(),
  agentJustificationDocumentType: JustificationDocumentTypeEnum.optional(),
  agentIdDocumentNumber: z.string().optional(),
  agentAddress: z.string().optional(),
  principalFirstName: z.string(),
  principalLastName: z.string(),
  principalJustificationDocumentType: JustificationDocumentTypeEnum.optional(),
  principalIdDocumentNumber: z.string().optional(),
  principalAddress: z.string().optional(),
  powerOfType: z.string().optional(),
  reason: z.string().optional(),
});

// ==================== NATIONALITY CERTIFICATE ====================

export const nationalityCertificateRequestDetailsSchema = z.object({
  requestId: z.string().uuid(),
  applicantFirstName: z.string(),
  applicantLastName: z.string(),
  applicantBirthDate: z.string().or(z.date()),
  applicantBirthPlace: z.string(),
  applicantNationality: z.string(),
  originCountryParentFirstName: z.string(),
  originCountryParentLastName: z.string(),
  originCountryParentRelationship: OriginCountryParentRelationshipTypeEnum,
});
