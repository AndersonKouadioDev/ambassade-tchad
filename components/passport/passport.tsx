"use client";

import React from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { Button, Link } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export default function PassportForm() {
  const t = useTranslations("passport.form");

  return (
    <div className="relative flex items-center justify-center p-10 w-full min-h-[calc(100vh-70px)]">
      {/* Background image */}
      <Image
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/images/backgrounds/background_2.png"
        alt="Background image"
        fill
      />
      <div className="absolute inset-0 bg-blue-800/50" />

      {/* Form */}
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Close button */}
        <Link href="/" className="absolute right-4 top-4">
          <button className="text-gray-500 hover:text-gray-700">✕</button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-600 mb-4">{t("title")}</h1>
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/assets/images/illustrations/formulaire/logo.png"
              alt="Logo"
              width={300}
              height={150}
              className="mx-2"
            />
          </div>
        </div>

        {/* Photo upload area */}
        <div className="w-32 h-40 mx-auto mb-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white bg-opacity-80 relative">
          <Images className="mx-auto mb-2 text-gray-400" size={24} />
          <input
            type="file"
            name="image"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder={t("placeholders.lastName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
          <input
            type="text"
            placeholder={t("placeholders.firstName")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
          <input
            type="text"
            placeholder={t("placeholders.birthDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
          <input
            type="text"
            placeholder={t("placeholders.birthPlace")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
          <input
            type="text"
            placeholder={t("placeholders.nationality")}
            className="w-full px-4 py-2 border border-gray-300 rounded-full"
          />
          <select className="w-full px-4 py-2 border border-gray-300 rounded-full">
            <option value="">{t("placeholders.gender")}</option>
            <option value="M">{t("genderOptions.M")}</option>
            <option value="F">{t("genderOptions.F")}</option>
          </select>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-full">
            <option value="">{t("placeholders.familyStatus")}</option>
            <option value="single">{t("familyStatusOptions.single")}</option>
            <option value="married">{t("familyStatusOptions.married")}</option>
            <option value="divorced">{t("familyStatusOptions.divorced")}</option>
            <option value="widowed">{t("familyStatusOptions.widowed")}</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <Link href="/passport/condition">
            <Button className="bg-transparent text-secondary border border-secondary">
              {t("buttons.seeConditions")}
            </Button>
          </Link>
          <Button color="secondary" className="text-white">
            {t("buttons.submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
