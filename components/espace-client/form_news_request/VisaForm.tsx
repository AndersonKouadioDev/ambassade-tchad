"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisaRequestDetails, visaRequestDetailsSchema, VisaType } from "@/lib/validation/details-request.validation";
import type { z } from "zod";
import {
  Gender,
  MaritalStatus,
  PassportType,
  Service,
} from "@/types/request.types";
import { visaApi } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Image from "next/image";
type VisaFormInput = z.infer<typeof visaRequestDetailsSchema> & {
  contactPhoneNumber: string;
};

interface Document {
  id: number;
  name: string;
  url: string;
}

interface RequestWithRelations {
  contactPhoneNumber?: string;
  documents?: Document[];
}

interface VisaFormProps {
  request: RequestWithRelations;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const REQUIRED_FIELDS: (keyof VisaFormInput)[] = [
  "personFirstName",
  "personLastName",
  "personGender",
  "personNationality",
  "personBirthDate",
  "personBirthPlace",
  "personMaritalStatus",
  "passportType",
  "passportNumber",
  "passportIssuedBy",
  "passportIssueDate",
  "passportExpirationDate",
  "visaType",
  "durationMonths",
  "contactPhoneNumber",
];

export default function VisaForm({
  onError,
}: VisaFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("espaceClient.formFields");
  const { data: session } = useSession();
  const totalSteps = 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);
  const [prixBase, setPrixBase] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1"
          }/demandes/services`
        );
        const data = await res.json();
        const service = Array.isArray(data)
          ? (data as Service[]).find((s: Service) => s.type === "VISA")
          : Array.isArray(data.data)
          ? (data.data as Service[]).find((s: Service) => s.type === "VISA")
          : null;
        setPrixBase(service ? service.defaultPrice : null);
      } catch (error) {
        console.log(error);
        setPrixBase(null);
      }
    }
    fetchPrice();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<VisaRequestDetails>({
    resolver: zodResolver(visaRequestDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      requestId: "", // Sera généré côté client
      contactPhoneNumber: "",
      personFirstName: "",
      personLastName: "",
      personGender: undefined,
      personNationality: "",
      personBirthDate: "",
      personBirthPlace: "",
      personMaritalStatus: undefined,
      passportType: undefined,
      passportNumber: "",
      passportIssuedBy: "",
      passportIssueDate: "",
      passportExpirationDate: "",
      profession: "",
      employerAddress: "",
      employerPhoneNumber: "",
      durationMonths: 1,
      destinationState: "",
      visaType: undefined,
    },
  });

  // Générer le requestId côté client pour éviter les erreurs d'hydratation
  useEffect(() => {
    setValue("requestId", crypto.randomUUID());
  }, [setValue]);

  // Calcul du prix en fonction de la durée
  const durationMonths = watch("durationMonths");
  // Prix dynamique : si prixBase existe, applique la logique de durée, sinon fallback
  const prixVisa =
    prixBase !== null
      ? durationMonths && durationMonths > 3
        ? prixBase * 2
        : prixBase
      : durationMonths && durationMonths > 3
      ? 70000
      : 35000;

  // Synchronisation automatique du type de visa
  useEffect(() => {
    if (typeof durationMonths === "number" && durationMonths > 0) {
      const visaType =
        durationMonths <= 3 ? VisaType.SHORT_STAY : VisaType.LONG_STAY;
      setValue("visaType", visaType);
      trigger("visaType");
    }
  }, [durationMonths, setValue, trigger]);

  const isFieldRequired = (fieldName: keyof VisaFormInput): boolean => {
    return REQUIRED_FIELDS.includes(fieldName);
  };

  const FieldLabel = ({
    name,
    label,
  }: {
    name: keyof VisaFormInput;
    label: string;
  }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {isFieldRequired(name) && <span className="text-red-500 ml-1">*</span>}
    </label>
  );


  const getFieldsForStep = (step: number): (keyof VisaFormInput)[] => {
    switch (step) {
      case 1:
        return [
          "personFirstName",
          "personLastName",
          "personGender",
          "personNationality",
          "personBirthDate",
          "personBirthPlace",
          "personMaritalStatus",
        ];
      case 2:
        return [
          "passportType",
          "passportNumber",
          "passportIssuedBy",
          "passportIssueDate",
          "passportExpirationDate",
        ];
      case 3:
        return [
          "profession",
          "employerAddress",
          "employerPhoneNumber",
          "durationMonths",
          "destinationState",
          "visaType",
        ]; // 'visaExpirationDate' retiré car optionnel
      case 4:
        return ["contactPhoneNumber"];
      default:
        return [];
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const valid = await trigger(fields as Parameters<typeof trigger>[0]);
    if (valid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: VisaFormInput) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      onError?.("Au moins un fichier justificatif est obligatoire.");
      return;
    }
    setIsSubmitting(true);
    // Retirer contactPhoneNumber de visaDetails
    const { contactPhoneNumber, ...visaDetails } = data;

    try {
      // Récupérer le token de session NextAuth
      const token = (session?.user)?.token;

      if (!token) {
        onError?.("Session non valide. Veuillez vous reconnecter.");
        return;
      }

      const result = await visaApi.create(
        visaDetails, // sans contactPhoneNumber
        contactPhoneNumber, // à la racine
        uploadedFiles,
        token
      );

      if (result.success) {
        setShowSuccess(true);
        const timer = setInterval(() => {
          setSuccessCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push(`/${locale}/espace-client/mes-demandes?success=true`);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        onError?.(result.error || "Erreur lors de la création de la demande");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      onError?.("Une erreur inattendue s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations personnelles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel name="personFirstName" label={t("personFirstName")} />
          <input
            {...register("personFirstName")}
            placeholder="Ex: Mahamat"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personFirstName && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
              {errors.personFirstName.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personLastName" label={t("personLastName")} />
          <input
            {...register("personLastName")}
            placeholder="Ex: Abakar"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personLastName && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
              {errors.personLastName.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personGender" label={t("personGender")} />
          <select
            {...register("personGender")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez...</option>
            {Object.values(Gender).map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.personGender && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
              {errors.personGender.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personNationality" label={t("personNationality")} />
          <input
            {...register("personNationality")}
            placeholder="Ex: Tchadienne"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personNationality && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
              {errors.personNationality.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personBirthDate" label={t("personBirthDate")} />
          <input
            type="date"
            {...register("personBirthDate")}
            placeholder="JJ/MM/AAAA"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personBirthDate && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
              {errors.personBirthDate.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personBirthPlace" label={t("personBirthPlace")} />
          <input
            {...register("personBirthPlace")}
            placeholder="Ex: N'Djamena"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.personBirthPlace && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
                />
              </svg>
              {errors.personBirthPlace.message}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <FieldLabel
          name="personMaritalStatus"
          label={t("personMaritalStatus")}
        />
        <select
          {...register("personMaritalStatus")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez...</option>
          {Object.values(MaritalStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.personMaritalStatus && (
          <div className="flex items-center mt-1 text-red-600 text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
              />
            </svg>
            {errors.personMaritalStatus.message}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations du passeport
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel name="passportType" label={t("passportType")} />
          <select
            {...register("passportType")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez le type de passeport</option>
            {Object.values(PassportType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.passportType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passportType.message}
            </p>
          )}
        </div>
        <div>
          <FieldLabel name="passportNumber" label={t("passportNumber")} />
          <input
            {...register("passportNumber")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: AB123456"
          />
          {errors.passportNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passportNumber.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <FieldLabel name="passportIssuedBy" label={t("passportIssuedBy")} />
          <input
            {...register("passportIssuedBy")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: République du Tchad"
          />
          {errors.passportIssuedBy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passportIssuedBy.message}
            </p>
          )}
        </div>
        <div>
          <FieldLabel name="passportIssueDate" label={t("passportIssueDate")} />
          <input
            type="date"
            {...register("passportIssueDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.passportIssueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passportIssueDate.message}
            </p>
          )}
        </div>
        <div>
          <FieldLabel
            name="passportExpirationDate"
            label={t("passportExpirationDate")}
          />
          <input
            type="date"
            {...register("passportExpirationDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.passportExpirationDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passportExpirationDate.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations professionnelles et visa
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <FieldLabel name="profession" label={t("personProfession")} />
            <input
              {...register("profession")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Ingénieur"
            />
            {errors.profession && (
              <p className="text-red-500 text-sm mt-1">
                {errors.profession.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel name="employerAddress" label={t("employerAddress")} />
            <input
              {...register("employerAddress")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 123 Rue de la Paix, Abidjan"
            />
            {errors.employerAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.employerAddress.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel
              name="employerPhoneNumber"
              label={t("employerPhoneNumber")}
            />
            <input
              {...register("employerPhoneNumber")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: +225 01 23 45 67 89"
            />
            {errors.employerPhoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.employerPhoneNumber.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FieldLabel name="durationMonths" label={t("durationMonths")} />
            <input
              type="number"
              {...register("durationMonths", {
                valueAsNumber: true,
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 3"
              min="1"
              max="12"
            />
            {errors.durationMonths && (
              <p className="text-red-500 text-sm mt-1">
                {errors.durationMonths.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel name="destinationState" label={t("destinationState")} />
            <input
              {...register("destinationState")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: N'Djamena"
            />
            {errors.destinationState && (
              <p className="text-red-500 text-sm mt-1">
                {errors.destinationState.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <FieldLabel name="visaType" label={t("visaType")} />
          <select
            {...register("visaType")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 uppercase"
            disabled
          >
            <option value="">Déterminé automatiquement...</option>
            {Object.values(VisaType).map((type) => (
              <option key={type} value={type}>
                {type === VisaType.SHORT_STAY
                  ? "Court sejour"
                  : "Long sejour"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Le type de visa est automatiquement déterminé selon la durée :
            {durationMonths <= 3 ? " Court séjour" : " Long séjour"}
          </p>
          {errors.visaType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.visaType.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end mt-4">
          <span className="text-lg font-semibold text-green-700">
            Prix à payer : {prixVisa.toLocaleString()} FCFA
          </span>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Documents et récapitulatif
      </h3>
      {/* Champ numéro de contact déplacé ici */}
      <div className="mb-4">
        <FieldLabel name="contactPhoneNumber" label={t("contactPhoneNumber")} />
        <input
          {...register("contactPhoneNumber")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Numéro de téléphone"
        />
        {errors.contactPhoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contactPhoneNumber.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Documents à joindre <span className="text-red-500">*</span>
        </label>
        <div
          className={
            `w-full border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ` +
            `hover:border-blue-400 bg-gray-50`
          }
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              setUploadedFiles((prev) => [
                ...prev,
                ...Array.from(e.dataTransfer.files),
              ]);
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
              }
            }}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-blue-700 font-semibold">
              Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
            </span>
            <span className="text-xs text-gray-500">
              Formats acceptés : PDF, images. Plusieurs fichiers possibles.
            </span>
            <span className="text-xs text-gray-500">
              {uploadedFiles.length} fichier
              {uploadedFiles.length > 1 ? "s" : ""} sélectionné
              {uploadedFiles.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        {uploadedFiles.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-4">
            {uploadedFiles.map((file, idx) => (
              <li
                key={idx}
                className="relative flex flex-col items-center w-24"
              >
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded shadow border"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded shadow border">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                )}
                <span
                  className="text-xs mt-1 truncate w-full text-center"
                  title={file.name}
                >
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFiles((prev) =>
                      prev.filter((_, i) => i !== idx)
                    );
                  }}
                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-100"
                  title="Supprimer"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        {isSubmitting && uploadedFiles.length === 0 && (
          <p className="text-red-500 text-xs mt-1">
            Au moins un fichier justificatif est obligatoire.
          </p>
        )}
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-white rounded-xl shadow-md">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="white"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2l4-4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Demande envoyée avec succès !
        </h2>
        <p className="text-gray-700 mb-4">
          Vous allez être redirigé vers vos demandes dans {successCountdown}{" "}
          seconde{successCountdown > 1 ? "s" : ""}...
        </p>
        <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-green-500 transition-all duration-1000"
            style={{ width: `${(successCountdown / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Demande de Visa
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Étape {currentStep} sur {totalSteps}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="flex justify-between pt-6 border-t border-gray-200">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Précédent
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Suivant
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : (
                "Soumettre la demande"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
