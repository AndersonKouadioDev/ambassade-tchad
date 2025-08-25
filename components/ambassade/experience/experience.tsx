"use client";

import React from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Globe, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";

const agents = [
  {
    id: "souariba",
    name: "M. SOUARIBA Gonfouli",
    jobKey: "ambassadeur",
    picture: "/assets/images/illustrations/ambassade/ambassadeur_teams.jpg",
  },
  {
    id: "acheikh",
    name: "M. ACHEIKH MAKAYE NIMIR",
    jobKey: "premier_conseiller",
    picture: "/assets/images/illustrations/ambassade/check_nimir.jpg",
  },
  {
    id: "remadji",
    name: "Mme REMADJI Christelle",
    jobKey: "conseillere_economique",
    picture: "/assets/images/illustrations/ambassade/christelle.jpg",
  },
  {
    id: "kaina",
    name: "Mr KAINA Nadjo",
    jobKey: "attache",
    picture: "/assets/images/illustrations/ambassade/kaina_nadjo.jpg",
  }
];

const socialIcons = [
  { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
  { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
  { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
  { icon: <Globe className="w-5 h-5" />, label: "Website" },
];

const TeamMember = () => {
  const t = useTranslations("teams");
  const tAgents = useTranslations("agents");

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center pb-10">
          <h2 className="text-primary text-3xl md:text-5xl font-semibold">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mt-2">
            {t("description")}
          </p>
        </div>

        {/* Ambassadeur seul */}
        <div className="flex justify-center mb-12">
          {(() => {
            const amb = agents[0];
            return (
              <div className="relative group w-full sm:w-80 h-[400px] md:h-[450px] bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative w-full h-[300px] md:h-[350px]">
                  <Image
                    src={amb.picture}
                    alt={amb.name}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-gray-800 font-bold text-lg">{tAgents(amb.id, { default: amb.name })}</h3>
                  <p className="text-gray-600 text-sm flex items-center justify-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    {t(`jobs.${amb.jobKey}`)}
                  </p>
                  <div className="flex justify-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {socialIcons.slice(0, 3).map((social, idx) => (
                      <button
                        key={idx}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all"
                        title={social.label}
                      >
                        {social.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Les autres membres alignés en bas */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {agents.slice(1).map((agent, index) => (
            <div
              key={index}
              className="relative group w-full sm:w-72 h-[350px] bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full h-[250px]">
                <Image
                  src={agent.picture}
                  alt={agent.name}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-gray-800 font-bold text-lg">{tAgents(agent.id, { default: agent.name })}</h3>
                <p className="text-gray-600 text-sm flex items-center justify-center gap-2 mt-1">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  {t(`jobs.${agent.jobKey}`)}
                </p>
                <div className="flex justify-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {socialIcons.slice(0, 3).map((social, idx) => (
                    <button
                      key={idx}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-all"
                      title={social.label}
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;