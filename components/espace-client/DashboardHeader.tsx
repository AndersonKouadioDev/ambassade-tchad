'use client';

import ProgressSteps from './ProgressSteps';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function DashboardHeader() {
  const t = useTranslations('espaceClient.dashboard');
  
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between px-4 py-4 lg:px-8 lg:py-6 gap-4 lg:gap-8">
      {/* Bloc gauche */}
      <div className="flex flex-col w-full lg:min-w-[20px] lg:w-auto items-center lg:items-start text-center lg:text-left">
        <div className="text-orange-500 text-lg lg:text-2xl font-bold mb-2">{t('bonjour')}<br className="hidden lg:block" /><span className="lg:hidden"> </span>{t('nomUtilisateur')}</div>
        <div className="text-base lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('etape')} 1</div>
        <div className="text-sm lg:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {t('service')} : {t('typeService')}<br />
          {t('demande')} : {t('typeDemande')}
        </div>
      </div>
      
      {/* Bloc central */}
      <div className="flex-1 flex flex-col items-center max-w-md lg:max-w-2xl">
        <div className="text-sm lg:text-xl font-bold text-blue-800 dark:text-blue-400 mb-2 text-center">{t('bienvenue')}</div>
        <div className="flex flex-col items-center mb-4">
          <div className="text-base lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('progression')}</div>
          <div className="flex items-center gap-3 w-full max-w-xs lg:max-w-md">
            <span className="text-base lg:text-2xl font-bold text-gray-900 dark:text-white">45%</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-orange-500 rounded-full transition-all duration-300" style={{ width: '45%' }} />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <ProgressSteps percent={45} steps={6} />
        </div>
      </div>
      
      {/* Bloc droit */}
      <div className="flex flex-col w-full lg:min-w-[70px] lg:w-auto items-center lg:items-end gap-2 lg:gap-2">
        <div className="flex items-center gap-2 self-center lg:self-end">
          <div className="bg-white dark:bg-gray-700 rounded-lg px-3 lg:px-4 py-2 flex items-center gap-2 shadow-sm text-orange-500 font-semibold text-xs lg:text-sm">
            <Calendar className="w-4 h-4" />
            <span className="whitespace-nowrap">{t('periodeDate')}</span>
          </div>
        </div>
        <div className="text-sm lg:text-2xl font-bold text-gray-900 dark:text-white text-center lg:text-right mt-2 lg:mt-4">{t('achevementPrevu')}</div>
        <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 text-center lg:text-right leading-relaxed">
          {t('dateAchevement')}<br />
          {t('dureeJours')}
        </div>
      </div>
    </div>
  );
} 