export enum ServiceType {
  VISA = 'VISA',
  BIRTH_ACT = 'BIRTH_ACT',
  CONSULAR_CARD = 'CONSULAR_CARD',
  LAISSEZ_PASSER = 'LAISSEZ_PASSER',
  MARRIAGE_CAPACITY_ACT = 'MARRIAGE_CAPACITY_ACT',
  DEATH_ACT = 'DEATH_ACT',
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  NATIONALITY_CERTIFICATE = 'NATIONALITY_CERTIFICATE'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

export enum PassportType {
  ORDINARY = 'ORDINARY',
  DIPLOMATIC = 'DIPLOMATIC',
  SERVICE = 'SERVICE'
}

export enum VisaType {
  SHORT_STAY = 'SHORT_STAY',
  LONG_STAY = 'LONG_STAY',
  TRANSIT = 'TRANSIT',
  BUSINESS = 'BUSINESS',
  STUDENT = 'STUDENT',
  WORK = 'WORK'
}

export interface VisaRequestDetails {
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personNationality: string;
  personBirthDate: string;
  personBirthPlace: string;
  personMaritalStatus: MaritalStatus;
  passportType: PassportType;
  passportNumber: string;
  passportIssuedBy: string;
  passportIssueDate: string;
  passportExpirationDate: string;
  profession?: string;
  employerAddress?: string;
  employerPhoneNumber?: string;
  durationMonths: number;
  destinationState?: string;
  visaType?: VisaType;
}

export interface CreateDemandRequest {
  serviceType: ServiceType;
  visaDetails?: string; // JSON stringified VisaRequestDetails
  birthActDetails?: string;
  consularCardDetails?: string;
  laissezPasserDetails?: string;
  marriageCapacityActDetails?: string;
  deathActDetails?: string;
  powerOfAttorneyDetails?: string;
  nationalityCertificateDetails?: string;
  contactPhoneNumber?: string;
  documents?: File[];
}

export interface VisaFormData {
  // Informations personnelles
  personFirstName: string;
  personLastName: string;
  personGender: Gender;
  personNationality: string;
  personBirthDate: string;
  personBirthPlace: string;
  personMaritalStatus: MaritalStatus;
  
  // Informations du passeport
  passportType: PassportType;
  passportNumber: string;
  passportIssuedBy: string;
  passportIssueDate: string;
  passportExpirationDate: string;
  
  // Informations professionnelles
  profession?: string;
  employerAddress?: string;
  employerPhoneNumber?: string;
  
  // Informations du visa
  durationMonths: number;
  destinationState?: string;
  visaType?: VisaType;
  
  // Contact
  contactPhoneNumber?: string;
  
  // Documents
  documents?: File[];
}

export interface VisaFormErrors {
  personFirstName?: string;
  personLastName?: string;
  personGender?: string;
  personNationality?: string;
  personBirthDate?: string;
  personBirthPlace?: string;
  personMaritalStatus?: string;
  passportType?: string;
  passportNumber?: string;
  passportIssuedBy?: string;
  passportIssueDate?: string;
  passportExpirationDate?: string;
  profession?: string;
  employerAddress?: string;
  employerPhoneNumber?: string;
  durationMonths?: string;
  destinationState?: string;
  visaType?: string;
  contactPhoneNumber?: string;
  documents?: string;
}

export interface VisaFormState {
  data: VisaFormData;
  errors: VisaFormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  isValid: boolean;
} 