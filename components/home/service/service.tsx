"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Service = {
  picture: string;
  link: string;
};

const services: Service[] = [
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-1.png",
    link: "/espace-client/nouvelle-demande",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-2.png",
    link: "/espace-client/nouvelle-demande",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/consulaire.png",
    link: "/espace-client/nouvelle-demande",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-4.png",
    link: "/consulaire",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-5.png",
    link: "/tourisme",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-6.png",
    link: "/tourisme/tchad",
  },
];

export default function Service() {
  const t = useTranslations("home.services");

  return (
    <section className="bg-muted py-12 px-4 sm:px-8 lg:px-20">
      <div className="mx-auto max-w-screen-2xl">
        {/* Titre + bouton */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-2xl lg:text-4xl font-bold text-secondary text-center md:text-left max-w-[600px]">
            {(() => {
              try {
                return t("description");
              } catch (error) {
                return (error as Error).message;
              }
            })()}
          </h2>
          <Link href="/consulaire">
            <Button color="primary">
              {(() => {
                try {
                  return t("seeMore");
                } catch (error) {
                  return (error as Error).message;
                }
              })()}
            </Button>
          </Link>
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
                      return (error as Error).message;
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
                        return (error as Error).message;
                      }
                    })()}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
