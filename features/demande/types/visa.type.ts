import { Genre, IDemande, SituationMatrimoniale } from "./demande.type";

export enum PassportType {
    ORDINARY = 'ORDINARY',
    SERVICE = 'SERVICE',
    DIPLOMATIC = 'DIPLOMATIC'
  }
  
  export enum VisaType {
    SHORT_STAY = 'SHORT_STAY',
    LONG_STAY = 'LONG_STAY',
  }
  

export interface IVisaDetails {
    id: string;
    requestId: string;
    personFirstName: string;
    personLastName: string;
    personGender: Genre;
    personNationality: string;
    personBirthDate: string;
    personBirthPlace: string;
    personMaritalStatus: SituationMatrimoniale;
    passportType: PassportType;
    passportNumber: string;
    passportIssuedBy: string;
    passportIssueDate: string;
    passportExpirationDate: string;
    profession?: string;
    employerAddress?: string;
    employerPhoneNumber?: string;
    visaType: VisaType;
    durationMonths: number;
    destinationState?: string;
    visaExpirationDate?: string;
    createdAt: string;
    updatedAt: string;

    request?: IDemande;

}
