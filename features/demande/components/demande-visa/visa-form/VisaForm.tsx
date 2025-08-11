"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useVisaRequestCreateMutation } from "@/features/demande/queries/demande.mutation";
import { ImageDragDrop, ImageFile } from "@/components/block/image-drap-drop";
import { useRouter } from "@/i18n/navigation";
import {
  DemandeCreateDTO,
  DemandeCreateSchema,
} from "@/features/demande/schema/demande.schema";
import { useState } from "react";
import { PassportType, VisaType } from "@/features/demande/types/visa.type";
import {
  Genre,
  IDemande,
  SituationMatrimoniale,
} from "@/features/demande/types/demande.type";

interface VisaFormProps {
  demande?: IDemande;
}

type VisaFormInputKeys =
  | keyof NonNullable<DemandeCreateDTO["visaDetails"]>
  | "contactPhoneNumber";

const REQUIRED_FIELDS: VisaFormInputKeys[] = [
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

const isFieldRequired = (fieldName: VisaFormInputKeys): boolean => {
  return REQUIRED_FIELDS.includes(fieldName);
};

const FieldLabel = ({
  name,
  label,
}: {
  name: VisaFormInputKeys;
  label: string;
}) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {label}
    {isFieldRequired(name) && <span className="text-red-500 ml-1">*</span>}
  </label>
);

