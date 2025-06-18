"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PassportForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const t = useTranslations("home.passportForm");

  return (
    <div className="flex flex-col gap-2">
      <Button color="secondary" className="text-white" onPress={onOpen}>
        {t("open")}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        aria-labelledby="modal-title"
        aria-describedby="modal-content"
        className="overflow-y-auto"
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {t("title")}
          </ModalHeader>
          <ModalBody className="max-h-[80vh] w-auto overflow-y-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-gray-600 mb-4">{t("title")}</h1>
              <div className="flex items-center justify-center gap-4">
                <div className="h-1 w-12 bg-blue-600" />
                <Image
                  src="/assets/images/illustrations/formulaire/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="mx-2"
                />
                <div className="h-1 w-12 bg-red-600" />
              </div>
              <div className="text-blue-700 font-bold text-xl mt-2">
                {t("ambassy")}
              </div>
            </div>

            {/* Photo */}
            <div className="w-32 h-40 mx-auto mb-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Image
                src="/assets/images/backgrounds/background_2.png"
                alt="Upload"
                width={24}
                height={24}
                className="opacity-50"
              />
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="nom"
                  placeholder={t("name")}
                  className="border border-gray-400 placeholder-gray-400 rounded-full px-3 py-2 focus:outline-none"
                />
                <input
                  type="text"
                  name="prenom"
                  placeholder={t("surname")}
                  className="border border-gray-400 placeholder-gray-400 rounded-full px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  name="date-naissance"
                  className="border border-gray-400 rounded-full px-3 py-2 focus:outline-none"
                />
                <input
                  type="text"
                  name="lieu-naissance"
                  placeholder={t("birthPlace")}
                  className="border border-gray-400 placeholder-gray-400 rounded-full px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="nationalite"
                  placeholder={t("nationality")}
                  className="border border-gray-400 placeholder-gray-400 rounded-full px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <select
                  name="sexe"
                  className="border border-gray-400 rounded-full px-3 py-2 focus:outline-none"
                >
                  <option value="">{t("gender")}</option>
                  <option value="M">{t("male")}</option>
                  <option value="F">{t("female")}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <select
                  name="situation-familiale"
                  className="border border-gray-400 rounded-full px-3 py-2 focus:outline-none"
                >
                  <option value="">{t("familyStatus")}</option>
                  <option value="single">{t("single")}</option>
                  <option value="married">{t("married")}</option>
                  <option value="divorced">{t("divorced")}</option>
                  <option value="widowed">{t("widowed")}</option>
                </select>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" variant="light" onPress={onOpenChange}>
              {t("close")}
            </Button>
            <Button color="primary" onPress={onOpenChange}>
              {t("submit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
