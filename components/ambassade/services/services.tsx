"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { 
  Passport, 
  FileText, 
  CreditCard, 
  UserCheck, 
  Heart, 
  Users, 
  Building, 
  Globe,
  ArrowRight
} from "lucide-react";

const services = [
  {
    id: "passport",
    icon: <Passport className="w-8 h-8" />,
    title: "services.passport.title",
    description: "services.passport.description",
    link: "/passport",
    color: "bg-blue-500"
  },
  {
    id: "laissezPasser",
    icon: <FileText className="w-8 h-8" />,
    title: "services.laissezPasser.title",
    description: "services.laissezPasser.description",
    link: "/laissez-passer",
    color: "bg-green-500"
  },
  {
    id: "consularCard",
    icon: <CreditCard className="w-8 h-8" />,
    title: "services.consularCard.title",
    description: "services.consularCard.description",
    link: "/consulaire",
    color: "bg-purple-500"
  },
  {
    id: "visa",
    icon: <Globe className="w-8 h-8" />,
    title: "services.visa.title",
    description: "services.visa.description",
    link: "/consulaire",
    color: "bg-orange-500"
  },
  {
    id: "birthAct",
    icon: <Heart className="w-8 h-8" />,
    title: "services.birthAct.title",
    description: "services.birthAct.description",
    link: "/espace-client/nouvelle-demande/birth-act",
    color: "bg-pink-500"
  },
  {
    id: "deathAct",
    icon: <Users className="w-8 h-8" />,
    title: "services.deathAct.title",
    description: "services.deathAct.description",
    link: "/espace-client/nouvelle-demande/death-act",
    color: "bg-gray-500"
  },
  {
    id: "marriageCapacity",
    icon: <UserCheck className="w-8 h-8" />,
    title: "services.marriageCapacity.title",
    description: "services.marriageCapacity.description",
    link: "/espace-client/nouvelle-demande/marriage-capacity",
    color: "bg-red-500"
  },
  {
    id: "nationality",
    icon: <Building className="w-8 h-8" />,
    title: "services.nationality.title",
    description: "services.nationality.description",
    link: "/espace-client/nouvelle-demande/nationality",
    color: "bg-indigo-500"
  }
];

export default function Services() {
  const t = useTranslations("ambassade");

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center pb-12">
          <h2 className="text-secondary text-3xl md:text-5xl font-semibold mb-4">
            {t("services.title")}
          </h2>
          <p className="text-secondary text-lg md:text-xl max-w-3xl mx-auto">
            {t("services.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link key={index} href={service.link}>
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${service.color} text-white`}>
                    {service.icon}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary transition-colors" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t(service.title)}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t(service.description)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/espace-client/dashboard">
            <button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              {t("services.cta")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 