"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button, Input, Select, SelectItem, Card, CardBody, CardHeader, Divider, Progress, Textarea } from "@heroui/react";
import { createDemande } from "@/src/actions/demande-request.action";

interface StepField {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "textarea";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface MultiStepDemandeFormProps<T> {
  steps: { title: string; fields: StepField[] }[];
  schema: any; // Zod schema
  type: string; // ex: 'CONSULAR_CARD'
  detailsKey: string; // ex: 'consularCardDetails'
  contactField: string; // ex: 'contact' ou 'contactPhoneNumber'
}

export default function MultiStepDemandeForm<T extends Record<string, any>>({ steps, schema, type, detailsKey, contactField }: MultiStepDemandeFormProps<T>) {
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const totalSteps = steps.length + 1; // +1 pour la pièce jointe

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useForm<T>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep - 1]?.fields.map(f => f.name) || [];
    const isValidStep = await trigger(fieldsToValidate as any);
    if (isValidStep && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: T) => {
    setIsSubmitting(true);
    try {
      // Construction de l'objet details avec normalisation des dates
      function normalizeDate(dateStr: string) {
        if (!dateStr) return "";
        if (dateStr.length > 10) return dateStr;
        const d = new Date(dateStr);
        return d.toISOString();
      }
      const details: Record<string, any> = {};
      Object.keys(data).forEach(key => {
        if (key !== contactField) {
          if (key.toLowerCase().includes("date")) {
            details[key] = normalizeDate((data as any)[key]);
          } else {
            details[key] = (data as any)[key];
          }
        }
      });
      const result = await createDemande({
        type,
        details,
        contactPhoneNumber: (data as any)[contactField],
        documents: uploadedFiles,
        locale,
        tokenFromClient: session?.user?.token,
      });
      if (result.success) {
        router.push(`/${locale}/espace-client/mes-demandes?success=true`);
      } else {
        alert(result.error || "Erreur lors de la création de la demande");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (currentStep <= steps.length) {
      const step = steps[currentStep - 1];
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
          {step.fields.map(field => {
            if (field.type === "select") {
              return (
                <Select
                  key={field.name}
                  {...register(field.name as any)}
                  label={field.label}
                  placeholder={field.placeholder}
                  isInvalid={!!errors[field.name as keyof T]}
                  errorMessage={(errors[field.name as keyof T] as any)?.message}
                  variant="bordered"
                >
                  {field.options?.map(opt => (
                    <SelectItem key={opt.value}>{opt.label}</SelectItem>
                  ))}
                </Select>
              );
            }
            if (field.type === "textarea") {
              return (
                <Textarea
                  key={field.name}
                  {...register(field.name as any)}
                  label={field.label}
                  placeholder={field.placeholder}
                  isInvalid={!!errors[field.name as keyof T]}
                  errorMessage={(errors[field.name as keyof T] as any)?.message}
                  variant="bordered"
                />
              );
            }
            return (
              <Input
                key={field.name}
                {...register(field.name as any)}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                isInvalid={!!errors[field.name as keyof T]}
                errorMessage={(errors[field.name as keyof T] as any)?.message}
                variant="bordered"
              />
            );
          })}
        </div>
      );
    } else {
      // Étape fichiers
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Documents à joindre</h3>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</p>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <Button size="sm" color="danger" variant="light" onPress={() => removeFile(index)}>Supprimer</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-0">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Formulaire de demande</h2>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" color="primary" />
          <p className="text-sm text-gray-600 mt-2">Étape {currentStep} sur {totalSteps}</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderStep()}
          <Divider />
          <div className="flex justify-between">
            <Button type="button" variant="bordered" onPress={prevStep} isDisabled={currentStep === 1}>Précédent</Button>
            {currentStep < totalSteps ? (
              <Button type="button" color="primary" onPress={nextStep}>Suivant</Button>
            ) : (
              <Button type="submit" color="primary" isLoading={isSubmitting} isDisabled={!isValid}>{isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}</Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
} 