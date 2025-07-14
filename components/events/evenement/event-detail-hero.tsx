"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Calendar, Clock, MapPin, Tag, User } from "lucide-react";
import { Button } from "@heroui/react";
import { formatEventDate, getCategoryColor, getCategoryLabel, type Event } from "@/lib/events-data";
import ShareButton from "@/components/ui/share-button";

type Props = {
  event: Event;
};

export default function EventDetailHero({ event }: Props) {
  const t = useTranslations("event");
  const tDetails = useTranslations("event.details");

  return (
    <div className="relative flex items-center justify-between w-full h-[calc(100vh-200px)]">
      {/* Image d'arrière-plan avec superposition */}
      <Image
        className="absolute inset-0 w-full h-full object-cover shrink-0"
        src={event.image}
        alt={event.title}
        fill
        priority
      />
      <div className="absolute w-full h-full bg-gradient-to-r from-primary/90 to-primary/70 px-4"></div>

      <div className="absolute px-4 pt-4 inset-0 flex flex-col bottom-2 items-start justify-center text-left text-white text-xl sm:text-2xl lg:text-2xl font-semibold gap-20 lg:gap-32">
        {/* Contenu */}
        <div className="mx-auto relative right-0 lg:right-80 justify-start p-8 flex flex-col gap-6">
          {/* Fil d'Ariane */}
          <nav className="text-white font-extralight text-lg mb-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-white hover:underline">
                {t("breadcrumbs.home")}
              </Link>
              <span>{">"}</span>
              <Link href="/event" className="text-white hover:underline">
                {t("breadcrumbs.event")}
              </Link>
              <span>{">"}</span>
              <span className="text-white opacity-80">
                {event.title}
              </span>
            </div>
          </nav>
          
          {/* En-tête de l'événement */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4 text-base font-normal">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category).replace('text-blue-800', 'text-white').replace('text-purple-800', 'text-white').replace('text-green-800', 'text-white').replace('text-orange-800', 'text-white').replace('text-gray-800', 'text-white')}`}>
                {getCategoryLabel(event.category)}
              </span>
              {event.featured && (
                <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                  À la une
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl mb-6 leading-tight">
              {event.title}
            </h1>
            
            {/* Métadonnées de l'événement */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-normal opacity-90">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatEventDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{event.organizer}</span>
              </div>
            </div>
            
            {/* Extrait */}
            <p className="text-lg font-normal opacity-90 mt-6 leading-relaxed max-w-3xl">
              {event.excerpt}
            </p>
            
            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 mt-8">
              {event.registrationRequired && new Date(event.date) > new Date() && (
                <Button 
                  color="primary"
                  size="lg"
                  className="text-white hover:bg-primary/80 transition-colors duration-200"
                >
                  {tDetails("register")}
                </Button>
              )}
              
              <ShareButton 
                title={event.title}
                text={event.excerpt}
                variant="bordered"
                label={tDetails("share")}
                className="border-white text-white hover:bg-primary/80 hover:border-primary/80 transition-colors duration-200"
              />
            </div>
            
            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-6">
                <Tag size={16} />
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-primary/80 text-white px-2 py-1 rounded text-sm hover:bg-primary transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
