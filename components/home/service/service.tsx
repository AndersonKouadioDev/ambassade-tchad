"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

type Service = {
  picture: string;
  title: string;
  link: string;
};

const services: Service[] = [
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-1.png",
    title: "VISA",
    link: "/passport",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-2.png",
    title: "LAISSEZ-PASSER",
    link: "/laissez-passer",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/consulaire.png",
    title: "CARTE CONSULAIRE",
    link: "/consulaire",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-4.png",
    title: "SERVICE ECONOMIQUE",
    link: "#",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-5.png",
    title: "SERVICE CULTUREL",
    link: "/tourisme/peuples-et-cultures",
  },
  {
    picture: "/assets/images/illustrations/page-accueil/card-items-6.png",
    title: "AUTRES DOCUMENTS",
    link: "/tourisme/tchad-s",
  },
];

export default function Service() {
  return (
    <section className="bg-muted py-12 px-4 sm:px-8 lg:px-20">
      {/* Titre + bouton */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-2xl lg:text-4xl font-bold text-secondary text-center md:text-left">
          NOS SERVICES CONSULAIRES
        </h2>
        <Button color="default" className="text-secondary">
          Voir plus
        </Button>
      </div>

      {/* Grille responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((item) => (
          <div
            key={item.title}
            className="bg-card rounded-2xl shadow-xl overflow-hidden group relative hover:shadow-2xl transition duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-60 overflow-hidden">
              <Image
                src={item.picture}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Bouton "accès au service" */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center">
              <Link href={item.link} passHref>
                <Button color="secondary" className="text-white padding-4 px-6 rounded-full shadow-lg hover:bg-[#003d99] transition duration-500">
                  {item.title}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
