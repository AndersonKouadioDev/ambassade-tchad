'use client';

import ProgressSteps from './ProgressSteps';
import { Calendar } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <div className="w-full bg-[#F6F8FA] dark:bg-gray-800 rounded-xl md:rounded-xl flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between px-2 py-2 md:px-8 md:py-6 gap-2 md:gap-8">
      {/* Bloc gauche */}
      <div className="flex flex-col w-full md:min-w-[220px] md:w-auto items-center md:items-start text-center md:text-left">
        <div className="text-[#F44C27] text-sm md:text-2xl font-bold mb-1 md:mb-2">Bonjour<br />Tiene Ferand</div>
        <div className="text-sm md:text-2xl font-bold text-[#181F2B] dark:text-white mb-1">Étape 1</div>
        <div className="text-xs md:text-sm text-[#6B7280] dark:text-gray-400">Service : Recouvrement<br />Demande : Visa</div>
      </div>
      {/* Bloc central */}
      <div className="flex-1 flex flex-col items-center">
        <div className="text-xs md:text-xl font-bold text-[#003399] dark:text-blue-400 mb-1 md:mb-2 text-center">Bienvenue sur votre espace personnel.</div>
        <div className="flex flex-col items-center mb-1 md:mb-2">
          <div className="text-xs md:text-2xl font-bold text-[#181F2B] dark:text-white mb-1 md:mb-2">Progression</div>
          <div className="flex items-center gap-1 md:gap-3">
            <span className="text-xs md:text-2xl font-bold text-[#181F2B] dark:text-white">45%</span>
            <div className="w-16 md:w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center">
              <div className="h-2 bg-[#F44C27] rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <ProgressSteps percent={45} steps={6} />
        </div>
      </div>
      {/* Bloc droit */}
      <div className="flex flex-col w-full md:min-w-[220px] md:w-auto items-center md:items-end gap-1 md:gap-2 mt-2 md:mt-0">
        <div className="flex items-center gap-2 self-center md:self-end">
          <div className="bg-white dark:bg-gray-700 rounded-lg px-2 md:px-4 py-2 flex items-center gap-2 shadow-sm text-[#F44C27] font-semibold text-xs md:text-sm ml-0 md:ml-2">
            <Calendar className="w-4 h-4 mr-1" />
            Du 01 juil- 31 juil
          </div>
        </div>
        <div className="text-xs md:text-2xl font-bold text-[#181F2B] dark:text-white mt-2 md:mt-4">Achèvement prévu</div>
        <div className="text-xs md:text-sm text-[#6B7280] dark:text-gray-400">16 Juillet 2025<br />14 Jours</div>
      </div>
    </div>
  );
} 