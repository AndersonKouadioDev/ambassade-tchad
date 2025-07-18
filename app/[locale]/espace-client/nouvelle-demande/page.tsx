import Accordion from '@/components/espace-client/Accordion';
import NewsCarouselPro from '@/components/espace-client/NewsCarouselPro';
import QuickActions from '@/components/espace-client/QuickActions';
import NavigationButton from '@/components/espace-client/NavigationButton';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function NouvelleDemande() {
  const t = useTranslations('espaceClient.nouvelleDemande');

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Colonne gauche : accordéon services */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('subtitle')}</h1>
          <p className="text-gray-500 dark:text-gray-300 mb-3">{t('description')}</p>
          <Accordion title={t('services.visa.title')} defaultOpen>
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              {t('services.visa.description')}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-300">{t('services.visa.priceLabel')} :</span>
                <span className="font-bold text-lg dark:text-white">{t('services.visa.price')}</span>
              </div>
              <div className="flex-1 flex justify-end">
                <NavigationButton 
                  href="/espace-client/nouvelle-demande/visa"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto"
                >
                  {t('startRequest')}
                </NavigationButton>
              </div>
            </div>
          </Accordion>
          <Accordion title={t('services.carteConsulaire.title')}>
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              {t('services.carteConsulaire.description')}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-300">{t('services.carteConsulaire.priceLabel')} :</span>
                <span className="font-bold text-lg dark:text-white">{t('services.carteConsulaire.price')}</span>
              </div>
              <div className="flex-1 flex justify-end">
                <NavigationButton 
                  href="/espace-client/nouvelle-demande/carte-consulaire"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto"
                >
                  {t('startRequest')}
                </NavigationButton>
              </div>
            </div>
          </Accordion>
          <Accordion title={t('services.passeport.title')}>
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              {t('services.passeport.description')}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-300">{t('services.passeport.priceLabel')} :</span>
                <span className="font-bold text-lg dark:text-white">{t('services.passeport.price')}</span>
              </div>
              <div className="flex-1 flex justify-end">
                <NavigationButton 
                  href="/espace-client/nouvelle-demande/passeport"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto"
                >
                  {t('startRequest')}
                </NavigationButton>
              </div>
            </div>
          </Accordion>
          <Accordion title={t('services.laissezPasser.title')}>
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              {t('services.laissezPasser.description')}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-300">{t('services.laissezPasser.priceLabel')} :</span>
                <span className="font-bold text-lg dark:text-white">{t('services.laissezPasser.price')}</span>
              </div>
              <div className="flex-1 flex justify-end">
                <NavigationButton 
                  href="/espace-client/nouvelle-demande/laissez-passer"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto"
                >
                  {t('startRequest')}
                </NavigationButton>
              </div>
            </div>
          </Accordion>
          <Accordion title={t('services.procuration.title')}>
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              {t('services.procuration.description')}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-300">{t('services.procuration.priceLabel')} :</span>
                <span className="font-bold text-lg dark:text-white">{t('services.procuration.price')}</span>
              </div>
              <div className="flex-1 flex justify-end">
                <NavigationButton 
                  href="/espace-client/nouvelle-demande/procuration"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto"
                >
                  {t('startRequest')}
                </NavigationButton>
              </div>
            </div>
          </Accordion>
          <Accordion title={t('services.certificatNationalite.title')}>
            <div className="text-gray-700 dark:text-gray-200 mb-3 text-sm">
              {t('services.certificatNationalite.description')}
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-300">{t('services.certificatNationalite.priceLabel')} :</span>
                <span className="font-bold text-lg dark:text-white">{t('services.certificatNationalite.price')}</span>
              </div>
              <div className="flex-1 flex justify-end">
                <NavigationButton 
                  href="/espace-client/nouvelle-demande/certificat-nationalite"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-2xl shadow transition-all w-full md:w-auto"
                >
                  {t('startRequest')}
                </NavigationButton>
              </div>
            </div>
          </Accordion>
          <div className="flex justify-end mt-2">
            <a href="#" className="text-orange-500 text-sm font-semibold hover:underline">{t('viewAllServices')}</a>
          </div>
        </div>
        {/* Colonne droite : actualités + services rapides */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          <NewsCarouselPro />
          <QuickActions />
        </div>
      </div>
    </div>
  );
} 