export default function VisaForm({ demande }: VisaFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<DemandeCreateDTO>({
    resolver: zodResolver(DemandeCreateSchema),
    mode: "onBlur",
    defaultValues: {
      contactPhoneNumber: demande?.contactPhoneNumber || "",
      visaDetails: {
        personFirstName: demande?.visaDetails?.personFirstName || "",
        personLastName: demande?.visaDetails?.personLastName || "",
        personGender: demande?.visaDetails?.personGender || undefined,
        personNationality: demande?.visaDetails?.personNationality || "",
        personBirthDate: demande?.visaDetails?.personBirthDate || "",
        personBirthPlace: demande?.visaDetails?.personBirthPlace || "",
        personMaritalStatus:
          demande?.visaDetails?.personMaritalStatus || undefined,
        passportType: demande?.visaDetails?.passportType || undefined,
        passportNumber: demande?.visaDetails?.passportNumber || "",
        passportIssuedBy: demande?.visaDetails?.passportIssuedBy || "",
        passportIssueDate: demande?.visaDetails?.passportIssueDate || "",
        passportExpirationDate:
          demande?.visaDetails?.passportExpirationDate || "",
        profession: demande?.visaDetails?.profession || "",
        employerAddress: demande?.visaDetails?.employerAddress || "",
        employerPhoneNumber: demande?.visaDetails?.employerPhoneNumber || "",
        durationMonths: demande?.visaDetails?.durationMonths || 1,
        destinationState: demande?.visaDetails?.destinationState || "",
        visaType: demande?.visaDetails?.visaType || undefined,
      },
    },
  });

  console.log("=== WATCH INITIAL ===", watch());

  const {
    mutateAsync: createVisaRequestMutation,
    isPending: createVisaRequestPending,
  } = useVisaRequestCreateMutation();

  const t = useTranslations("espaceClient.formFields");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [uploadedFiles, setUploadedFiles] = useState<ImageFile[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return [
          "visaDetails.personFirstName",
          "visaDetails.personLastName",
          "visaDetails.personGender",
          "visaDetails.personNationality",
          "visaDetails.personBirthDate",
          "visaDetails.personBirthPlace",
          "visaDetails.personMaritalStatus",
        ];
      case 2:
        return [
          "visaDetails.passportType",
          "visaDetails.passportNumber",
          "visaDetails.passportIssuedBy",
          "visaDetails.passportIssueDate",
          "visaDetails.passportExpirationDate",
        ];
      case 3:
        return [
          "visaDetails.profession",
          "visaDetails.employerAddress",
          "visaDetails.employerPhoneNumber",
          "visaDetails.durationMonths",
          "visaDetails.destinationState",
          "visaDetails.visaType",
        ];
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

  const onSubmit = async (data: DemandeCreateDTO) => {
    try {
      await createVisaRequestMutation({
        data: data,
        uploadedFiles: uploadedFiles,
      });

      setShowSuccess(true);
      const timer = setInterval(() => {
        setSuccessCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(`/espace-client/mes-demandes?success=true`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      // console.error("Erreur lors de la soumission:", error);
    } finally {
      setCurrentStep(1);
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
            {...register("visaDetails.personFirstName")}
            placeholder="Ex: Mahamat"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.visaDetails?.personFirstName && (
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
              {errors.visaDetails.personFirstName.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personLastName" label={t("personLastName")} />
          <input
            {...register("visaDetails.personLastName")}
            placeholder="Ex: Abakar"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.visaDetails?.personLastName && (
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
              {errors.visaDetails.personLastName.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personGender" label={t("personGender")} />
          <select
            {...register("visaDetails.personGender")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez...</option>
            {Object.values(Genre).map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.visaDetails?.personGender && (
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
              {errors.visaDetails.personGender.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personNationality" label={t("personNationality")} />
          <input
            {...register("visaDetails.personNationality")}
            placeholder="Ex: Tchadienne"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.visaDetails?.personNationality && (
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
              {errors.visaDetails.personNationality.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personBirthDate" label={t("personBirthDate")} />
          <input
            type="date"
            {...register("visaDetails.personBirthDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.visaDetails?.personBirthDate && (
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
              {errors.visaDetails.personBirthDate.message}
            </div>
          )}
        </div>
        <div>
          <FieldLabel name="personBirthPlace" label={t("personBirthPlace")} />
          <input
            {...register("visaDetails.personBirthPlace")}
            placeholder="Ex: N'Djamena"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.visaDetails?.personBirthPlace && (
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
              {errors.visaDetails.personBirthPlace.message}
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
          {...register("visaDetails.personMaritalStatus")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez...</option>
          {Object.values(SituationMatrimoniale).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.visaDetails?.personMaritalStatus && (
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
            {errors.visaDetails.personMaritalStatus.message}
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
            {...register("visaDetails.passportType")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionnez le type de passeport</option>
            {Object.values(PassportType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.visaDetails?.passportType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.visaDetails.passportType.message}
            </p>
          )}
        </div>
        <div>
          <FieldLabel name="passportNumber" label={t("passportNumber")} />
          <input
            {...register("visaDetails.passportNumber")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: AB123456"
          />
          {errors.visaDetails?.passportNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.visaDetails.passportNumber.message}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <FieldLabel name="passportIssuedBy" label={t("passportIssuedBy")} />
          <input
            {...register("visaDetails.passportIssuedBy")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: République du Tchad"
          />
          {errors.visaDetails?.passportIssuedBy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.visaDetails.passportIssuedBy.message}
            </p>
          )}
        </div>
        <div>
          <FieldLabel name="passportIssueDate" label={t("passportIssueDate")} />
          <input
            type="date"
            {...register("visaDetails.passportIssueDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.visaDetails?.passportIssueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.visaDetails.passportIssueDate.message}
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
            {...register("visaDetails.passportExpirationDate")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.visaDetails?.passportExpirationDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.visaDetails.passportExpirationDate.message}
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
              {...register("visaDetails.profession")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Ingénieur"
            />
            {errors.visaDetails?.profession && (
              <p className="text-red-500 text-sm mt-1">
                {errors.visaDetails.profession.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel name="employerAddress" label={t("employerAddress")} />
            <input
              {...register("visaDetails.employerAddress")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 123 Rue de la Paix, Abidjan"
            />
            {errors.visaDetails?.employerAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.visaDetails.employerAddress.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel
              name="employerPhoneNumber"
              label={t("employerPhoneNumber")}
            />
            <input
              {...register("visaDetails.employerPhoneNumber")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: +225 01 23 45 67 89"
            />
            {errors.visaDetails?.employerPhoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.visaDetails.employerPhoneNumber.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FieldLabel name="durationMonths" label={t("durationMonths")} />
            <input
              type="number"
              {...register("visaDetails.durationMonths", {
                valueAsNumber: true,
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 3"
              min="1"
              max="12"
            />
            {errors.visaDetails?.durationMonths && (
              <p className="text-red-500 text-sm mt-1">
                {errors.visaDetails.durationMonths.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel name="destinationState" label={t("destinationState")} />
            <input
              {...register("visaDetails.destinationState")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: N'Djamena"
            />
            {errors.visaDetails?.destinationState && (
              <p className="text-red-500 text-sm mt-1">
                {errors.visaDetails.destinationState.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <FieldLabel name="visaType" label={t("visaType")} />
          <select
            {...register("visaDetails.visaType")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 uppercase"
            disabled
          >
            <option value="">Déterminé automatiquement...</option>
            {Object.values(VisaType).map((type) => (
              <option key={type} value={type}>
                {type === VisaType.SHORT_STAY ? "Court sejour" : "Long sejour"}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">
            Le type de visa est automatiquement déterminé selon la durée :
            {watch("visaDetails.durationMonths") <= 3
              ? " Court séjour"
              : " Long séjour"}
          </p>
          {errors.visaDetails?.visaType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.visaDetails.visaType.message}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Documents et récapitulatif
      </h3>
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
      <ImageDragDrop
        imageFiles={uploadedFiles}
        setImageFiles={setUploadedFiles}
        isUpdateMode={false}
      />
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
              disabled={createVisaRequestPending}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createVisaRequestPending ? "En cours..." : "Soumettre"}
              {createVisaRequestPending ? (
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
