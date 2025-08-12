import {useState} from "react";
import {useRouter} from "next/navigation";

interface UseMultistepFormOptions {
    totalSteps: number;
    initialStep?: number;
    redirectPath?: string;
    successCountdownDuration?: number;
}

export function useMultistepForm({
                                     totalSteps,
                                     initialStep = 1,
                                     redirectPath = '/espace-client/mes-demandes?success=true',
                                     successCountdownDuration = 5,
                                 }: UseMultistepFormOptions) {
    // États pour gérer l'étape courante, le succès et le compte à rebours
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successCountdown, setSuccessCountdown] = useState(successCountdownDuration);
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
                    router.push(redirectPath);
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
    };
}