'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function DashboardHeader() {
  const t = useTranslations('espaceClient.dashboard');
  const { data: session } = useSession();

  // Extraire le nom et prénom de la session
  const userName = session?.user?.name || 'Utilisateur';

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between px-4 py-4 lg:px-8 lg:py-6 gap-4 lg:gap-8">
      <div className="flex-1 flex flex-col items-center max-w-md lg:max-w-4xl mx-auto">
        <div className="text-sm lg:text-xl font-bold text-blue-800 dark:text-blue-400 mb-4 text-center">
          {t('bienvenue')} <span className="text-md text-orange-600 dark:text-white italic font-bold uppercase">{userName}</span>
        </div>

        {/* Étapes à suivre */}
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 lg:p-8">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t('etapesTitre')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Étape 1 */}
            <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 dark:text-blue-300 font-bold text-lg">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  {t('etape1Titre')}
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {t('etape1Description')}
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 dark:text-green-300 font-bold text-lg">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                  {t('etape2Titre')}
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {t('etape2Description')}
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="flex items-start p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 dark:text-purple-300 font-bold text-lg">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                  {t('etape3Titre')}
                </h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  {t('etape3Description')}
                </p>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="flex items-start p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mr-4">
                <span className="text-orange-600 dark:text-orange-300 font-bold text-lg">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">
                  {t('etape4Titre')}
                </h4>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {t('etape4Description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-6 w-full">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
            {t('infoComplementaires')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{t('info1')}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{t('info2')}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{t('info3')}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{t('info4')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 