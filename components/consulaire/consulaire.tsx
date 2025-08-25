"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  FileText,
  CreditCard,
  Globe,
  ArrowRight,
  UserCheck,
  Users,
  Building,
  FileSignature,
  FileBadge2,
} from "lucide-react";

const services = [
  {
    id: "laissezPasser",
    icon: <FileText className="w-8 h-8" />,
    title: "laissezPasser.title",
    description: "laissezPasser.description",
    link: "/espace-client/nouvelle-demande/laissez-passer",
    color: "bg-primary",
  },
  {
    id: "consularCard",
    icon: <CreditCard className="w-8 h-8" />,
    title: "consularCard.title",
    description: "consularCard.description",
    link: "/espace-client/nouvelle-demande/consular-card",
    color: "bg-secondary",
  },
  {
    id: "visa",
    icon: <Globe className="w-8 h-8" />,
    title: "visa.title",
    description: "visa.description",
    link: "/espace-client/nouvelle-demande/visa",
    color: "bg-red-500",
  },
  {
    id: "procuration",
    icon: <FileSignature className="w-8 h-8" />,
    title: "procuration.title",
    description: "procuration.description",
    link: "/espace-client/nouvelle-demande/power-of-attorney",
    color: "bg-orange-500",
  },
  {
    id: "birthAct",
    icon: <FileBadge2 className="w-8 h-8" />,
    title: "birthAct.title",
    description: "birthAct.description",
    link: "/espace-client/nouvelle-demande/birth-act",
    color: "bg-green-500",
  },
  {
    id: "deathAct",
    icon: <Users className="w-8 h-8" />,
    title: "deathAct.title",
    description: "deathAct.description",
    link: "/espace-client/nouvelle-demande/death-act",
    color: "bg-gray-500",
  },
  {
    id: "marriageCapacity",
    icon: <UserCheck className="w-8 h-8" />,
    title: "marriageCapacity.title",
    description: "marriageCapacity.description",
    link: "/espace-client/nouvelle-demande/marriage-capacity",
    color: "bg-indigo-500",
  },
  {
    id: "nationality",
    icon: <Building className="w-8 h-8" />,
    title: "nationality.title",
    description: "nationality.description",
    link: "/espace-client/nouvelle-demande/nationality-certificate",
    color: "bg-teal-500",
  },
];

export default function ConsulaireForm() {
  const t = useTranslations("consulaire.services");

  return (
    <div className="py-16 bg-gray-50 min-h-[calc(100vh-70px)]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pb-12">
          <h1 className="text-secondary text-3xl md:text-5xl font-extrabold mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link key={index} href={service.link}>
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200 group flex flex-col justify-start items-start gap-4 h-full">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${service.color} text-white`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {t(service.title)}
                  </h3>
                </div>
                <p className="text-gray-600 text-base leading-relaxed mt-2 flex-1">
                  {t(service.description)}
                </p>
                <div className="flex items-center gap-2 mt-4 text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="font-semibold">{t("cta")}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
