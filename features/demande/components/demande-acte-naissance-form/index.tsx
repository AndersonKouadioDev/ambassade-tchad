"use client";

import React from 'react';
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {ActeNaissanceDetailsDTO, ActeNaissanceDetailsSchema} from "@/features/demande/schema/acte-naissance.schema";
import {Genre} from "@/features/demande/types/demande.type";
import {useServicesPricesQuery} from "@/features/demande/queries/demande-services.query";
import {validateStepFields} from "@/lib/utils/multi-step-form/validate-step";
import {useMultistepForm} from "@/hooks/use-multistep-form";
import FormContainer from "@/components/form/multi-step/form-container";
import {InputField} from "@/components/form/input-field";
import StepContainer from "@/components/form/multi-step/step-container";
import SelectInputField from "@/components/form/select-input-field";
import {BirthActRequestType} from "@/types/request.types";
import {useFileUpload} from "@/hooks/use-file-upload";
import PriceViewer from "@/features/demande/components/price-viewer";
import FileUploadView from "@/components/block/file-upload-view";
import {CertificatNationaliteDetailsDTO} from "@/features/demande/schema/certificat-nationalite.schema";
import {toast} from "sonner";
import {handleFormSubmit} from "@/features/demande/utils/form-submit-handler";
import {useActeNaissanceCreateMutation} from "@/features/demande/queries/birth-acte.mutation";

