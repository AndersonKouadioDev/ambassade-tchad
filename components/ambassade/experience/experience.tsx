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
    picture: "/assets/images/illustrations/ambassade/team1.png",
  },
  {
    id: "acheikh",
    name: "M. ACHEIKH MAKAYE NIMIR",
    jobKey: "premier_conseiller",
    picture: "/assets/images/illustrations/ambassade/team4.png",
  },
  {
    id: "remadji",
    name: "Mme REMADJI Christelle",
    jobKey: "conseillere_economique",
    picture: "/assets/images/illustrations/ambassade/team2.png",
  },
  {
    id: "kaina",
    name: "Mr KAINA Nadjo",
    jobKey: "attache",
    picture: "/assets/images/illustrations/ambassade/nadjo_kaina.jpg",
  }
];


const TeamMember = () => {
  const t = useTranslations("teams");
  const tAgents  = useTranslations("agents");

  const socialIcons = [
    { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
    { icon: <Globe className="w-5 h-5" />, label: "Website" },
  ];

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center pb-10">
          <h2 className="text-secondary text-3xl md:text-5xl font-semibold">
            {t("title")}
          </h2>
          <p className="text-secondary text-lg md:text-xl mt-2">
            {t("description")}
          </p>
        </div>

        {/* Ambassadeur seul */}
        <div className="flex justify-center mb-12">
          {(() => {
            const amb = agents[0];
            return (
              <div
                className="relative group w-72 h-97 bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-80">
                  <Image
                    src={amb.picture}
                    alt={amb.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-all duration-300 group-hover:scale-105"
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
              className="relative group w-72 h-97 bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full h-80">
                <Image
                  src={agent.picture}
                  alt={agent.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 group-hover:scale-105"
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
