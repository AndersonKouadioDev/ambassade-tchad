"use client";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format-currency";

import { useFileUpload } from "@/hooks/use-file-upload";
import FileUploadView from "@/components/block/file-upload-view";
import { useMultistepForm } from "@/hooks/use-multistep-form";
import { InputField, InputFieldTypeProps } from "@/components/form/input-field";
import FormContainer from "@/components/form/multi-step/form-container";
import {
  Genre,
  SituationMatrimoniale,
} from "@/features/demande/types/demande.type";
import { PassportType, VisaType } from "@/features/demande/types/visa.type";
import {
  VisaRequestDetailsDTO,
  VisaRequestDetailsSchema,
} from "@/features/demande/schema/visa.schema";
import { useServicesPricesQuery } from "@/features/demande/queries/demande-services.query";
import { useVisaCreateMutation } from "@/features/demande/queries/visa.mutation";

interface Props {
  documentsSize: number;
}

export default function VisaForm({ documentsSize }: Props) {
  // Validation du formulaire
  const {
    Field,
    handleSubmit,
    validateField,
    getAllErrors,
    getFieldValue,
    setFieldValue,
  } = useForm({
    defaultValues: {
      personFirstName: "John",
      personLastName: "Doe",
      personGender: Genre.MALE,
      personNationality: "Tchadienne",
      personBirthDate: "2000-01-01",
      personBirthPlace: "N'Djamena",
      personMaritalStatus: SituationMatrimoniale.SINGLE,
      passportType: PassportType.ORDINARY,
      passportNumber: "123456789",
      passportIssuedBy: "Ministère de l'Intérieur",
      passportIssueDate: "2020-01-01",
      passportExpirationDate: "2025-01-01",
      profession: "Employé",
      employerAddress: "123 Main St, N'Djamena",
      employerPhoneNumber: "123-456-7890",
      durationMonths: 1,
      destinationState: "N'Djamena",
      visaType: VisaType.SHORT_STAY,
      contactPhoneNumber: "123-456-7890",
      documents: [],
    } as VisaRequestDetailsDTO,
    validationLogic: revalidateLogic({
      mode: "change",
    }),
    validators: {
      onChange: VisaRequestDetailsSchema,
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
    totalSteps: 4,
    redirectPath: "/espace-client/mes-demandes?success=true",
    successCountdownDuration: 5,
  });

  const durationMonths = getFieldValue("durationMonths");

  useEffect(() => {
    if (durationMonths <= 3) {
      setFieldValue("visaType", VisaType.SHORT_STAY);
    } else {
      setFieldValue("visaType", VisaType.LONG_STAY);
    }
  }, [durationMonths]);

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
  const { mutateAsync: createVisa, isPending: createVisaLoading } =
    useVisaCreateMutation();

  const isLoading = servicesPricesLoading || createVisaLoading;

  const currentServicePrice = servicesPrices?.find(
    (service) => service.type === "VISA"
  );
  const prixActe = currentServicePrice?.defaultPrice;

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof VisaRequestDetailsDTO)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "personFirstName",
          "personLastName",
          "personGender",
          "personNationality",
          "personBirthDate",
          "personBirthPlace",
          "personMaritalStatus",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "passportType",
          "passportNumber",
          "passportIssuedBy",
          "passportIssueDate",
          "passportExpirationDate",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "profession",
          "employerAddress",
          "employerPhoneNumber",
          "durationMonths",
          "destinationState",
        ];
        break;
      case 4:
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
        toast.error(
          validationError?.message || `Erreur de validation pour ${fieldName}`
        );
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

  const onSubmit = async (data: VisaRequestDetailsDTO) => {
    const uploadedFiles = files.map((file) => file.file as File);

    const visaType =
      data.durationMonths <= 3 ? VisaType.SHORT_STAY : VisaType.LONG_STAY;

    const dataForSubmit: VisaRequestDetailsDTO = {
      ...data,
      visaType: visaType,
      documents: uploadedFiles,
    };

    if (uploadedFiles.length < documentsSize) {
      toast.error(
        `Veuillez télécharger les ${documentsSize} documents requis.`
      );
      return;
    }
    try {
      await createVisa({ data: dataForSubmit });
      showSuccessAndRedirect();
    } catch (error) {
    }
  };

  const fieldsStep1: {
    name: keyof Omit<VisaRequestDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    options?: any;
    placeholder: string;
  }[] = [
    {
      name: "personFirstName",
      label: "Prénom *",
      type: "text",
      placeholder: "Ex: Mahamat",
    },
    {
      name: "personLastName",
      label: "Nom *",
      type: "text",
      placeholder: "Ex: Abakar",
    },
    {
      name: "personGender",
      label: "Genre *",
      type: "select",
      options: Object.values(Genre),
      placeholder: "",
    },
    {
      name: "personNationality",
      label: "Nationalité *",
      type: "text",
      placeholder: "Ex: Tchadienne",
    },
    {
      name: "personBirthDate",
      label: "Date de naissance *",
      type: "date",
      placeholder: "",
    },
    {
      name: "personBirthPlace",
      label: "Lieu de naissance *",
      type: "text",
      placeholder: "Ex: N'Djamena",
    },
    {
      name: "personMaritalStatus",
      label: "Situation Matrimoniale *",
      type: "select",
      options: Object.values(SituationMatrimoniale),
      placeholder: "",
    },
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations personnelles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep1.map((item) => (
          <Field key={item.name} name={item.name as any}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as any)}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
                options={item.options}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );

  const fieldsStep2: {
    name: keyof Omit<VisaRequestDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    options?: any;
    placeholder: string;
  }[] = [
    {
      name: "passportType",
      label: "Type de passeport *",
      type: "select",
      options: Object.values(PassportType),
      placeholder: "",
    },
    {
      name: "passportNumber",
      label: "Numéro de passeport *",
      type: "text",
      placeholder: "Ex: AB123456",
    },
    {
      name: "passportIssuedBy",
      label: "Pays de délivrance *",
      type: "text",
      placeholder: "Ex: République du Tchad",
    },
    {
      name: "passportIssueDate",
      label: "Date de délivrance *",
      type: "date",
      placeholder: "",
    },
    {
      name: "passportExpirationDate",
      label: "Date d'expiration *",
      type: "date",
      placeholder: "",
    },
  ];

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations du passeport
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep2.map((item) => (
          <Field key={item.name} name={item.name as any}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as any)}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
                options={item.options}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );

  const fieldsStep3: {
    name: keyof Omit<VisaRequestDetailsDTO, "documents">;
    label: string;
    type?: InputFieldTypeProps;
    placeholder: string;
  }[] = [
    {
      name: "profession",
      label: "Profession *",
      type: "text",
      placeholder: "Ex: Ingénieur",
    },
    {
      name: "employerAddress",
      label: "Adresse de l'employeur *",
      type: "text",
      placeholder: "Ex: 123 Rue de la Paix, Abidjan",
    },
    {
      name: "employerPhoneNumber",
      label: "Téléphone de l'employeur *",
      type: "text",
      placeholder: "Ex: +225 01 23 45 67 89",
    },
    {
      name: "durationMonths",
      label: "Durée du séjour (en mois) *",
      type: "number",
      placeholder: "Ex: 3",
    },
    {
      name: "destinationState",
      label: "Ville de destination *",
      type: "text",
      placeholder: "Ex: N'Djamena",
    },
  ];

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Informations professionnelles et visa
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fieldsStep3.map((item) => (
          <Field key={item.name} name={item.name as any}>
            {({ state, handleChange, handleBlur }) => (
              <InputField
                label={item.label}
                placeholder={item.placeholder}
                type={item.type}
                value={state.value}
                onChange={(value) => handleChange(value as any)}
                onBlur={handleBlur}
                errors={state.meta.errors![0]?.message}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Récapitulatif et pièces justificatives
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
          errors={fileErrors}
          removeFile={removeFile}
          clearFiles={clearFiles}
          getInputProps={getInputProps}
        />
      </div>
      <div className="mb-4">
        <Field name="contactPhoneNumber">
          {({ state, handleChange, handleBlur }) => (
            <InputField
              label="Numéro de contact *"
              placeholder="Ex: +225 01 23 45 67 89"
              type="text"
              value={state.value}
              onChange={(value) => handleChange(value as any)}
              onBlur={handleBlur}
              errors={state.meta.errors![0]?.message}
            />
          )}
        </Field>
      </div>
    </div>
  );

  if (showSuccess) {
    return successComponent(successCountdown);
  }

  return (
    <FormContainer
      title="Formulaire de demande de Visa"
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
