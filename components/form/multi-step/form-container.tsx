import React from "react";
import ProgressBar from "@/components/form/progress-bar";
import { Button } from "@/components/ui/button";

type FormContainerProps = {
  title: string;
  currentStep: number;
  totalSteps: number;
  handleSubmit: () => void;
  children: React.ReactNode;
  handleNext: () => void;
  prevStep?: () => void;
  isLoading?: boolean;
};

function FormContainer({
  title,
  currentStep,
  totalSteps,
  handleSubmit,
  children,
  handleNext,
  prevStep,
  isLoading,
}: FormContainerProps) {
  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-xl">
      {/*<h1 className="text-3xl font-bold text-center mb-6 text-gray-900">*/}
      {/*  {title}*/}
      {/*</h1>*/}
      {/* Barre de progression */}
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
        <div className="flex justify-between items-center mt-6">
          {currentStep > 1 && (
            <Button type="button" onClick={prevStep} variant="outline">
              Précédent
            </Button>
          )}
          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Suivant
            </Button>
          ) : (
            <Button
              variant="secondary"
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Envoi en cours..." : "Soumettre la demande"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormContainer;
