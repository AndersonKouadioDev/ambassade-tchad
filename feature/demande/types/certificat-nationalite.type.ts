import { IDemande } from "./demande.type";

export enum PaysParentType {
    FATHER = 'FATHER',
    MOTHER = 'MOTHER'
}

export interface ICertificatNationaliteDetails {
    id: string;
    requestId: string;
    applicantFirstName: string;
    applicantLastName: string;
    applicantBirthDate: string;
    applicantBirthPlace: string;
    applicantNationality: string;
    originCountryParentFirstName: string;
    originCountryParentLastName: string;
    originCountryParentRelationship: PaysParentType;
    createdAt: string;
    updatedAt: string;
    request?: IDemande;
}
