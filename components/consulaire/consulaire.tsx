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
  Heart,
  Users,
  Building,
  FileSignature
} from "lucide-react";

const services = [
  
  {
    id: "laissezPasser",
    icon: <FileText className="w-8 h-8" />,
    title: "laissezPasser.title",
    description: "laissezPasser.description",
    link: "/espace-client/nouvelle-demande/laissez-passer",
    color: "bg-green-500"
  },
  {
    id: "consularCard",
    icon: <CreditCard className="w-8 h-8" />,
    title: "consularCard.title",
    description: "consularCard.description",
    link: "/espace-client/nouvelle-demande/consular-card",
    color: "bg-purple-500"
  },
  {
    id: "visa",
    icon: <Globe className="w-8 h-8" />,
    title: "visa.title",
    description: "visa.description",
    link: "/espace-client/nouvelle-demande/visa",
    color: "bg-orange-500"
  },
  {
    id: "procuration",
    icon: <FileSignature className="w-8 h-8" />,
    title: "procuration.title",
    description: "procuration.description",
    link: "/espace-client/nouvelle-demande/power-of-attorney",
    color: "bg-red-500"
  },
  {
    id: "birthAct",
    icon: <Heart className="w-8 h-8" />,
    title: "birthAct.title",
    description: "birthAct.description",
    link: "/espace-client/nouvelle-demande/birth-act",
    color: "bg-pink-500"
  },
  {
    id: "deathAct",
    icon: <Users className="w-8 h-8" />,
    title: "deathAct.title",
    description: "deathAct.description",
    link: "/espace-client/nouvelle-demande/death-act",
    color: "bg-gray-500"
  },
  {
    id: "marriageCapacity",
    icon: <UserCheck className="w-8 h-8" />,
    title: "marriageCapacity.title",
    description: "marriageCapacity.description",
    link: "/espace-client/nouvelle-demande/marriage-capacity",
    color: "bg-indigo-500"
  },
  {
    id: "nationality",
    icon: <Building className="w-8 h-8" />,
    title: "nationality.title",
    description: "nationality.description",
    link: "/espace-client/nouvelle-demande/nationality-certificate",
    color: "bg-teal-500"
  }
];

export default function ConsulaireForm() {
  const t = useTranslations("consulaire.services");

  return (
    <div className="py-16 bg-gray-50 min-h-[calc(100vh-70px)]">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="text-center pb-12">
          <h1 className="text-secondary text-3xl md:text-5xl font-semibold mb-4">
            {t("title")}
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link key={index} href={service.link}>
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group flex items-center gap-4">
                <div className={`p-3 rounded-lg ${service.color} text-white`}>{service.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{t(service.title)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t(service.description)}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
