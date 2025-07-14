import React from 'react';
interface ProgressStepsProps {
  percent: number;
  steps: number;
  labels?: React.ReactNode[];
}

export default function ProgressSteps({ percent, steps, labels }: ProgressStepsProps) {
  // Calcul du nombre d'étapes complétées (entier)
  const completed = Math.floor((percent / 100) * steps);
  // Calcul de la fraction de la prochaine étape (pour la barre partielle)
  const progressInStep = ((percent / 100) * steps) - completed;
  return (
    <div className="w-full flex flex-col items-center mt-2">
      <div className="flex items-center w-full max-w-6xl mx-auto ml-16">
        {[...Array(steps)].map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 ${i < completed ? 'bg-white border-[#F44C27]' : 'bg-transparent border-gray-300'}`}></div>
            {i < steps - 1 && (
              <div className="h-1 flex-1 relative bg-[#F44C27]/30">
                {/* Barre pleine pour les étapes complétées */}
                {i < completed - 1 && (
                  <div className="absolute top-0 left-0 h-1 bg-[#F44C27]" style={{ width: '100%' }} />
                )}
                {/* Barre partielle pour l'étape en cours */}
                {i === completed && progressInStep > 0 && (
                  <div className="absolute top-0 left-0 h-1 bg-[#F44C27]" style={{ width: `${progressInStep * 100}%` }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between w-full max-w-6xl mx-auto mt-2 text-xs text-[#181F2B] dark:text-gray-200 font-semibold ml-2">
        {[...Array(steps)].map((_, i) => (
          <span key={i} className="w-32 text-center leading-tight">
            {labels && labels[i] ? labels[i] : <><div>Processus</div><div>de traitement</div></>}
          </span>
        ))}
      </div>
    </div>
  );
} 