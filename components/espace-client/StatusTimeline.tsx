import { useTranslations } from 'next-intl';
import { CheckCircle, Clock, FileText, UserCheck, Package } from 'lucide-react';

interface StatusStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

interface StatusTimelineProps {
  currentStatus: string;
  submissionDate: string;
  updatedAt: string;
  completionDate?: string | null;
  issuedDate?: string | null;
}

export default function StatusTimeline({
  currentStatus,
  submissionDate,
  updatedAt,
  completionDate,
  issuedDate
}: StatusTimelineProps) {
  const t = useTranslations('espaceClient.statusTimeline');

  const getStatusSteps = (): StatusStep[] => {
    const steps: StatusStep[] = [
      {
        id: 'submitted',
        label: t('etapes.soumission.titre'),
        description: t('etapes.soumission.description'),
        icon: <FileText className="w-5 h-5" />,
        status: 'completed',
        date: submissionDate
      },
      {
        id: 'review',
        label: t('etapes.verification.titre'),
        description: t('etapes.verification.description'),
        icon: <UserCheck className="w-5 h-5" />,
        status: currentStatus === 'NEW' ? 'current' : 
               ['IN_PROGRESS', 'PENDING', 'READY_TO_PICKUP', 'COMPLETED'].includes(currentStatus) ? 'completed' : 'pending',
        date: currentStatus !== 'NEW' ? updatedAt : undefined
      },
      {
        id: 'processing',
        label: t('etapes.traitement.titre'),
        description: t('etapes.traitement.description'),
        icon: <Clock className="w-5 h-5" />,
        status: currentStatus === 'IN_PROGRESS' ? 'current' : 
               ['PENDING', 'READY_TO_PICKUP', 'COMPLETED'].includes(currentStatus) ? 'completed' : 'pending',
        date: ['PENDING', 'READY_TO_PICKUP', 'COMPLETED'].includes(currentStatus) ? updatedAt : undefined
      },
      {
        id: 'ready',
        label: t('etapes.pret.titre'),
        description: t('etapes.pret.description'),
        icon: <Package className="w-5 h-5" />,
        status: currentStatus === 'READY_TO_PICKUP' ? 'current' : 
               currentStatus === 'COMPLETED' ? 'completed' : 'pending',
        date: currentStatus === 'COMPLETED' ? issuedDate : undefined
      },
      {
        id: 'completed',
        label: t('etapes.termine.titre'),
        description: t('etapes.termine.description'),
        icon: <CheckCircle className="w-5 h-5" />,
        status: currentStatus === 'COMPLETED' ? 'completed' : 'pending',
        date: completionDate
      }
    ];

    return steps;
  };

  const steps = getStatusSteps();

  const getStatusColor = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'current':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'pending':
        return 'text-gray-400 bg-gray-100 border-gray-200';
    }
  };

  // const getLineColor = (status: 'completed' | 'current' | 'pending') => {
  //   switch (status) {
  //     case 'completed':
  //       return 'bg-green-500';
  //     case 'current':
  //       return 'bg-orange-500';
  //     case 'pending':
  //       return 'bg-gray-300';
  //   }
  // };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t('titre')}
      </h3>
      
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start mb-6 last:mb-0">
            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-10 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            {/* Icône et cercle */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4 ${getStatusColor(step.status)}`}>
              {step.icon}
            </div>
            
            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`text-lg font-semibold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {step.label}
                </h4>
                {step.date && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(step.date).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
              <p className={`text-sm ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {step.description}
              </p>
              
              {/* Indicateur de statut actuel */}
              {step.status === 'current' && (
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {t('enCours')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 