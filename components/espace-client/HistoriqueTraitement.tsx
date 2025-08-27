import { useTranslations } from 'next-intl';

interface Step {
  label: string;
  date: string;
  done: boolean;
}

interface HistoriqueTraitementProps {
  steps: Step[];
  progression: number;
  serviceType: string;
  status: string;
  submissionDate: string;
  estimatedCompletionDate?: string;
}

export default function HistoriqueTraitement({
  progression,
  serviceType,
  status,
  submissionDate,
  estimatedCompletionDate
}: HistoriqueTraitementProps) {
  const t = useTranslations('espaceClient');

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

  // Fonction pour traduire les statuts
  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      'NEW': 'Nouveau',
      'IN_REVIEW_DOCS': 'En cours de vérification de documents',
      'PENDING_ADDITIONAL_INFO': 'En attente de renseignements supplémentaires',
      'APPROVED_BY_AGENT': 'Approuvé par l\'agent',
      'APPROVED_BY_CHEF': 'Approuvé par le chef',
      'APPROVED_BY_CONSUL': 'Approuvé par le consul',
      'READY_FOR_PICKUP': 'Prêt à retirer',
      'DELIVERED': 'Retiré',
      'ARCHIVED': 'Archivé',
      'EXPIRED': 'Expiré',
      'RENEWAL_REQUESTED': 'Renouvellement demandé',
      'REJECTED': 'Rejeté',
    };
    return translations[status] || status;
  };

  // Calculer la date d'achèvement estimée (15 jours après la soumission par défaut)
  const getEstimatedCompletionDate = () => {
    if (estimatedCompletionDate) {
      return new Date(estimatedCompletionDate);
    }
    const submission = new Date(submissionDate);
    const estimated = new Date(submission);
    estimated.setDate(estimated.getDate() + 15); // 15 jours par défaut
    return estimated;
  };

  // Calculer les jours restants
  const getDaysRemaining = () => {
    const estimated = getEstimatedCompletionDate();
    const today = new Date();
    const diffTime = estimated.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const estimatedDate = getEstimatedCompletionDate();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-gray-50  rounded-lg p-4 md:p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900  mb-4">
        {t('historiqueTraitement.titre')}
      </h2>
      
      {/* Layout principal - empilement vertical sur mobile, horizontal sur desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Informations du service */}
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-700  min-w-[120px]">
                {t('historiqueTraitement.service')}:
              </span>
              <span className="text-gray-900  font-semibold">
                {translateServiceType(serviceType)}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-700  min-w-[120px]">
                {t('historiqueTraitement.statut')}:
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === 'REJECTED' ? 'bg-red-100 text-red-800 ' :
                status === 'DELIVERED' ? 'bg-green-100 text-green-800  ' :
                'bg-blue-100 text-blue-800  '
              }`}>
                {translateStatus(status)}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-700  min-w-[120px]">
                {t('historiqueTraitement.soumission')}:
              </span>
              <span className="text-gray-600  text-sm">
                {new Date(submissionDate).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Barre de progression - centrée sur mobile */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <div className="text-sm font-medium text-gray-700  mb-1">
              {t('historiqueTraitement.progression')}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-orange-500">{progression}%</span>
            </div>
          </div>
          <div className="w-32 h-2 bg-gray-200  rounded-full overflow-hidden">
            <div
              className="h-2 bg-orange-500 transition-all duration-500"
              style={{ width: `${progression}%` }}
            ></div>
          </div>
        </div>

        {/* Date d'achèvement - centrée sur mobile */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700  mb-1">
              {t('historiqueTraitement.achevementPrevu')}
            </div>
            <div className="text-gray-900  font-semibold text-sm mb-1">
              {estimatedDate.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              daysRemaining <= 3 ? 'bg-red-100 text-red-800 ' :
              daysRemaining <= 7 ? 'bg-orange-100 text-orange-800 ' :
              'bg-green-100 text-green-800 '
            }`}>
              {daysRemaining > 0 
                ? `${daysRemaining} ${t('historiqueTraitement.jours')}`
                : t('historiqueTraitement.enRetard')
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}