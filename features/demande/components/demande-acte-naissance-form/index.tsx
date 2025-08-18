"use client";

import FileUploadView from "@/components/block/file-upload-view";
import { InputField } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import StepContainer from "@/components/form/multi-step/step-container";
import SelectInputField from "@/components/form/select-input-field";
import PriceViewer from "@/features/demande/components/price-viewer";
import { useActeNaissanceCreateMutation } from "@/features/demande/queries/birth-acte.mutation";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import {
  ActeNaissanceDetailsDTO,
  ActeNaissanceDetailsSchema,
} from "@/features/demande/schema/acte-naissance.schema";
import { Genre } from "@/features/demande/types/demande.type";
import { handleFormSubmit } from "@/features/demande/utils/form-submit-handler";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { validateStepFields } from "@/lib/utils/multi-step-form/validate-step";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { ActeNaissanceType } from "../../types/acte-naissance.type";

function ActeNaissanceForm({ documentsSize }: { documentsSize: number }) {
  const { Field, handleSubmit, validateField, getAllErrors } = useForm({
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
      requestType: ActeNaissanceType.NEWBORN,
    } as ActeNaissanceDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: ActeNaissanceDetailsSchema,
    },
    onSubmit: async ({ value }) => {
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

  const maxFiles = 10;
  const maxSizeMB = 20;
  const [
    { files, isDragging, errors },
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
  const { data: servicesPrices, isLoading: isLoadingServicesPrices } =
    useServicesPricesQuery();

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
          "personDomicile",
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
        break;
      default:
        return true; // Pas de validation pour les étapes suivantes
    }

    return validateStepFields(fieldsToValidate, validateField, getAllErrors);
  };

  const { mutateAsync: createActeNaissance } = useActeNaissanceCreateMutation();

  const onSubmit = async (data: ActeNaissanceDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    await handleFormSubmit({
      data,
      files: uploadedFiles,
      requiredDocumentsCount: documentsSize,
      createMutation: createActeNaissance,
      onSuccess: showSuccessAndRedirect,
    });
  };

  const handleNext = () => {
    nextStep(validateStep);
  };

  type FieldStep = {
    name: keyof Omit<ActeNaissanceDetailsDTO, "documents">;
    label: string;
    type: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
  };

  // Definition des champs pour chaque étape
  const fieldsStep1: FieldStep[] = [
    {
      name: "personFirstName",
      label: "Prénom *",
      type: "text",
      placeholder: "Entrez le prénom",
    },
    {
      name: "personLastName",
      label: "Nom *",
      type: "text",
      placeholder: "Entrez le nom",
    },
    { name: "personBirthDate", label: "Date de naissance *", type: "date" },
    {
      name: "personBirthPlace",
      label: "Lieu de naissance *",
      type: "text",
      placeholder: "Ville, pays de naissance",
    },
    {
      name: "personNationality",
      label: "Nationalité *",
      type: "text",
      placeholder: "Ex: Tchadienne",
    },
    {
      name: "personDomicile",
      label: "Domicile (optionnel)",
      type: "text",
      placeholder: "Adresse de domicile",
    },
  ];

  const fieldsStep2: FieldStep[] = [
    {
      name: "fatherFullName",
      label: "Nom complet du père",
      type: "text",
      placeholder: "Nom complet du père",
    },
    {
      name: "motherFullName",
      label: "Nom complet de la mère",
      type: "text",
      placeholder: "Nom complet de la mère",
    },
  ];

  const fieldsStep3: FieldStep[] = [
    {
      name: "contactPhoneNumber",
      label: "Numéro de téléphone de contact",
      type: "tel",
      placeholder: "Ex: +225 07 12 345 678",
    },
    {
      name: "requestType",
      label: "Type de demande",
      type: "select",
      placeholder: "Ex: Acte de naissance",
      options: Object.values(ActeNaissanceType).map((value) => ({
        value: value,
        label: value,
      })),
    },
  ];

  const renderStep1 = () => (
    <StepContainer title="Informations personnelles">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep1.map((item) => (
          <Field key={item.name} name={item.name}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as string)}
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
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder="Ex: Mahamat"
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as string)}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
              />
            )}
          </Field>
        ))}
      </div>
    </StepContainer>
  );

  const renderStep3 = () => (
    <StepContainer title="Informations sur le mandataire">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep3.map((item) => (
          <Field key={item.name} name={item.name}>
            {({ state, handleChange, handleBlur }) =>
              item.type === "select" ? (
                <SelectInputField
                  label={item.label}
                  value={state.value}
                  onChange={(value) => handleChange(value as string)}
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
                  onChange={(value) => handleChange(value as string)}
                  onBlur={handleBlur}
                  errors={state.meta.errors![0]?.message}
                />
              )
            }
          </Field>
        ))}
        {documentsSize > 0 && (
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
        )}
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
    </FormContainer>
  );
}

export default ActeNaissanceForm;
