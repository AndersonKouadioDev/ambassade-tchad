"use client";

import React from 'react';
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {
    CarteConsulaireDetailsDTO,
    CarteConsulaireDetailsSchema
} from "@/features/demande/schema/carte-consulaire.schema";
import {useMultistepForm} from "@/hooks/use-multistep-form";
import {DocumentJustificationType} from "@/features/demande/types/carte-consulaire.type";
import {useServicesPricesQuery} from "@/features/demande/queries/demande-services.query";
import {validateStepFields} from "@/lib/utils/multi-step-form/validate-step";
import {handleFormSubmit} from "@/features/demande/utils/form-submit-handler";
import {useFileUpload} from "@/hooks/use-file-upload";
import {useCarteConsulaireCreateMutation} from "@/features/demande/queries/carte-consulaire.mutation";
import StepContainer from "@/components/form/multi-step/step-container";
import {InputField} from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import PriceViewer from "@/features/demande/components/price-viewer";
import FileUploadView from "@/components/block/file-upload-view";
import SelectInputField from "@/components/form/select-input-field";

function CarteConsulaireForm() {
    const {
        Field,
        handleSubmit,
        // reset,
        // setFieldValue,
        validateField,
        getAllErrors,
    } = useForm({
        defaultValues: {
            personFirstName: "Jean",
            personLastName: "Dupont",
            personBirthDate: "1990-05-15",
            personBirthPlace: "Abidjan",
            personProfession: "Ingénieur",
            personNationality: "Ivoirienne",
            personDomicile: "Paris, France",
            personAddressInOriginCountry: "Cocody, Abidjan",
            fatherFullName: "Pierre Dupont",
            motherFullName: "Marie Dupont",
            justificationDocumentType: DocumentJustificationType.NATIONAL_ID_CARD,
            justificationDocumentNumber: "A123456789",
            contactPhoneNumber: "+2250701020304",
        } as CarteConsulaireDetailsDTO,
        validationLogic: revalidateLogic({
            mode: "change",
        }),
        validators: {
            onChange: CarteConsulaireDetailsSchema,
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
        successComponent,
        nextStep,
        prevStep,
    } = useMultistepForm({
        totalSteps: 3,
        redirectPath: "/espace-client/mes-demandes?success=true",
        successCountdownDuration: 5,
    });

    // File upload configuration
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

    const isLoading = isLoadingServicesPrices;

    const currentServicePrice = servicesPrices?.find(
        (service) => service.type === "CONSULAR_CARD"
    );

    const prixActe = currentServicePrice?.defaultPrice;

    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof CarteConsulaireDetailsDTO)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = [
                    "personFirstName",
                    "personLastName",
                    "personBirthDate",
                    "personBirthPlace",
                    "personNationality",
                    "personProfession",
                    "personDomicile",
                    "personAddressInOriginCountry"
                ];
                break;
            case 2:
                fieldsToValidate = [
                    "fatherFullName",
                    "motherFullName",
                    "justificationDocumentType",
                    "justificationDocumentNumber"
                ];
                break;
            case 3:
                fieldsToValidate = ["contactPhoneNumber"];
                break;
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
    const {mutateAsync: createCarteConsulaire} = useCarteConsulaireCreateMutation();

    const onSubmit = async (data: CarteConsulaireDetailsDTO) => {
        const uploadedFiles = files.map((file) => file.file as File);

        await handleFormSubmit({
            data,
            files: uploadedFiles,
            requiredDocumentsCount: documentsSize,
            createMutation: createCarteConsulaire,
            onSuccess: showSuccessAndRedirect
        });
    };

    const handleNext = () => {
        nextStep(validateStep);
    };

    // TODO: Repetition of the same code in acte-naissance
    type FieldStep = {
        name: keyof Omit<CarteConsulaireDetailsDTO, 'documents'>;
        label: string;
        type: string;
        placeholder?: string;
        options?: { value: string; label: string }[];
    }

    const fields: FieldStep[][] = [
        [
            {name: "personFirstName", label: "Prénom", type: "text"},
            {name: "personLastName", label: "Nom", type: "text"},
            {name: "personBirthDate", label: "Date de naissance", type: "date"},
            {name: "personBirthPlace", label: "Lieu de naissance", type: "text"},
            {name: "personProfession", label: "Profession", type: "text"},
            {name: "personNationality", label: "Nationalité", type: "text"},
            {name: "personDomicile", label: "Domicile actuel", type: "text"},
            {name: "personAddressInOriginCountry", label: "Adresse dans le pays d'origine", type: "text"}
        ],
        [
            {name: "fatherFullName", label: "Nom complet du père", type: "text"},
            {name: "motherFullName", label: "Nom complet de la mère", type: "text"},
            {
                name: "justificationDocumentType",
                label: "Type de document justificatif",
                type: "select",
                placeholder: "",
                options: [
                    {value: DocumentJustificationType.NATIONAL_ID_CARD, label: "Carte d'identité nationale"},
                    {value: DocumentJustificationType.PASSPORT, label: "Passeport"},
                    {value: DocumentJustificationType.BIRTH_CERTIFICATE, label: "Acte de naissance"},
                    {value: DocumentJustificationType.OTHER, label: "Autre"}
                ]
            },
            {
                name: "justificationDocumentNumber",
                label: "Numéro du document justificatif",
                type: "text"
            }
        ],
        [
            {
                name: 'contactPhoneNumber',
                label: 'Numéro de téléphone de contact',
                type: 'tel',
                placeholder: '+2250701020304'
            }
        ]
    ];

    const renderStep1 = () => (
        <StepContainer title="Informations personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields[0].map((item) => (
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
        <StepContainer title="Filiation, justificatif et contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields[1].map((item) => (
                    <Field key={item.name} name={item.name}>
                        {({state, handleChange, handleBlur}) => (
                            item.type === 'select' ? (
                                <SelectInputField
                                    label={item.label}
                                    value={state.value}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    errors={state.meta.errors![0]?.message}
                                    options={item.options ?? []}
                                    placeholder={item.placeholder}
                                />
                            ) : (
                                <InputField
                                    label={item.label}
                                    placeholder={item.placeholder}
                                    type={item.type}
                                    value={state.value}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    errors={state.meta.errors![0]?.message}
                                />
                            )
                        )}
                    </Field>
                ))}
            </div>
        </StepContainer>
    );

    const renderStep3 = () => (
        <StepContainer title="Récapitulatif et pièce justificative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                    <PriceViewer price={prixActe}/>
                </div>
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
                {fields[2].map((item) => (
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

    if (showSuccess) {
        return successComponent(successCountdown);
    }

    return (
        <FormContainer
            title="Formulaire de demande de Carte Consulaire"
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

export default CarteConsulaireForm;