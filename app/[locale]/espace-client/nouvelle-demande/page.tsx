'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface ServiceType {
  id: string;
  href: string;
}

const serviceTypes: ServiceType[] = [
  { id: 'visa', href: '/espace-client/nouvelle-demande/visa' },
  { id: 'birthAct', href: '/espace-client/nouvelle-demande/birth-act' },
  { id: 'consularCard', href: '/espace-client/nouvelle-demande/consular-card' },
  { id: 'laissezPasser', href: '/espace-client/nouvelle-demande/laissez-passer' },
  { id: 'marriageCapacity', href: '/espace-client/nouvelle-demande/marriage-capacity' },
  { id: 'deathAct', href: '/espace-client/nouvelle-demande/death-act' },
  { id: 'powerOfAttorney', href: '/espace-client/nouvelle-demande/power-of-attorney' },
  { id: 'nationalityCertificate', href: '/espace-client/nouvelle-demande/nationality-certificate' }
];

export default function NouvelleDemande() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('NewRequestPage');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth?callbackUrl=/espace-client/nouvelle-demande');
    return null;
  }

  const handleNavigate = (href: string) => {
    router.push(`/${locale}${href}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceTypes.map((service) => {
            const serviceT = t.raw(`services.${service.id}`);
            return (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer p-6 flex flex-col h-full"
                onClick={() => handleNavigate(service.href)}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {serviceT.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {serviceT.description}
                  </p>
                  <ul className="mb-4 text-xs text-gray-500">
                    {serviceT.features.map((feature: string, index: number) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-4">
                  <button
                    className="w-full px-4 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(service.href);
                    }}
                  >
                    {t('startButton')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}