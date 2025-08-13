"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseMultistepFormOptions {
  totalSteps: number;
  initialStep?: number;
  redirectPath?: string;
  successCountdownDuration?: number;
}

export function useMultistepForm({
  totalSteps,
  initialStep = 1,
  redirectPath = "/espace-client/mes-demandes?success=true",
  successCountdownDuration = 5,
}: UseMultistepFormOptions) {
  // États pour gérer l'étape courante, le succès et le compte à rebours
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(
    successCountdownDuration
  );
  const router = useRouter();

  // Fonction pour passer à l'étape suivante avec validation
  const nextStep = async (validateStep: (step: number) => Promise<boolean>) => {
    const valid = await validateStep(currentStep);
    if (valid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour aller à une étape spécifique
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  // Fonction pour afficher le succès et déclencher la redirection
  const showSuccessAndRedirect = () => {
    setCurrentStep(1);
    setShowSuccess(true);

    // Démarrer le compte à rebours avant redirection
    const timer = setInterval(() => {
      setSuccessCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // router.push(redirectPath); //TODO activer la redirection
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return {
    currentStep,
    totalSteps,
    showSuccess,
    successCountdown,
    nextStep,
    prevStep,
    goToStep,
    showSuccessAndRedirect,
    successComponent,
  };
}

function successComponent(successCountdown: number) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center mt-16">
      <svg
        className="w-16 h-16 text-green-500 mb-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <h2 className="text-2xl font-bold text-green-700 mb-2">
        Demande envoyée avec succès !
      </h2>
      <p className="text-gray-700 mb-4">
        Vous allez être redirigé vers vos demandes dans {successCountdown}{" "}
        seconde{successCountdown > 1 ? "s" : ""}...
      </p>
      <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-2 bg-green-500 transition-all duration-1000"
          style={{ width: `${(successCountdown / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