function ActeNaissanceForm() {
    const {
        Field,
        handleSubmit,
        reset,
        // setFieldValue,
        validateField,
        getAllErrors,
    } = useForm({
        defaultValues: {
            personFirstName: "Jean",
            personLastName: "Dupont",
            personBirthDate: "1990-01-01",
            personBirthPlace: "Paris, France",
            personNationality: "Française",
            personDomicile: "12 rue de la Paix, Paris",
            fatherFullName: "Pierre Dupont",
            motherFullName: "Marie Dupont",
            contactPhoneNumber: "+225 01 23 456 789",
            personGender: Genre.FEMALE,
        } as ActeNaissanceDetailsDTO,
        validationLogic: revalidateLogic({
            mode: "change",
        }),
        validators: {
            onChange: ActeNaissanceDetailsSchema,
        },
        onSubmit: async ({value}) => {
            await onSubmit(value); // TODO: Implementer le submit
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
        totalSteps: 4,
        redirectPath: "/espace-client/mes-demandes?success=true",
        successCountdownDuration: 5,
    });

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

    // Recuperation du prix dynamique
    const {data: servicesPrices, isLoading: isLoadingServicesPrices} = useServicesPricesQuery();

    // Création de la demande
    const isLoading = isLoadingServicesPrices;

    const currentServicePrice = servicesPrices?.find(
        (service) => service.type === "BIRTH_ACT_APPLICATION"
    );

    const prixActe = currentServicePrice?.defaultPrice;

    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof ActeNaissanceDetailsDTO)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = [
                    "personFirstName",
                    "personLastName",
                    "personBirthDate",
                    "personBirthPlace",
                    "personNationality",
                    "personDomicile"
                ];
                break;
            case 2:
                fieldsToValidate = ["fatherFullName", "motherFullName"];
                break;
            case 3:
                fieldsToValidate = ["requestType"];
                break;
            case 4:
                fieldsToValidate = ["contactPhoneNumber"];
                break
            default:
                return true; // Pas de validation pour les étapes suivantes
        }

        return validateStepFields(
            fieldsToValidate,
            validateField,
            getAllErrors
        )
    }

    const documentsSize = 2;
    const {mutateAsync: createActeNaissance} = useActeNaissanceCreateMutation();

    const onSubmit = async (data: ActeNaissanceDetailsDTO) => {
        const uploadedFiles = files.map((file) => file.file as File);

        await handleFormSubmit({
            data,
            files: uploadedFiles,
            requiredDocumentsCount: documentsSize,
            createMutation: createActeNaissance,
            onSuccess: showSuccessAndRedirect
        });
    };

    const handleNext = () => {
        nextStep(validateStep);
    };

    type FieldStep = {
        name: keyof ActeNaissanceDetailsDTO;
        label: string;
        type: string;
        placeholder?: string;
    }

    // Definition des champs pour chaque étape
    const fieldsStep1: FieldStep[] = [
        {name: "personFirstName", label: "Prénom *", type: "text", placeholder: "Entrez le prénom"},
        {name: "personLastName", label: "Nom *", type: "text", placeholder: "Entrez le nom"},
        {name: "personBirthDate", label: "Date de naissance *", type: "date"},
        {name: "personBirthPlace", label: "Lieu de naissance *", type: "text", placeholder: "Ville, pays de naissance"},
        {name: "personNationality", label: "Nationalité *", type: "text", placeholder: "Ex: Tchadienne"},
        {name: "personDomicile", label: "Domicile (optionnel)", type: "text", placeholder: "Adresse de domicile"},
    ];

    const fieldsStep2: FieldStep[] = [
        {name: "fatherFullName", label: "Nom complet du père", type: "text", placeholder: "Nom complet du père"},
        {name: "motherFullName", label: "Nom complet de la mère", type: "text", placeholder: "Nom complet de la mère"},
    ];

    const fieldsStep3: FieldStep[] = [
        {name: "requestType", label: "Type de demande", type: "select", placeholder: "Ex: Acte de naissance"},
    ];

    const fieldsStep4: FieldStep[] = [
        {
            name: "contactPhoneNumber",
            label: "Numéro de téléphone de contact",
            type: "tel",
            placeholder: "Ex: +225 07 12 345 678"
        },
    ];

    const renderStep1 = () => (
        <StepContainer title="Informations personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldsStep1.map((item) => (
                    <Field key={item.name} name={item.name}>
                        {({state, handleChange, handleBlur}) => (
                            <InputField
                                label={item.label}
                                placeholder={item.placeholder}
                                type={item.type}
                                value={state.value}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errors={state.meta.errors![0]?.message}
                            />
                        )}
                    </Field>
                ))}
            </div>
        </StepContainer>
    );

    const renderStep2 = () => (
        <StepContainer title="Informations parentales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldsStep2.map((item) => (
                    <Field key={item.name} name={item.name}>
                        {({state, handleChange, handleBlur}) => (
                            <InputField
                                label={item.label}
                                placeholder="Ex: Mahamat"
                                type={item.type}
                                value={state.value}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errors={state.meta.errors![0]?.message}
                            />
                        )}
                    </Field>
                ))}
            </div>
        </StepContainer>
    );

    const renderStep3 = () => {
        const requestTypeLabels: Record<string, string> = {
            NEWBORN: 'Nouveau-né',
            RENEWAL: 'Renouvellement',
        };

        const options = Object.entries(BirthActRequestType).map(([value, label]) => ({
            value,
            label: requestTypeLabels[label] || label,
        }))

        return (
            <StepContainer title="Type de demande">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field name={"requestType"}>
                        {({state, handleChange, handleBlur}) => (
                            <SelectInputField
                                options={options}
                                label="Type de demande *"
                                placeholder="Sélectionnez le type de demande"
                                value={state.value}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errors={state.meta.errors![0]?.message}
                            />
                        )}
                    </Field>
                </div>
                {/* Affichage dynamique du prix */}
                <div className="flex items-center justify-end mt-4">
                    <PriceViewer price={prixActe}/>
                </div>
            </StepContainer>
        );
    }

    const renderStep4 = () => (
        <StepContainer title="Documents et récapitulatif">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4 col-span-full">
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
                {fieldsStep4.map((item) => (
                    <Field key={item.name} name={item.name}>
                        {({state, handleChange, handleBlur}) => (
                            <InputField
                                label={item.label}
                                placeholder="Ex: +221 77 123 45 67"
                                type={item.type}
                                value={state.value}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errors={state.meta.errors![0]?.message}
                            />
                        )}
                    </Field>
                ))}
            </div>
        </StepContainer>
    );

    if (showSuccess) {
        return successComponent(successCountdown);
    }

    return (
        <FormContainer
            title="Demande d'Acte de Naissance"
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
            {currentStep === 4 && renderStep4()}
        </FormContainer>
    );
}

export default ActeNaissanceForm;