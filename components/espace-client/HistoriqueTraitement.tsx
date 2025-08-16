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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('historiqueTraitement.titre')}
        </h2>
        <div className="text-gray-700 dark:text-gray-200 text-sm mb-1">
          {t('historiqueTraitement.service')}: {translateServiceType(serviceType)}
        </div>
        <div className="text-gray-700 dark:text-gray-200 text-sm mb-1">
          {t('historiqueTraitement.statut')}: {translateStatus(status)}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-xs">
          {t('historiqueTraitement.soumission')}: {new Date(submissionDate).toLocaleDateString('fr-FR')}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {t('historiqueTraitement.progression')}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-500">{progression}%</span>
          <div className="w-20 md:w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-2 bg-orange-500 transition-all duration-500"
              style={{ width: `${progression}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {t('historiqueTraitement.achevementPrevu')}
        </div>
        <div className="text-gray-700 dark:text-gray-200 text-sm">
          {estimatedDate.toLocaleDateString('fr-FR')}
        </div>
        <div className={`text-sm font-medium ${daysRemaining <= 3 ? 'text-red-500' : daysRemaining <= 7 ? 'text-orange-500' : 'text-green-500'}`}>
          {daysRemaining > 0 ? `${daysRemaining} ${t('historiqueTraitement.jours')}` : t('historiqueTraitement.enRetard')}
        </div>
      </div>
    </div>
  );
} 