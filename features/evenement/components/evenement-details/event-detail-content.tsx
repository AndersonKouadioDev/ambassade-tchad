"use client";

import React from "react";
import {Link} from "@/i18n/navigation";
import {useTranslations} from "next-intl";
import {ArrowLeft, Calendar, Eye, MapPin, User} from "lucide-react";
import {Button} from "@heroui/react";
import {type Event, formatEventDate} from "@/lib/events-data";
import ShareButton from "@/components/ui/share-button";
import {useParams, useRouter} from "next/navigation";
import {useEvenementQuery} from "@/features/evenement/queries/evenement-details.query";

type Props = {
  event: Event;
};

export default function EventDetailContent() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.slug as string;
  const {data: event, isLoading, error} = useEvenementQuery(eventId);

  const t = useTranslations("event.details");
  // const relatedEvents = getRelatedEvents(event.slug, 3);
  // const previousEvent = getPreviousEvent(event.slug);
  // const nextEvent = getNextEvent(event.slug);

  // const isUpcoming = isEventUpcoming(event.date);
  // const registrationActive = isUpcoming && event.registrationRequired &&
  //   (!event.registrationDeadline || new Date(event.registrationDeadline) >= new Date());

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement de l'événement...</p>
          </div>
        </div>
    );
  }

  if (error || !event) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div
                className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-8 h-8 text-red-600 dark:text-red-400"/>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Événement introuvable</h2>
            <p className="text-gray-600 dark:text-gray-400">Cet événement n'existe pas ou a été supprimée.</p>
            <Button onPress={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Retour
            </Button>
          </div>
        </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Contenu principal */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Informations pratiques */}
        <div className="bg-gray-50 rounded-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">{t("practicalInfo")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <span className="text-gray-700 font-medium">{t("date")}:</span>
                  <p>{formatEventDate(event.eventDate.toString())}</p>
                </div>
              </li>
              {/*<li className="flex items-start gap-3">*/}
              {/*  <Clock className="w-5 h-5 text-secondary mt-0.5" />*/}
              {/*  <div>*/}
              {/*    <span className="text-gray-700 font-medium">{t("time")}:</span>*/}
              {/*    <p>{event.time}</p>*/}
              {/*  </div>*/}
              {/*</li>*/}
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <span className="text-gray-700 font-medium">{t("location")}:</span>
                  <p>{event.location}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <User className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <span className="text-gray-700 font-medium">{t("organizer")}:</span>
                  {/*<p>{event.author}</p>*/}
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            {/*{event.capacity && (*/}
            {/*  <div className="flex items-start gap-3 mb-3">*/}
            {/*    <Users className="w-5 h-5 text-secondary mt-0.5" />*/}
            {/*    <div>*/}
            {/*      <span className="text-gray-700 font-medium">{t("capacity")}:</span>*/}
            {/*      <p>{event.capacity} personnes</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
            
            {/*{event.registrationRequired && (*/}
            {/*  <div className="flex items-start gap-3 mb-3">*/}
            {/*    <AlertCircle className="w-5 h-5 text-secondary mt-0.5" />*/}
            {/*    <div>*/}
            {/*      <span className="text-gray-700 font-medium">{t("registration")}:</span>*/}
            {/*      <p>{t("required")} {event.registrationDeadline ? `(${t("deadline")} ${formatEventDate(event.registrationDeadline)})` : ''}</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
            
            {/*{event.contactEmail && (*/}
            {/*  <div className="flex items-start gap-3 mb-3">*/}
            {/*    <Mail className="w-5 h-5 text-secondary mt-0.5" />*/}
            {/*    <div>*/}
            {/*      <span className="text-gray-700 font-medium">{t("email")}:</span>*/}
            {/*      <p><a href={`mailto:${event.contactEmail}`} className="text-primary hover:underline">{event.contactEmail}</a></p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}
            
            {/*{event.contactPhone && (*/}
            {/*  <div className="flex items-start gap-3 mb-3">*/}
            {/*    <Phone className="w-5 h-5 text-secondary mt-0.5" />*/}
            {/*    <div>*/}
            {/*      <span className="text-gray-700 font-medium">{t("phone")}:</span>*/}
            {/*      <p><a href={`tel:${event.contactPhone.replace(/\s/g, '')}`} className="text-primary hover:underline">{event.contactPhone}</a></p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-3 mt-5">
              {/*{registrationActive && (*/}
              {/*  <RegisterButton */}
              {/*    email={event.contactEmail}*/}
              {/*    eventTitle={event.title}*/}
              {/*    eventDate={formatEventDate(event.date)}*/}
              {/*    className="w-full sm:w-auto mt-2"*/}
              {/*    label={t("register")}*/}
              {/*  />*/}
              {/*)}*/}
              
              <ShareButton
                title={event.title}
                text={event.title}
                className="w-full sm:w-auto mt-2 border-gray-300 hover:border-primary hover:text-white hover:bg-primary transition-colors duration-200"
                label={t("share")}
              />
            </div>
          </div>
        </div>

        {/* Contenu de l'événement */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: event.description }} // TODO : Remplacer par le content s'il est disponible
          />
        </div>

        {/* Tags */}
        {/*<div className="flex flex-wrap items-center gap-3 mt-12 pt-8 border-t border-gray-200">*/}
        {/*  <span className="text-sm font-medium text-gray-600">{t("tags")}:</span>*/}
        {/*  {event.tags.map((tag, index) => (*/}
        {/*    <span */}
        {/*      key={index}*/}
        {/*      className="bg-gray-100 hover:bg-primary hover:text-white transition-colors px-3 py-1 rounded-full text-sm cursor-pointer"*/}
        {/*    >*/}
        {/*      {tag}*/}
        {/*    </span>*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/* Navigation vers événements précédent/suivant */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200">
          <Link href="/event">              <Button
                variant="bordered"
                startContent={<ArrowLeft size={16} />}
                className="border-gray-300 hover:border-primary hover:text-white hover:bg-primary transition-colors duration-200"
              >
                {t("backToEvents")}
              </Button>
          </Link>
          
          {/*<div className="flex gap-3">*/}
          {/*  {previousEvent && (*/}
          {/*    <Link href={`/event/${previousEvent.slug}`}>*/}
          {/*      <Button*/}
          {/*        variant="bordered"*/}
          {/*        startContent={<ArrowLeft size={16} />}*/}
          {/*        className="border-gray-300 hover:border-primary hover:text-white hover:bg-primary transition-colors duration-200"*/}
          {/*      >*/}
          {/*        {t("previous")}*/}
          {/*      </Button>*/}
          {/*    </Link>*/}
          {/*  )}*/}
          {/*  */}
          {/*  {nextEvent && (*/}
          {/*    <Link href={`/event/${nextEvent.slug}`}>*/}
          {/*      <Button*/}
          {/*        variant="bordered"*/}
          {/*        endContent={<ArrowRight size={16} />}*/}
          {/*        className="border-gray-300 hover:border-primary hover:text-white hover:bg-primary transition-colors duration-200"*/}
          {/*      >*/}
          {/*        {t("next")}*/}
          {/*      </Button>*/}
          {/*    </Link>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>

        {/* Événements connexes */}
        {/*{relatedEvents.length > 0 && (*/}
        {/*  <div className="mt-16 pt-8 border-t border-gray-200">*/}
        {/*    <h2 className="text-2xl font-bold text-primary mb-8">{t("relatedEvents")}</h2>*/}
        {/*    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
        {/*      {relatedEvents.map((relatedEvent) => (*/}
        {/*        <Link href={`/event/${relatedEvent.slug}`} key={relatedEvent.id} className="group">*/}
        {/*          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">*/}
        {/*            <div className="relative w-full h-48">*/}
        {/*              <Image */}
        {/*                src={relatedEvent.image} */}
        {/*                alt={relatedEvent.title}*/}
        {/*                fill*/}
        {/*                className="object-cover group-hover:scale-105 transition-transform duration-300"*/}
        {/*                sizes="(max-width: 768px) 100vw, 350px"*/}
        {/*              />*/}
        {/*              <div className="absolute top-3 left-3">*/}
        {/*                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary">*/}
        {/*                  {formatEventDate(relatedEvent.date)}*/}
        {/*                </span>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*            <div className="p-5">*/}
        {/*              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">*/}
        {/*                {relatedEvent.title}*/}
        {/*              </h3>*/}
        {/*              <p className="text-gray-600 mt-2 line-clamp-3 text-sm">*/}
        {/*                {relatedEvent.excerpt}*/}
        {/*              </p>*/}
        {/*              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">*/}
        {/*                <MapPin size={14} />*/}
        {/*                <span>{relatedEvent.location}</span>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </Link>*/}
        {/*      ))}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </div>
  );
}
