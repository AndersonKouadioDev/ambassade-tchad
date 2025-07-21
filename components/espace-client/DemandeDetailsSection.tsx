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
    visaDetails: any;
    birthActDetails: any;
    consularCardDetails: any;
    laissezPasserDetails: any;
    marriageCapacityActDetails: any;
    deathActDetails: any;
    powerOfAttorneyDetails: any;
    nationalityCertificateDetails: any;
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
            ['Genre', demande.visaDetails.personGender],
            ['Nationalité', demande.visaDetails.personNationality],
            ['Date de naissance', new Date(demande.visaDetails.personBirthDate).toLocaleDateString('fr-FR')],
            ['Lieu de naissance', demande.visaDetails.personBirthPlace],
            ['Profession', demande.visaDetails.profession],
            ['Type de visa', demande.visaDetails.visaType],
            ['Durée (mois)', demande.visaDetails.durationMonths?.toString()],
            ['Destination', demande.visaDetails.destinationState],
          ];
        }
        break;

      case 'LAISSEZ_PASSER':
        if (demande.laissezPasserDetails) {
          return [
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
            ['Nom du père', demande.consularCardDetails.fatherFullName],
            ['Nom de la mère', demande.consularCardDetails.motherFullName],
          ];
        }
        break;

      case 'POWER_OF_ATTORNEY':
        if (demande.powerOfAttorneyDetails) {
          return [
            ...baseFields,
            ['Prénom de l\'agent', demande.powerOfAttorneyDetails.agentFirstName],
            ['Nom de l\'agent', demande.powerOfAttorneyDetails.agentLastName],
            ['Adresse de l\'agent', demande.powerOfAttorneyDetails.agentAddress],
            ['Prénom du principal', demande.powerOfAttorneyDetails.principalFirstName],
            ['Nom du principal', demande.powerOfAttorneyDetails.principalLastName],
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

      default:
        return baseFields;
    }

    return baseFields;
  };

  const fields = getFields();

  if (!demande) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8 shadow-sm">
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg mb-2">📋</div>
          Aucune donnée de demande disponible
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8 shadow-sm">
      <div className="flex flex-col gap-2 mb-4">
        <div className="text-2xl font-bold text-gray-900">
          Détails spécifiques de la demande de {translateServiceType(demande.serviceType).toLowerCase()}
        </div>
        <div className="text-base text-gray-900 font-semibold">Informations fournies</div>
        <div className="text-sm text-gray-400 italic">
          Vous trouverez ici le résumé des informations renseignées lors de votre demande. Ces informations peuvent être mises à jour en cas de besoins.
        </div>
      </div>
      <div className="flex flex-col mb-8">
        {fields.map((pair, idx) => (
          pair[0] === 'Observations' ? (
            <div key={idx} className="flex flex-row mb-4">
              <div className="w-[41rem]">
                <div className={`w-[41rem] rounded-full px-6 py-2 text-gray-900 text-base font-normal focus:outline-none cursor-default text-ellipsis overflow-hidden whitespace-nowrap ${pair[1] ? 'border border-gray-300 bg-gray-50' : 'border border-transparent bg-transparent'}`}>
                  {pair[1] || ''}
                </div>
              </div>
            </div>
          ) : (
            <div key={idx} className="flex flex-row gap-x-6 mb-4">
              <div className="w-80">
                <div className="w-80 rounded-full px-6 py-2 text-gray-600 text-base font-semibold focus:outline-none cursor-default">
                  {pair[0]}
                </div>
              </div>
              <div className="w-80">
                <div className={`w-80 rounded-full px-6 py-2 text-gray-900 text-base font-normal focus:outline-none cursor-default text-ellipsis overflow-hidden whitespace-nowrap ${pair[1] ? 'border border-gray-300 bg-gray-50' : 'border border-transparent bg-transparent'}`}>
                  {pair[1] || ''}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      <div className="flex lg:ml-[400px] mr-10">
        <button className="bg-orange-500 text-white rounded-lg px-16 py-3 font-semibold text-base shadow-md hover:bg-orange-600 transition">
          Modifier
        </button>
      </div>
    </div>
  );
} 