"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import {Link} from '@/i18n/navigation';
import { useTranslations } from "next-intl";

type Service = {
  picture: string;
  link: string;
};

const services: Service[] = [
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-1.png",
    link: "/passport",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-2.png",
    link: "/laissez-passer",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/consulaire.png",
    link: "/consulaire",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-4.png",
    link: "#",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-5.png",
    link: "/tourisme/peuples-et-cultures",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-6.png",
    link: "/tourisme/tchad-s",
  },
];

export default function Service() {
  const t = useTranslations("home.services");

  return (
    <section className="bg-muted py-12 px-4 sm:px-8 lg:px-20">
      {/* Titre + bouton */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-2xl lg:text-4xl font-bold text-secondary text-center md:text-left">
          {(() => {
            try {
              return t("description");
            } catch (error) {
              return "Nos services";
            }
          })()}
        </h2>
        <Button color="default" className="text-secondary">
          {(() => {
            try {
              return t("seeMore");
            } catch (error) {
              return "Voir plus";
            }
          })()}
        </Button>
      </div>

      {/* Grille responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((item, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl shadow-xl overflow-hidden group relative hover:shadow-2xl transition duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-60 overflow-hidden">
              <Image
                src={item.picture}
                alt={(() => {
                  try {
                    return t(`items.${index}.title`);
                  } catch (error) {
                    return `Service ${index + 1}`;
                  }
                })()}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Bouton "accès au service" */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <Link href={item.link} passHref>
                <Button
                  color="secondary"
                  className="text-white padding-4 px-6 rounded-full shadow-lg hover:bg-[#003d99] transition duration-500"
                >
                  {(() => {
                    try {
                      return t(`items.${index}.title`);
                    } catch (error) {
                      return `Service ${index + 1}`;
                    }
                  })()}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
