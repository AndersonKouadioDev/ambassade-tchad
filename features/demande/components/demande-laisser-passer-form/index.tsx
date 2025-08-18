'use client';

import { revalidateLogic, useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { toast } from "sonner";
import { useServicesPricesQuery } from "../../queries/demande-services.query";
import { formatCurrency } from "@/utils/format-currency";
import { useFileUpload } from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import { useLaissezPasserCreateMutation } from "../../queries/laisser-passer.mutation";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import { LaissezPasserDetailsDTO, LaissezPasserDetailsSchema, AccompagnateurDTO } from "../../schema/laissez-passer.schema";
import { DocumentJustificationType } from "../../types/carte-consulaire.type";
import { Button } from "@heroui/react";
import AccompagnateurForm from "./accompagnateur-form";

interface Props {
    documentsSize: number;
}

export default function LaisserPasserForm({ documentsSize }: Props) {
    const [showAccompagnateurForm, setShowAccompagnateurForm] = useState(false);
    const [currentAccompagnateurIndex, setCurrentAccompagnateurIndex] = useState<number | null>(null);
    const [accompanied, setAccompanied] = useState(false);
    const [accompaniers, setAccompaniers] = useState<AccompagnateurDTO[]>([]);

    const { Field, handleSubmit, validateField, getAllErrors } = useForm({
        defaultValues: {
            personFirstName: 'Jean',
            personLastName: 'Dupont',
            personBirthDate: '1985-05-15',
            personBirthPlace: 'Paris',
            personNationality: 'Française',
            personDomicile: '12 Rue de la République, 75001 Paris',
            personProfession: 'Consultant IT',
            fatherFullName: 'Pierre Dupont',
            motherFullName: 'Marie Dupont',
            justificationDocumentType: DocumentJustificationType.PASSPORT,
            justificationDocumentNumber: '12AB34567',
            destination: 'Abidjan',
            travelReason: 'Mission professionnelle',
            contactPhoneNumber: '+33123456789',
            accompanied: false,
        } as LaissezPasserDetailsDTO,
        validationLogic: revalidateLogic({ mode: "change" }),
        validators: {
            onChange: LaissezPasserDetailsSchema,
        },
        onSubmit: async ({ value }) => {
            await onSubmit({
                ...value,
                accompaniers,
            });
        },
    });

    const {
        currentStep,
        totalSteps,
        showSuccess,
        successCountdown,
        showSuccessAndRedirect,
        successComponent,
        nextStep,
        prevStep,
    } = useMultistepForm({
        totalSteps: 3,
        redirectPath: "/espace-client/mes-demandes?success=true",
        successCountdownDuration: 5,
    });

    const maxFiles = 10;
    const maxSizeMB = 20;
    const [
        { files, isDragging, errors: fileErrors },
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

    const { data: servicesPrices, isLoading: servicesPricesLoading } =
        useServicesPricesQuery();

    const {
        mutateAsync: createLaissezPasser,
        isPending: createLaissezPasserLoading,
    } = useLaissezPasserCreateMutation();

    const isLoading = servicesPricesLoading || createLaissezPasserLoading;
    const currentServicePrice = servicesPrices?.find(
        (service) => service.type === "LAISSEZ_PASSER"
    );
    const prixActe = currentServicePrice?.defaultPrice;

    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof LaissezPasserDetailsDTO)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = [
                    "personFirstName",
                    "personLastName",
                    "personBirthDate",
                    "personBirthPlace",
                    "personNationality",
                    "personDomicile",
                ];
                break;
            case 2:
                fieldsToValidate = [
                    "fatherFullName",
                    "motherFullName",
                    "justificationDocumentType",
                    "justificationDocumentNumber",
                ];

                if (accompanied && accompaniers.length === 0) {
                    toast.error("Veuillez ajouter au moins un accompagnateur");
                    return false;
                }
                break;
            case 3:
                fieldsToValidate = ["contactPhoneNumber"];
                break;
            default:
                return true;
        }

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

    const onSubmit = async (data: LaissezPasserDetailsDTO) => {
        const uploadedFiles = files.map((file) => file.file as File);

        const dataForSubmit: LaissezPasserDetailsDTO = {
            ...data,
            documents: uploadedFiles,
        };

        if (uploadedFiles.length < documentsSize) {
            toast.error(
                `Veuillez télécharger tous ${documentsSize} documents requis`
            );
            return;
        }

        try {
            await createLaissezPasser({ data: dataForSubmit });
            showSuccessAndRedirect();
        } catch (error) {
            toast.error("Une erreur est survenue lors de la soumission du formulaire");
        }
    };

    const fieldsStep1: {
        name: keyof Omit<LaissezPasserDetailsDTO, "documents" | "accompaniers">;
        label: string;
        type?: string;
        placeholder?: string;
    }[] = [
            { name: "personFirstName", label: "Prénom *", type: "text", placeholder: "ex: Mahamat" },
            { name: "personLastName", label: "Nom *", type: "text", placeholder: "ex: Doe" },
            { name: "personBirthDate", label: "Date de naissance *", type: "date", placeholder: "ex: 2000-01-01" },
            { name: "personBirthPlace", label: "Lieu de naissance *", type: "text", placeholder: "ex: Douala" },
            { name: "personNationality", label: "Nationalité *", type: "text", placeholder: "ex: Camerounais" },
            { name: "personDomicile", label: "Domicile *", type: "text", placeholder: "ex: Douala" },
            { name: "personProfession", label: "Profession", type: "text" },
        ];

    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldsStep1.map((item) => (
                    <Field key={item.name} name={item.name}>
                        {({ state, handleChange, handleBlur }) => (
                            <InputField
                                label={item.label}
                                placeholder={item.placeholder}
                                type={item.type}
                                value={state.value as string ?? ''}
                                onChange={(value) => handleChange(value as string)}
                                onBlur={handleBlur}
                                errors={(state.meta.errors?.[0] as { message?: string })?.message}
                                required={item.label.includes("*")}
                            />
                        )}
                    </Field>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations familiales et documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field name="fatherFullName">
                    {({ state, handleChange, handleBlur }) => (
                        <InputField
                            label="Nom complet du père *"
                            placeholder="Ex: Pierre Dupont"
                            type="text"
                            value={state.value}
                            onChange={(value) => handleChange(value as string)}
                            onBlur={handleBlur}
                            errors={state.meta.errors?.[0]?.message}
                            required
                        />
                    )}
                </Field>

                <Field name="motherFullName">
                    {({ state, handleChange, handleBlur }) => (
                        <InputField
                            label="Nom complet de la mère *"
                            placeholder="Ex: Marie Dupont"
                            type="text"
                            value={state.value}
                            onChange={(value) => handleChange(value as string)}
                            onBlur={handleBlur}
                            errors={state.meta.errors?.[0]?.message}
                            required
                        />
                    )}
                </Field>

                <Field name="justificationDocumentType">
                    {({ state, handleChange, handleBlur }) => (
                        <div className="col-span-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type de document justificatif *
                            </label>
                            <select
                                value={state.value}
                                onChange={(e) => handleChange(e.target.value as DocumentJustificationType)}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-2 border rounded-md ${state.meta.errors?.length ? "border-red-500" : "border-gray-300"
                                    }`}
                            >
                                {Object.values(DocumentJustificationType).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {state.meta.errors?.length > 0 && (
                                <p className="text-red-500 text-xs mt-1">
                                    {state.meta.errors[0]?.message}
                                </p>
                            )}
                        </div>
                    )}
                </Field>

                <Field name="justificationDocumentNumber">
                    {({ state, handleChange, handleBlur }) => (
                        <InputField
                            label="Numéro du document justificatif *"
                            placeholder="Ex: 123456789"
                            type="text"
                            value={state.value}
                            onChange={(value) => handleChange(value as string)}
                            onBlur={handleBlur}
                            errors={state.meta.errors?.[0]?.message}
                            required
                        />
                    )}
                </Field>

                <Field name="destination">
                    {({ state, handleChange, handleBlur }) => (
                        <InputField
                            label="Destination"
                            placeholder="Ex: France"
                            type="text"
                            value={state.value}
                            onChange={(value) => handleChange(value as string)}
                            onBlur={handleBlur}
                            errors={state.meta.errors?.[0]?.message}
                        />
                    )}
                </Field>

                <Field name="travelReason">
                    {({ state, handleChange, handleBlur }) => (
                        <InputField
                            label="Motif du voyage"
                            placeholder="Ex: Voyage d'affaires"
                            type="text"
                            value={state.value}
                            onChange={(value) => handleChange(value as string)}
                            onBlur={handleBlur}
                            errors={state.meta.errors?.[0]?.message}
                        />
                    )}
                </Field>

                <Field name="accompanied">
                    {({ state, handleChange }) => (
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="accompanied"
                                checked={state.value}
                                onChange={(e) => {
                                    handleChange(e.target.checked);
                                    setAccompanied(e.target.checked);
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="accompanied" className="ml-2 block text-sm text-gray-900">
                                Voyage accompagné
                            </label>
                        </div>
                    )}
                </Field>

                {accompanied && (
                    <div className="col-span-full mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Accompagnateurs</h4>
                            <Button
                                onPress={() => {
                                    setCurrentAccompagnateurIndex(null);
                                    setShowAccompagnateurForm(true);
                                }}
                                color="warning"
                            >
                                + Ajouter
                            </Button>
                        </div>

                        {showAccompagnateurForm && (
                            <AccompagnateurForm
                                onSave={async (data) => {
                                    console.log(data);
                                    if (currentAccompagnateurIndex !== null) {
                                        // Modification
                                        const updated = [...accompaniers];
                                        updated[currentAccompagnateurIndex] = data;
                                        setAccompaniers(updated);
                                    } else {
                                        // Ajout
                                        setAccompaniers([...accompaniers, data]);
                                    }
                                    setShowAccompagnateurForm(false);
                                }}
                                onCancel={() => setShowAccompagnateurForm(false)}
                                initialData={
                                    currentAccompagnateurIndex !== null
                                        ? accompaniers[currentAccompagnateurIndex]
                                        : undefined
                                }
                            />
                        )}

                        {accompaniers.length > 0 ? (
                            <div className="space-y-2 mt-2">
                                {accompaniers.map((acc, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200"
                                    >
                                        <span>
                                            {acc.firstName} {acc.lastName} ({acc.nationality})
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                onPress={() => {
                                                    setCurrentAccompagnateurIndex(index);
                                                    setShowAccompagnateurForm(true);
                                                }}
                                                color="success"
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                onPress={() => {
                                                    setAccompaniers(accompaniers.filter((_, i) => i !== index));
                                                }}
                                                color="danger"
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2">
                                Aucun accompagnateur ajouté
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Récapitulatif et pièces justificatives
            </h3>

            <div className="mb-4">
                <span className="text-lg font-semibold text-green-700">
                    Prix à payer : {formatCurrency(prixActe ?? 5000)}
                </span>
            </div>

            <Field name="contactPhoneNumber">
                {({ state, handleChange, handleBlur }) => (
                    <InputField
                        label="Numéro de contact"
                        placeholder="Ex: +225 01 23 45 67 89"
                        type="tel"
                        value={state.value}
                        onChange={(value) => handleChange(value as string)}
                        onBlur={handleBlur}
                        errors={state.meta.errors?.[0]?.message}
                        className="mb-6"
                    />
                )}
            </Field>

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
                    errors={fileErrors}
                    removeFile={removeFile}
                    clearFiles={clearFiles}
                    getInputProps={getInputProps}
                />
            </div>
        </div>
    );

    if (showSuccess) {
        return successComponent(successCountdown);
    }

    return (
        <FormContainer
            title="Formulaire de demande de Laissez-passer"
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