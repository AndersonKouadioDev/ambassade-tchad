import React from 'react';
import { useTranslations } from 'next-intl';

interface ProgressStepsProps {
  percent: number;
  steps: number;
  labels?: React.ReactNode[];
}

export default function ProgressSteps({ percent, steps, labels }: ProgressStepsProps) {
  const t = useTranslations('espaceClient.dashboard.progressSteps');
  
  // Limiter à 7 étapes maximum
  const maxSteps = Math.min(steps, 7);
  
  // Calcul du nombre d'étapes complétées (entier)
  const completed = Math.floor((percent / 100) * maxSteps);
  // Calcul de la fraction de la prochaine étape (pour la barre partielle)
  const progressInStep = ((percent / 100) * maxSteps) - completed;
  
  return (
    <div className="w-full flex flex-col items-center mt-2 px-1 sm:px-2 md:px-4">
      {/* Barre de progression - conteneur avec défilement horizontal si nécessaire */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex items-center min-w-max mx-auto px-1 sm:px-2">
          {[...Array(maxSteps)].map((_, i) => (
            <React.Fragment key={i}>
              {/* Cercle d'étape */}
              <div className="flex flex-col items-center relative z-10 min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem]">
                <div className={`
                  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 
                  rounded-full border-2 flex items-center justify-center 
                  transition-all duration-300 shrink-0
                  ${i < completed 
                    ? 'bg-orange-500 border-orange-500' 
                    : i === completed && progressInStep > 0
                    ? 'bg-orange-100 border-orange-500'
                    : 'bg-white border-gray-300  '
                  }
                `}>
                  {i < completed && (
                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {i === completed && progressInStep > 0 && (
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></div>
                  )}
                </div>
                
                {/* Label au-dessus sur mobile */}
                <span className="lg:hidden text-[10px] xs:text-xs font-medium text-gray-700  mt-1 text-center leading-tight px-0.5 whitespace-nowrap">
                  {i === 0 ? t('depot') : 
                   i === 1 ? t('verification') : 
                   i === 2 ? t('traitement') : 
                   i === 3 ? t('validation') : 
                   i === 4 ? t('finalisation') : 
                   i === 5 ? t('pret') :
                   t('retrait')}
                </span>
              </div>
              
              {/* Barre de connexion entre les étapes */}
              {i < maxSteps - 1 && (
                <div className="h-1 sm:h-1.5 w-8 sm:w-12 md:w-16 lg:w-20 mx-0.5 sm:mx-1 relative bg-gray-200  rounded-full overflow-hidden shrink-0">
                  {/* Barre pleine pour les étapes complétées */}
                  {i < completed && (
                    <div className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-300 w-full" />
                  )}
                  {/* Barre partielle pour l'étape en cours */}
                  {i === completed && progressInStep > 0 && (
                    <div 
                      className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-300" 
                      style={{ width: `${progressInStep * 100}%` }} 
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Labels des étapes - version desktop (toujours affichés pour maxSteps <= 7) */}
      <div className="hidden lg:flex justify-between w-full max-w-5xl mx-auto mt-3 text-sm text-gray-700  font-medium">
        {[...Array(maxSteps)].map((_, i) => (
          <div key={i} className="flex-1 text-center px-1 first:text-left last:text-right min-w-0">
            <div className="leading-tight">
              {labels && labels[i] ? labels[i] : (
                <>
                  <div className="font-semibold text-gray-900 ">
                    {t(`step${i + 1}`)}
                  </div>
                  <div className="text-xs text-gray-500  mt-0.5">
                    {t(`description${i + 1}`)}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Labels des étapes - version tablette (texte simplifié) */}
      <div className="hidden md:flex lg:hidden justify-between w-full max-w-3xl mx-auto mt-3 text-xs text-gray-700  font-medium">
        {[...Array(maxSteps)].map((_, i) => (
          <div key={i} className="text-center px-0.5 min-w-0">
            <div className="truncate">
              {i === 0 ? t('depot') : 
               i === 1 ? t('verifCourt') : 
               i === 2 ? t('traitCourt') : 
               i === 3 ? t('validCourt') : 
               i === 4 ? t('finalCourt') : 
               i === 5 ? t('pretCourt') :
               t('retraitCourt')}
            </div>
          </div>
        ))}
      </div>

      {/* Indicateur de pourcentage global */}
      <div className="mt-3 text-center px-2">
        <div className="text-base sm:text-lg font-bold text-orange-600 ">
          {percent}% {t('complete')}
        </div>
        <div className="text-xs text-gray-500  mt-0.5">
          {t('estimatedCompletion')}: {Math.max(0, Math.ceil((100 - percent) / (100 / maxSteps)))} {t('days')}
        </div>
      </div>

      {/* Message d'information si plus de 7 étapes originales
      {steps > 7 && (
        <div className="mt-2 text-xs text-gray-500  text-center">
          {t('stepsLimited', { total: steps, shown: maxSteps })}
        </div>
      )} */}
    </div>
  );
}