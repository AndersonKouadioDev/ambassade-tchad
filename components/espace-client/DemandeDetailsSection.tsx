import {BirthActRequestDetails, ConsularCardRequestDetails, MarriageCapacityActRequestDetails, NationalityCertificateRequestDetails, PowerOfAttorneyRequestDetails, VisaRequestDetails } from '@/lib/validation/details-request.validation';
import Image from 'next/image';
interface Document {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface DemandeDetailsSectionProps {
  demande?: {
    id: string;
    ticketNumber: string;
    serviceType: string;
    status: string;
    submissionDate: string;
    updatedAt: string;
    completionDate: string | null;
    issuedDate: string | null;
    contactPhoneNumber: string;
    observations: string | null;
    amount: number;
    documents?: Document[];
    visaDetails: VisaRequestDetails;
    birthActDetails: BirthActRequestDetails;
    consularCardDetails: ConsularCardRequestDetails;
    laissezPasserDetails: any;
    marriageCapacityActDetails: MarriageCapacityActRequestDetails;
    deathActDetails: any;
    powerOfAttorneyDetails: PowerOfAttorneyRequestDetails;
    nationalityCertificateDetails: NationalityCertificateRequestDetails;
  };
}

export default function DemandeDetailsSection({ demande }: DemandeDetailsSectionProps) {
  // Fonction pour traduire les types de service
  const translateServiceType = (serviceType: string) => {
    const translations: Record<string, string> = {
      'CONSULAR_CARD': 'Carte Consulaire',
      'POWER_OF_ATTORNEY': 'Procuration',
      'MARRIAGE_CAPACITY_ACT': 'Acte de Capacité de Mariage',
      'LAISSEZ_PASSER': 'Laissez-passer',
      'DEATH_ACT_APPLICATION': 'Acte de Décès',
      'NATIONALITY_CERTIFICATE': 'Certificat de Nationalité',
      'BIRTH_ACT_APPLICATION': 'Acte de Naissance',
      'VISA': 'Visa',
    };
    return translations[serviceType] || serviceType;
  };

  // Fonction pour traduire les valeurs d'enum
  const translateEnum = (value: string, type: string) => {
    const maps: Record<string, Record<string, string>> = {
      Gender: { MALE: 'Homme', FEMALE: 'Femme', OTHER: 'Autre' },
      MaritalStatus: { SINGLE: 'Célibataire', MARRIED: 'Marié(e)', DIVORCED: 'Divorcé(e)', WIDOWED: 'Veuf(ve)', OTHER: 'Autre' },
      VisaType: { SHORT_STAY: 'Court séjour', LONG_STAY: 'Long séjour' },
      PassportType: { ORDINARY: 'Ordinaire', SERVICE: 'Service', DIPLOMATIC: 'Diplomatique' },
      BirthActRequestType: { NEWBORN: 'Nouveau-né', RENEWAL: 'Renouvellement' },
      OriginCountryParentRelationshipType: { FATHER: 'Père', MOTHER: 'Mère' },
    };
    return maps[type]?.[value] || value;
  };

  // Fonction pour obtenir les champs selon le type de service
  const getFields = () => {
    if (!demande) return [];

    const baseFields = [
      ['Numéro de ticket', demande.ticketNumber],
      ['Type de service', translateServiceType(demande.serviceType)],
      ['Statut', demande.status],
      ['Date de soumission', new Date(demande.submissionDate).toLocaleDateString('fr-FR')],
      ['Montant', `${demande.amount.toLocaleString()} FCFA`],
      ['Téléphone de contact', demande.contactPhoneNumber],
    ];

    // Ajouter les champs spécifiques selon le type de service
    switch (demande.serviceType) {
      case 'VISA':
        if (demande.visaDetails) {
          return [
            ...baseFields,
            ['Prénom', demande.visaDetails.personFirstName],
            ['Nom', demande.visaDetails.personLastName],
            ['Genre', translateEnum(demande.visaDetails.personGender, 'Gender')],
            ['Nationalité', demande.visaDetails.personNationality],
            ['Date de naissance', new Date(demande.visaDetails.personBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance', demande.visaDetails.personBirthPlace],
            ['État civil', translateEnum(demande.visaDetails.personMaritalStatus, 'MaritalStatus')],
            ['Type de passeport', translateEnum(demande.visaDetails.passportType, 'PassportType')],
            ['Numéro de passeport', demande.visaDetails.passportNumber],
            ['Délivré par', demande.visaDetails.passportIssuedBy],
            ['Date de délivrance', new Date(demande.visaDetails.passportIssueDate).toLocaleDateString('fr-FR')],
            ['Date d\'expiration', new Date(demande.visaDetails.passportExpirationDate).toLocaleDateString('fr-FR')],
            ['Profession', demande.visaDetails.profession],
            ['Adresse employeur', demande.visaDetails.employerAddress],
            ['Téléphone employeur', demande.visaDetails.employerPhoneNumber],
            ['Type de visa', translateEnum(demande.visaDetails.visaType, 'VisaType')],
            ['Durée (mois)', demande.visaDetails.durationMonths?.toString()],
            ['Destination', demande.visaDetails.destinationState],
          ];
        }
        break;
      case 'LAISSEZ_PASSER':
        if (demande.laissezPasserDetails) {
          const fields = [
            ...baseFields,
            ['Prénom', demande.laissezPasserDetails.personFirstName],
            ['Nom', demande.laissezPasserDetails.personLastName],
            ['Date de naissance', new Date(demande.laissezPasserDetails.personBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance', demande.laissezPasserDetails.personBirthPlace],
            ['Profession', demande.laissezPasserDetails.personProfession],
            ['Nationalité', demande.laissezPasserDetails.personNationality],
            ['Domicile', demande.laissezPasserDetails.personDomicile],
            ['Destination', demande.laissezPasserDetails.destination],
            ['Raison du voyage', demande.laissezPasserDetails.travelReason],
            ['Accompagné', demande.laissezPasserDetails.accompanied ? 'Oui' : 'Non'],
          ];
          // Affichage des accompagnateurs si accompagné
          if (demande.laissezPasserDetails.accompanied && demande.laissezPasserDetails.accompaniers?.length) {
            fields.push(['Accompagnateurs',
              demande.laissezPasserDetails.accompaniers.map((acc: any) =>
                `${acc.firstName} ${acc.lastName} (${new Date(acc.birthDate).toLocaleDateString('fr-FR')}, ${acc.nationality})`
              ).join(' ; ')
            ]);
          }
          return fields;
        }
        break;
      case 'CONSULAR_CARD':
        if (demande.consularCardDetails) {
          return [
            ...baseFields,
            ['Prénom', demande.consularCardDetails.personFirstName],
            ['Nom', demande.consularCardDetails.personLastName],
            ['Date de naissance', new Date(demande.consularCardDetails.personBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance', demande.consularCardDetails.personBirthPlace],
            ['Profession', demande.consularCardDetails.personProfession],
            ['Nationalité', demande.consularCardDetails.personNationality],
            ['Domicile', demande.consularCardDetails.personDomicile],
            ['Adresse au pays d\'origine', demande.consularCardDetails.personAddressInOriginCountry],
            ['Nom du père', demande.consularCardDetails.fatherFullName],
            ['Nom de la mère', demande.consularCardDetails.motherFullName],
            ['Type de pièce justificative', demande.consularCardDetails.justificationDocumentType],
            ['Numéro de pièce', demande.consularCardDetails.justificationDocumentNumber],
            ['Date d\'expiration de la carte', demande.consularCardDetails.cardExpirationDate ? new Date(demande.consularCardDetails.cardExpirationDate).toLocaleDateString('fr-FR') : ''],
          ];
        }
        break;
      case 'POWER_OF_ATTORNEY':
        if (demande.powerOfAttorneyDetails) {
          return [
            ...baseFields,
            ['Prénom de l\'agent', demande.powerOfAttorneyDetails.agentFirstName],
            ['Nom de l\'agent', demande.powerOfAttorneyDetails.agentLastName],
            ['Type de pièce agent', demande.powerOfAttorneyDetails.agentJustificationDocumentType],
            ['Numéro pièce agent', demande.powerOfAttorneyDetails.agentIdDocumentNumber],
            ['Adresse de l\'agent', demande.powerOfAttorneyDetails.agentAddress],
            ['Prénom du principal', demande.powerOfAttorneyDetails.principalFirstName],
            ['Nom du principal', demande.powerOfAttorneyDetails.principalLastName],
            ['Type de pièce principal', demande.powerOfAttorneyDetails.principalJustificationDocumentType],
            ['Numéro pièce principal', demande.powerOfAttorneyDetails.principalIdDocumentNumber],
            ['Adresse du principal', demande.powerOfAttorneyDetails.principalAddress],
            ['Type de procuration', demande.powerOfAttorneyDetails.powerOfType],
            ['Raison', demande.powerOfAttorneyDetails.reason],
          ];
        }
        break;
      case 'BIRTH_ACT_APPLICATION':
        if (demande.birthActDetails) {
          return [
            ...baseFields,
            ['Prénom', demande.birthActDetails.personFirstName],
            ['Nom', demande.birthActDetails.personLastName],
            ['Date de naissance', new Date(demande.birthActDetails.personBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance', demande.birthActDetails.personBirthPlace],
            ['Nationalité', demande.birthActDetails.personNationality],
            ['Domicile', demande.birthActDetails.personDomicile],
            ['Nom du père', demande.birthActDetails.fatherFullName],
            ['Nom de la mère', demande.birthActDetails.motherFullName],
            ['Type de demande', demande.birthActDetails.requestType],
          ];
        }
        break;
      case 'DEATH_ACT_APPLICATION':
        if (demande.deathActDetails) {
          return [
            ...baseFields,
            ['Prénom du défunt', demande.deathActDetails.deceasedFirstName],
            ['Nom du défunt', demande.deathActDetails.deceasedLastName],
            ['Date de naissance', new Date(demande.deathActDetails.deceasedBirthDate).toLocaleDateString('fr-FR')],
            ['Date de décès', new Date(demande.deathActDetails.deceasedDeathDate).toLocaleDateString('fr-FR')],
            ['Nationalité', demande.deathActDetails.deceasedNationality],
          ];
        }
        break;
      case 'MARRIAGE_CAPACITY_ACT':
        if (demande.marriageCapacityActDetails) {
          return [
            ...baseFields,
            ['Prénom du mari', demande.marriageCapacityActDetails.husbandFirstName],
            ['Nom du mari', demande.marriageCapacityActDetails.husbandLastName],
            ['Date de naissance mari', new Date(demande.marriageCapacityActDetails.husbandBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance mari', demande.marriageCapacityActDetails.husbandBirthPlace],
            ['Nationalité mari', demande.marriageCapacityActDetails.husbandNationality],
            ['Domicile mari', demande.marriageCapacityActDetails.husbandDomicile],
            ['Prénom de l\'épouse', demande.marriageCapacityActDetails.wifeFirstName],
            ['Nom de l\'épouse', demande.marriageCapacityActDetails.wifeLastName],
            ['Date de naissance épouse', new Date(demande.marriageCapacityActDetails.wifeBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance épouse', demande.marriageCapacityActDetails.wifeBirthPlace],
            ['Nationalité épouse', demande.marriageCapacityActDetails.wifeNationality],
            ['Domicile épouse', demande.marriageCapacityActDetails.wifeDomicile],
          ];
        }
        break;
      case 'NATIONALITY_CERTIFICATE':
        if (demande.nationalityCertificateDetails) {
          return [
            ...baseFields,
            ['Prénom', demande.nationalityCertificateDetails.applicantFirstName],
            ['Nom', demande.nationalityCertificateDetails.applicantLastName],
            ['Date de naissance', new Date(demande.nationalityCertificateDetails.applicantBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance', demande.nationalityCertificateDetails.applicantBirthPlace],
            ['Nationalité', demande.nationalityCertificateDetails.applicantNationality],
            ['Prénom parent origine', demande.nationalityCertificateDetails.originCountryParentFirstName],
            ['Nom parent origine', demande.nationalityCertificateDetails.originCountryParentLastName],
            ['Lien parenté', translateEnum(demande.nationalityCertificateDetails.originCountryParentRelationship, 'OriginCountryParentRelationshipType')],
          ];
        }
        break;
      default:
        return baseFields;
    }

    return baseFields;
  };

  const fields = getFields();

  if (!demande) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-md">
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-medium">Aucune donnée de demande disponible</h3>
          <p className="mt-2">Veuillez sélectionner une demande pour afficher les détails</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden printable">
      {/* Logo Ambassade (affiché en haut, visible à l'écran et à l'impression) */}
      <div className="flex justify-center items-center flex-col py-4 print:py-2">
        <Image
          src="/assets/images/logo.png"
          alt="Logo Ambassade du Tchad"
          className="h-20 w-auto mb-2 print:mb-0"
          width={100}
          height={100}
          style={{ maxHeight: '80px', objectFit: 'contain' }}
        />
        <div className="text-center">
          <div className="font-bold text-lg md:text-2xl text-gray-900 print:text-black">Ambassade de la République du Tchad</div>
          <div className="text-sm md:text-base text-gray-700 print:text-black">Section Consulaire</div>
          <div className="text-xs md:text-sm text-gray-600 print:text-black mt-1">
           Abidjan, cocody 2 Plateaux vallons, Côte d'Ivoire<br/>
            Tél : +225 01245578485 &nbsp;|&nbsp; Email : contact@ambassade-tchad.com
          </div>
        </div>
      </div>
      {/* En-tête avec fond coloré */}
      <div className="bg-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Détails de la demande
            </h2>
            <p className="text-blue-100 mt-1">
              {translateServiceType(demande.serviceType)} • N° {demande.ticketNumber}
            </p>
          </div>
          <div className="bg-white/20 rounded-full px-4 py-1 text-sm font-medium text-white">
            {demande.status}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Informations générales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.slice(0, 6).map(([label, value], idx) => (
              <div key={idx} className="space-y-1">
                <label className="block text-sm font-medium text-gray-500">{label}</label>
                <div className="text-gray-900 font-medium p-2 rounded bg-gray-50">
                  {value || <span className="text-gray-400">Non renseigné</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Détails spécifiques */}
        {fields.length > 6 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Détails spécifiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.slice(6).map(([label, value], idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-500">{label}</label>
                  <div className="text-gray-900 font-medium p-2 rounded bg-gray-50">
                    {value || <span className="text-gray-400">Non renseigné</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observations */}
        {demande.observations && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Observations
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
              <p className="text-gray-800 italic">{demande.observations}</p>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
            onClick={() => window.print()}
          >
            Imprimer
          </button>
          {/* <button className="px-6 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition">
            Modifier la demande
          </button> */}
        </div>
      </div>
    </div>
  );
}