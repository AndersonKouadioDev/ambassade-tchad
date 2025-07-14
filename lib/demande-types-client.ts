// Types stricts pour les formulaires de demande (client), alignés sur interfaces.d.ts
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}
export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  OTHER = 'OTHER'
}
export enum PassportType {
  ORDINARY = 'ORDINARY',
  SERVICE = 'SERVICE',
  DIPLOMATIC = 'DIPLOMATIC'
}
export enum VisaType {
  SHORT_STAY = 'SHORT_STAY',
  LONG_STAY = 'LONG_STAY',
  TRANSIT = 'TRANSIT',
  OTHER = 'OTHER'
}
export enum JustificationDocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL_ID_CARD = 'NATIONAL_ID_CARD',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  OTHER = 'OTHER'
}
export enum OriginCountryParentRelationshipType {
  FATHER = 'FATHER',
  MOTHER = 'MOTHER'
}
export enum ServiceType {
  PASSPORT = 'PASSPORT',
  LAISSEZ_PASSER = 'LAISSEZ_PASSER',
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  CONSULAR_DOC = 'CONSULAR_DOC'
}

export const DOCUMENTS = [
  {
    key: ServiceType.PASSPORT,
    label: "Passeport",
    fields: [
      { name: "firstName", label: "Prénom", type: "text", required: true },
      { name: "lastName", label: "Nom", type: "text", required: true },
      { name: "birthDate", label: "Date de naissance", type: "date", required: true },
      { name: "birthPlace", label: "Lieu de naissance", type: "text", required: true },
      { name: "nationality", label: "Nationalité", type: "text", required: true },
      { name: "passportType", label: "Type de passeport", type: "select", required: true, options: Object.values(PassportType) },
      { name: "passportNumber", label: "Numéro de passeport", type: "text", required: false },
      { name: "profession", label: "Profession", type: "text", required: false },
      { name: "address", label: "Adresse", type: "text", required: false },
    ],
  },
  {
    key: ServiceType.LAISSEZ_PASSER,
    label: "Laissez-passer",
    fields: [
      { name: "firstName", label: "Prénom", type: "text", required: true },
      { name: "lastName", label: "Nom", type: "text", required: true },
      { name: "birthDate", label: "Date de naissance", type: "date", required: true },
      { name: "birthPlace", label: "Lieu de naissance", type: "text", required: true },
      { name: "nationality", label: "Nationalité", type: "text", required: true },
      { name: "destination", label: "Destination", type: "text", required: false },
      { name: "travelReason", label: "Motif du voyage", type: "text", required: false },
      { name: "accompanied", label: "Accompagné ?", type: "checkbox", required: false },
    ],
  },
  {
    key: ServiceType.POWER_OF_ATTORNEY,
    label: "Procuration",
    fields: [
      { name: "principalFirstName", label: "Prénom du donneur d'ordre", type: "text", required: true },
      { name: "principalLastName", label: "Nom du donneur d'ordre", type: "text", required: true },
      { name: "agentFirstName", label: "Prénom du mandataire", type: "text", required: true },
      { name: "agentLastName", label: "Nom du mandataire", type: "text", required: true },
      { name: "reason", label: "Motif", type: "text", required: false },
    ],
  },
  {
    key: ServiceType.CONSULAR_DOC,
    label: "Document consulaire",
    fields: [
      { name: "firstName", label: "Prénom", type: "text", required: true },
      { name: "lastName", label: "Nom", type: "text", required: true },
      { name: "typeDocument", label: "Type de document", type: "text", required: true },
      { name: "objet", label: "Objet", type: "text", required: false },
    ],
  },
];
