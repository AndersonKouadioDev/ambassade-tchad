import { IDemande } from "./demande.type";

export interface IMariageDetails {
    id: string;
    requestId: string;
    husbandFirstName: string;
    husbandLastName: string;
    husbandBirthDate: string;
    husbandBirthPlace: string;
    husbandNationality: string;
    husbandDomicile?: string;
    wifeFirstName: string;
    wifeLastName: string;
    wifeBirthDate: string;
    wifeBirthPlace: string;
    wifeNationality: string;
    wifeDomicile?: string;
    createdAt: string;
    updatedAt: string;

    request?: IDemande;
}