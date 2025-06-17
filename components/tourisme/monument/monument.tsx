"use client";

import { useState } from "react";
import Image from "next/image";

type Monuments = {
  picture: string;
  title: string;
  subtitle: string;
};

const monument: Monuments[] = [
  {
    picture: "/assets/images/illustrations/tourisme/card1.png",
    title: "Lac Katam",
    subtitle:
      "Situé dans la région de l'Ennedi, le lac Katam est l'un des lacs du système d'Ounianga Kébir. Il se distingue par ses deux parties séparées par une étroite langue de sable, offrant des eaux aux teintes bleues et vertes en raison de la présence d'algues spécifiques.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/card2.png",
    title: "Lac Fianga",
    subtitle:
      "Le lac Fianga, situé à la frontière entre le Tchad et le Cameroun, est alimenté par les eaux du Logone et du Mayo Kébbi. Ses niveaux d'eau varient selon les saisons, offrant des paysages changeants et une biodiversité riche.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/card3.png",
    title: "Lac Tchad",
    subtitle:
      "Le lac Tchad est l'un des plus grands lacs d'Afrique, bien que sa superficie ait diminué au fil des décennies. Il reste une ressource vitale pour des millions de personnes et abrite une biodiversité unique.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/card4.png",
    title: "Lac Yoa",
    subtitle:
      "Le lac Yoa est le plus grand des lacs d'Ounianga Kébir, avec une profondeur atteignant 20 mètres. Situé au cœur du désert du Sahara, il est alimenté par des nappes phréatiques fossiles, témoignant d'une époque où le climat de la région était plus humide.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/tourisme_1.jpg",
    title: "tourisme_1",
    subtitle:
      "Le lac Yoa est le plus grand des lacs d'Ounianga Kébir, avec une profondeur atteignant 20 mètres. Situé au cœur du désert du Sahara, il est alimenté par des nappes phréatiques fossiles, témoignant d'une époque où le climat de la région était plus humide.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/tourisme_2.jpg",
    title: "tourisme_2",
    subtitle:
      "Le lac Yoa est le plus grand des lacs d'Ounianga Kébir, avec une profondeur atteignant 20 mètres. Situé au cœur du désert du Sahara, il est alimenté par des nappes phréatiques fossiles, témoignant d'une époque où le climat de la région était plus humide.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/tourisme_3.jpg",
    title: "tourisme_3",
    subtitle:
      "Le lac Yoa est le plus grand des lacs d'Ounianga Kébir, avec une profondeur atteignant 20 mètres. Situé au cœur du désert du Sahara, il est alimenté par des nappes phréatiques fossiles, témoignant d'une époque où le climat de la région était plus humide.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/tourisme_4.jpg",
    title: "tourisme_4",
    subtitle:
      "Le lac Yoa est le plus grand des lacs d'Ounianga Kébir, avec une profondeur atteignant 20 mètres. Situé au cœur du désert du Sahara, il est alimenté par des nappes phréatiques fossiles, témoignant d'une époque où le climat de la région était plus humide.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/tourisme_5.jpg",
    title: "tourisme_5",
    subtitle:
      "Le lac Yoa est le plus grand des lacs d'Ounianga Kébir, avec une profondeur atteignant 20 mètres. Situé au cœur du désert du Sahara, il est alimenté par des nappes phréatiques fossiles, témoignant d'une époque où le climat de la région était plus humide.",
  },
  {
    picture: "/assets/images/illustrations/tourisme/tourisme_6.jpg",
    title: "tourisme_6",
    subtitle:
      "Le lac Yoa est le plus grand des lacs d'Ounianga Kébir, avec une profondeur atteignant 20 mètres. Situé au cœur du désert du Sahara, il est alimenté par des nappes phréatiques fossiles, témoignant d'une époque où le climat de la région était plus humide.",
  },
];

function TruncatedText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <p className={`text-sm text-gray-700 ${expanded ? "" : "line-clamp-3"}`}>
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 text-sm mt-1 underline"
      >
        {expanded ? "Lire moins" : "Lire plus"}
      </button>
    </div>
  );
}

export default function Monument() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Grid d’images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {monument.map((item) => (
          <div
            key={item.title}
            className="group relative bg-white shadow rounded-lg overflow-hidden cursor-pointer"
          >
            {/* Image avec overlay "Voir +" */}
            <div
              className="relative h-48 w-full overflow-hidden"
              onClick={() => setSelectedImage(item.picture)}
            >
              <Image
                src={item.picture}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold bg-primary px-4 py-2 rounded-md shadow-md">
                  Voir +
                </span>
              </div>
            </div>

            {/* Titre et texte */}
            <div className="p-4">
              <h2 className="font-semibold text-lg text-secondary mb-2">
                {item.title}
              </h2>
              <TruncatedText text={item.subtitle} />
            </div>
          </div>
        ))}
      </div>

      {/* Affichage plein écran */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-[90vw] h-[80vh] max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Agrandissement"
              layout="fill"
              className="object-contain rounded-md shadow-lg"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
