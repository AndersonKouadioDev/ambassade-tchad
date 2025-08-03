// ==================== ENUMS ====================

export enum Role {
  AGENT = 'AGENT',
  CHEF_SERVICE = 'CHEF_SERVICE',
  CONSUL = 'CONSUL',
  ADMIN = 'ADMIN'
}

export enum UserType {
  DEMANDEUR = 'DEMANDEUR',
  PERSONNEL = 'PERSONNEL'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}

export enum ServiceType {
  PASSEPORT = 'PASSEPORT',
  VISA = 'VISA',
  CARTE_CONSULAIRE = 'CARTE_CONSULAIRE',
  AUTRE = 'AUTRE'
}

// export enum VisaType {
//   SHORT_STAY = 'SHORT_STAY',
//   LONG_STAY = 'LONG_STAY',
// }

export enum JustificationDocumentType {
  ACTE_NAISSANCE = 'ACTE_NAISSANCE',
  BULLETIN_NOTE = 'BULLETIN_NOTE',
  ATTESTATION_TRAVAIL = 'ATTESTATION_TRAVAIL',
  AUTRE = 'AUTRE'
}
