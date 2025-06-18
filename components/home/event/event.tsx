"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Event() {
  const t = useTranslations("home.events");

  const navigationCards = [0, 1, 2].map((index) => ({
    title: t(`items.${index}.title`),
    image: `/assets/images/illustrations/page-accueil/${["bg-ambassade-1.png", "card-2.png", "card-3.png"][index]}`,
    link: ["/ambassade", "/consulaire", "/tourisme/tchad-s"][index],
    alt: t(`items.${index}.alt`),
  }));

  return (
    <div className="w-full relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center justify-center py-8 md:py-12 mt-2">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/backgrounds/bg-four-card.jpg"
          alt="Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#003d99]/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 w-full">
        <div className="container mx-auto px-2 sm:px-4 md:px-8 py-4 lg:px-8">
          <div className="px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {navigationCards.map((card, index) => (
              <Link
                href={card.link}
                key={index}
                className="block transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
                  {/* Image container */}
                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority
                    />
                  </div>

                  {/* Title */}
                  <div className="mt-auto absolute bottom-0 left-0 right-0 bg-[#002B7F] text-white px-3 py-2 text-center font-medium text-sm">
                    {card.title}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
