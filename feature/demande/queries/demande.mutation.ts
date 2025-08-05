import {
    useMutation,
} from '@tanstack/react-query';
import {
    createDemandRequestAction,
} from '../actions/demande.action';
import { useInvalidateDemandeQuery } from './index.query';
import { toast } from "sonner";
import { DemandCreateDTO, DemandCreateSchema, DemandUpdateDTO, DemandUpdateSchema } from '../schema/demande.schema';
import { processAndValidateFormData } from 'ak-zod-form-kit';
import { VisaRequestDetails, visaRequestDetailsSchema } from '@/lib/validation/details-request.validation';

export const useCreateDemandRequestMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async (data: DemandCreateDTO) => {
            const result = processAndValidateFormData(DemandCreateSchema, data, {
                outputFormat: "formData"
            });
            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }
            return createDemandRequestAction(result.data as FormData);

        },
        onSuccess: async () => {
            await invalidateDemandeQuery();
            toast.success("Demande créée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur lors de la création de la demande:", {
                description: error.message,
            });
        },
    });
};

export const useVisaRequestCreateMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async (data: VisaRequestDetails) => {
            const result = processAndValidateFormData(visaRequestDetailsSchema, data, {
                outputFormat: "formData"
            });
            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }
            return createVisaRequestAction(result.data as FormData);

        },
        onSuccess: async () => {
            await invalidateDemandeQuery();
            toast.success("Demande créée avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur lors de la création de la demande:", {
                description: error.message,
            });
        },
    });
};

