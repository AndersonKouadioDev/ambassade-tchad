import { DocumentJustificationType } from "./carte-consulaire.type";
import { IDemande } from "./demande.type";

export interface ILaissezPasserDetails {
    id: string;
    requestId: string;
    personFirstName: string;
    personLastName: string;
    personBirthDate: string;
    personBirthPlace: string;
    personProfession?: string;
    personNationality: string;
    personDomicile?: string;
    fatherFullName?: string;
    motherFullName?: string;
    destination?: string;
    travelReason?: string;
    accompanied: boolean;
    justificationDocumentType?: DocumentJustificationType;
    justificationDocumentNumber?: string;
    laissezPasserExpirationDate: string;
    createdAt: string;
    updatedAt: string;

    accompaniers?: IAccompagnateur[];

    request?: IDemande;
}


export interface IAccompagnateur {
    id: string;
    laissezPasserRequestDetailsId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    birthPlace: string;
    nationality: string;
    domicile?: string;
    createdAt: string;
    updatedAt: string;
}