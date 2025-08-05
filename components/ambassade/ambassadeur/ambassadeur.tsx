'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Ambassadeur() {
  const t = useTranslations('ambassadeur');

  return (
    <div className="p-6 m-4 lg:p-12 space-y-8 mx-auto max-w-screen-xl">
      <div className="text-secondary text-3xl lg:text-5xl font-semibold">
        {t('title')}
      </div>
      <div className="flex flex-col-reverse lg:flex-row items-stretch justify-around gap-4 lg:gap-12">
        <div className="relative w-full max-w-96 h-[400px] lg:h-[650px] mx-auto">
          <Image
            src="/assets/images/illustrations/ambassade/ambassadeur_tchad.jpg"
            alt="ambassadeur"
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-4 flex justify-center">
            <div className="flex flex-col gap-2 justify-start font-mulish border px-6 border-primary text-white rounded-md shadow-sm bg-primary">
              <div className="text-xl">{t('nom')}</div>
              <div className="text-base">{t('poste')}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-between flex-1">
          <div className="text-secondary text-xl md:text-3xl font-semibold">
            {t('bienvenue')}
          </div>
          <div className="font-mulish text-sm md:text-base text-justify text-black">
            {t('texte')}
            <br />
            <span className="font-bold">{t('vision')}</span>
          </div>
          <div className="font-mulish font-extrabold md:font-bold text-lg text-center py-8">
            {t('salutation')} <br />
            {t('signature')}
          </div>
        </div>
      </div>
    </div>
  );
}
