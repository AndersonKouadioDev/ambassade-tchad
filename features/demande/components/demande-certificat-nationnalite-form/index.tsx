"use client";

import {revalidateLogic, useForm} from "@tanstack/react-form";
import React from "react";
import {toast} from "sonner";
// import {useParams} from "next/navigation";
import {PaysParentType} from "../../types/certificat-nationalite.type";
import {useServicesPricesQuery} from "../../queries/demande-services.query";
import {formatCurrency} from "@/utils/format-currency";
import {
    CertificatNationaliteDetailsDTO,
    CertificatNationaliteDetailsSchema,
} from "../../schema/certificat-nationalite.schema";
import {useFileUpload} from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import {useCertificatNationaliteCreateMutation} from "../../queries/certificat-nationalite.mutation";
import {useMultistepForm} from "@/hooks/use-multistep-form";
import {InputField} from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";

interface Props {
    documentsSize: number;
}

export default function CertificatNationaliteForm({documentsSize}: Props) {
    // Validation du formulaire
    const {
        Field,
        handleSubmit,
        // reset,
        // setFieldValue,
        validateField,
        getAllErrors,
    } = useForm({
        defaultValues: {
            //   serviceType: ServiceType.NATIONALITY_CERTIFICATE,
            applicantFirstName: "John",
            applicantLastName: "Doe",
            applicantBirthDate: "1990-01-01",
            applicantBirthPlace: "New York",
            applicantNationality: "United States",
            originCountryParentFirstName: "John",
            originCountryParentLastName: "Doe",
            originCountryParentRelationship: PaysParentType.FATHER,
            contactPhoneNumber: "+11234567890",
            documents: [],
        } as CertificatNationaliteDetailsDTO,
        validationLogic: revalidateLogic({
            mode: "change",
        }),
        validators: {
            onChange: CertificatNationaliteDetailsSchema,
        },
        onSubmit: async ({value}) => {
            await onSubmit(value);
        },
    });

    const {
        currentStep,
        totalSteps,
        showSuccess,
        successCountdown,
        showSuccessAndRedirect,
        nextStep,
        prevStep
    } = useMultistepForm({
        totalSteps: 3,
        redirectPath: "/espace-client/mes-demandes?success=true",
        successCountdownDuration: 5,
    })

    const maxFiles = 10;
    const maxSizeMB = 20;
    const [
        {files, isDragging, errors},
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            clearFiles,
            getInputProps,
        },
    ] = useFileUpload({
        multiple: true,
        maxFiles,
        maxSize: maxSizeMB * 1024 * 1024,
        initialFiles: [],
    });

    //   Récupération du prix dynamique
    const {data: servicesPrices, isLoading: servicesPricesLoading} =
        useServicesPricesQuery();

    // Création de la demande
    const {
        mutateAsync: createCertificatNationalite,
        isPending: createCertificatNationaliteLoading,
    } = useCertificatNationaliteCreateMutation();

    const isLoading = servicesPricesLoading || createCertificatNationaliteLoading;

    const currentServicePrice = servicesPrices?.find(
        (service) => service.type === "NATIONALITY_CERTIFICATE"
    );
    const prixActe = currentServicePrice?.defaultPrice;

    // const params = useParams();

    // Fonction pour valider les champs d'une étape spécifique
    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof CertificatNationaliteDetailsDTO)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = [
                    "applicantFirstName",
                    "applicantLastName",
                    "applicantBirthDate",
                    "applicantBirthPlace",
                    "applicantNationality",
                ];
                break;
            case 2:
                fieldsToValidate = [
                    "originCountryParentFirstName",
                    "originCountryParentLastName",
                    "originCountryParentRelationship",
                ];
                break;
            case 3:
                fieldsToValidate = ["contactPhoneNumber"];
                // Validation des fichiers uploadés
                if (files.length === 0) {
                    toast.error("Veuillez télécharger au moins un fichier justificatif");
                    return false;
                }
                break;
            default:
                return true;
        }

        // Valider chaque champ de l'étape
        let isValid = true;
        for (const fieldName of fieldsToValidate) {
            try {
                await validateField(fieldName, "change");
            } catch (validationError: any) {
                isValid = false;
                const errorMessage =
                    validationError?.message || `Erreur de validation pour ${fieldName}`;
                toast.error(errorMessage);
            }
        }

        const errors = getAllErrors();
        if (Object.keys(errors.fields).length > 0) {
            isValid = false;
        }

        return isValid;
    };

    const handleNext = () => {
        nextStep(validateStep);
    };

    const onSubmit = async (data: CertificatNationaliteDetailsDTO) => {
        const uploadedFiles = files.map((file) => file.file as File);

        const dataForSubmit: CertificatNationaliteDetailsDTO = {
            ...data,
            documents: uploadedFiles,
        };
        console.log("documentsSize", documentsSize);
        // Validation finale avant soumission
        if (uploadedFiles.length < documentsSize) {
            toast.error(
                `Veuillez télécharger tous ${documentsSize} documents requis`
            );
            console.log(
                `Veuillez télécharger tous ${documentsSize} documents requis`
            );
            return;
        }
        console.log(dataForSubmit, "documentsSize", documentsSize);
        try {
            await createCertificatNationalite({data: dataForSubmit});
            showSuccessAndRedirect()
        } catch (error) {
            console.log(error);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field name="applicantFirstName">
                    {({state, handleChange, handleBlur}) => (
                        <InputField
                            label="Prénom *"
                            placeholder="Ex: Mahamat"
                            value={state.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={state.meta.errors}
                        />
                    )}
                </Field>
                <Field name="applicantLastName">
                    {({state, handleChange, handleBlur}) => (
                        <InputField
                            label="Nom *"
                            placeholder="Ex: Abakar"
                            value={state.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={state.meta.errors}
                        />
                    )}
                </Field>
                <Field name="applicantBirthDate">
                    {({state, handleChange, handleBlur}) => (
                        <InputField
                            label="Date de naissance *"
                            type="date"
                            placeholder="Date de naissance"
                            value={state.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={state.meta.errors}
                        />
                    )}
                </Field>
                <Field name="applicantBirthPlace">
                    {({state, handleChange, handleBlur}) => (
                        <InputField
                            label="Lieu de naissance *"
                            placeholder="Ex: N'Djamena"
                            value={state.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={state.meta.errors}
                        />
                    )}
                </Field>
                <Field name="applicantNationality">
                    {({state, handleChange, handleBlur}) => (
                        <InputField
                            label="Nationalité *"
                            placeholder="Ex: Tchadienne"
                            value={state.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={state.meta.errors}
                        />
                    )}
                </Field>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations sur le parent d'origine et contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field name="originCountryParentFirstName">
                    {({state, handleChange, handleBlur}) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prénom du parent *
                            </label>
                            <input
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder="Ex: Youssouf"
                                className={`w-full px-4 py-2 border rounded-md ${
                                    state.meta.errors?.length
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {state.meta.errors?.length > 0 && (
                                <p className="text-red-500 text-xs mt-1">
                                    {state.meta.errors![0]?.message}
                                </p>
                            )}
                        </div>
                    )}
                </Field>
                <Field name="originCountryParentLastName">
                    {({state, handleChange, handleBlur}) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du parent *
                            </label>
                            <input
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder="Ex: Abakar"
                                className={`w-full px-4 py-2 border rounded-md ${
                                    state.meta.errors?.length
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {state.meta.errors?.length > 0 && (
                                <p className="text-red-500 text-xs mt-1">
                                    {state.meta.errors![0]?.message}
                                </p>
                            )}
                        </div>
                    )}
                </Field>
                <Field name="originCountryParentRelationship">
                    {({state, handleChange, handleBlur}) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lien de parenté *
                            </label>
                            <select
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value as PaysParentType)}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border rounded-md ${
                                    state.meta.errors?.length
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value={PaysParentType.FATHER}>Père</option>
                                <option value={PaysParentType.MOTHER}>Mère</option>
                            </select>
                            {state.meta.errors?.length > 0 && (
                                <p className="text-red-500 text-xs mt-1">
                                    {state.meta.errors![0]?.message}
                                </p>
                            )}
                        </div>
                    )}
                </Field>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Récapitulatif et pièce justificative
            </h3>
            <div className="mb-4">
        <span className="text-lg font-semibold text-green-700">
          Prix à payer : {formatCurrency(prixActe ?? 5000)}
        </span>
            </div>
            <div className="mb-4">
                <FileUploadView
                    maxFiles={maxFiles}
                    maxSizeMB={maxSizeMB}
                    openFileDialog={openFileDialog}
                    handleDragEnter={handleDragEnter}
                    handleDragLeave={handleDragLeave}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    files={files}
                    isDragging={isDragging}
                    errors={errors}
                    removeFile={removeFile}
                    clearFiles={clearFiles}
                    getInputProps={getInputProps}
                />
            </div>
            <div className="mb-4">
                <Field name="contactPhoneNumber">
                    {({state, handleChange, handleBlur}) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Numéro de contact *
                            </label>
                            <input
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                placeholder="Ex: +225 01 23 45 67 89"
                                className={`w-full px-4 py-2 border rounded-md ${
                                    state.meta.errors?.length
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {state.meta.errors?.length > 0 && (
                                <p className="text-red-500 text-xs mt-1">
                                    {state.meta.errors![0]?.message}
                                </p>
                            )}
                        </div>
                    )}
                </Field>
            </div>
        </div>
    );

    if (showSuccess) {
        return (
            <div
                className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center mt-16">
                <svg
                    className="w-16 h-16 text-green-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                    Demande envoyée avec succès&nbsp;!
                </h2>
                <p className="text-gray-700 mb-4">
                    Vous allez être redirigé vers vos demandes dans {successCountdown}{" "}
                    seconde{successCountdown > 1 ? "&nbsp;s" : ""}...
                </p>
                <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-2 bg-green-500 transition-all duration-1000"
                        style={{width: `${(successCountdown / 5) * 100}%`}}
                    ></div>
                </div>
            </div>
        );
    }

    return (
        <FormContainer
            title="Formulaire de demande de Certificat de Nationalité"
            currentStep={currentStep}
            totalSteps={totalSteps}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            handleNext={handleNext}
            isLoading={isLoading}
        >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </FormContainer>
    );
}
