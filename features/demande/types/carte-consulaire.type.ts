import { IDemande } from "./demande.type";

export enum DocumentJustificationType {
    PASSPORT = 'PASSPORT',
    NATIONAL_ID_CARD = 'NATIONAL_ID_CARD',
    BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
    OTHER = 'OTHER'
}

export interface ICarteConsulaireDetails {
    id: string;
    requestId: string;
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personProfession?: string;
    personNationality: string;
    personDomicile?: string;
    personAddressInOriginCountry?: string;
    fatherFullName?: string;
    motherFullName?: string;
    justificationDocumentType?: DocumentJustificationType;
    justificationDocumentNumber?: string;
    cardExpirationDate?: string;
    createdAt: string;
    updatedAt: string;

    request?: IDemande;
}

export const DocumentJustificationTypeLabels: Record<DocumentJustificationType, string> = {
    [DocumentJustificationType.PASSPORT]: "Passeport",
    [DocumentJustificationType.NATIONAL_ID_CARD]: "Carte d'identité",
    [DocumentJustificationType.BIRTH_CERTIFICATE]: "Acte de naissance",
    [DocumentJustificationType.OTHER]: "Autre",
};