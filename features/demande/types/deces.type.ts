import { IDemande } from "./demande.type";

export interface IDecesDetails {
    id: string;
    requestId: string;
    deceasedFirstName: string;
    deceasedLastName: string;
    deceasedBirthDate: string;
    deceasedDeathDate: string;
    deceasedNationality: string;
    createdAt: string;
    updatedAt: string;

    request?: IDemande;
}