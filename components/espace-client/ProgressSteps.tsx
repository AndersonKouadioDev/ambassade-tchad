import React from 'react';
import { useTranslations } from 'next-intl';

interface ProgressStepsProps {
  percent: number;
  steps: number;
  labels?: React.ReactNode[];
}

export default function ProgressSteps({ percent, steps, labels }: ProgressStepsProps) {
  const t = useTranslations('espaceClient.dashboard.progressSteps');
  
  // Calcul du nombre d'étapes complétées (entier)
  const completed = Math.floor((percent / 100) * steps);
  // Calcul de la fraction de la prochaine étape (pour la barre partielle)
  const progressInStep = ((percent / 100) * steps) - completed;
  return (
    <div className="w-full flex flex-col items-center mt-2">
      {/* Barre de progression */}
      <div className="flex items-center w-full max-w-full sm:max-w-2xl lg:max-w-6xl mx-auto px-1 sm:px-4 lg:px-0">
        {[...Array(steps)].map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${i < completed ? 'bg-white border-orange-500' : 'bg-transparent border-gray-300'}`}></div>
            {i < steps - 1 && (
              <div className="h-1.5 sm:h-2 lg:h-1 flex-1 relative bg-orange-500/30 mx-2 sm:mx-4 lg:mx-0">
                {/* Barre pleine pour les étapes complétées */}
                {i < completed - 1 && (
                  <div className="absolute top-0 left-0 h-1.5 sm:h-2 lg:h-1 bg-orange-500 transition-all duration-300" style={{ width: '100%' }} />
                )}
                {/* Barre partielle pour l'étape en cours */}
                {i === completed && progressInStep > 0 && (
                  <div className="absolute top-0 left-0 h-1.5 sm:h-2 lg:h-1 bg-orange-500 transition-all duration-300" style={{ width: `${progressInStep * 100}%` }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Labels des étapes - maintenant visibles sur mobile avec texte tronqué */}
      <div className="flex justify-between w-full max-w-full sm:max-w-2xl lg:max-w-6xl mx-auto mt-3 text-xs lg:text-sm text-gray-900 dark:text-gray-200 font-semibold px-1 sm:px-4 lg:px-0">
        {[...Array(steps)].map((_, i) => {
          // Mots courts pour chaque étape
          const shortLabels = ['Dépôt', 'Vérif', 'Trait', 'Valid', 'Finalis', 'Retrait'];
          return (
            <span key={i} className="flex-1 text-center leading-tight px-0.5 lg:w-32">
              <div className="sm:hidden text-xs">
                {shortLabels[i] || `Ét.${i + 1}`}
              </div>
              <div className="hidden sm:block lg:hidden text-xs">
                Étape {i + 1}
              </div>
              <div className="hidden lg:block">
                {labels && labels[i] ? labels[i] : <><div>{t('processus')}</div><div>{t('deTraitement')}</div></>}
              </div>
            </span>
          );
        })}
      </div>
    </div>
  );
} 