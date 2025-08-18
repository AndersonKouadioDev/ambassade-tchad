import {
    useMutation,
} from '@tanstack/react-query';
import {
    createDemandRequestAction,
} from '../actions/demande.action';
import { useInvalidateDemandeQuery } from './index.query';
import { toast } from "sonner";
import { processAndValidateFormData } from 'ak-zod-form-kit';
import { DemandeCreateSchema } from '../schema/demande.schema';
import { ServiceType } from '../types/service.type';
import { MariageDetailsDTO } from '../schema/mariage.schema';

export const useMariageCreateMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async ({ data }: { data: MariageDetailsDTO }) => {

            const { contactPhoneNumber, documents, ...marriageCapacityActDetails } = data;

            const dataForSubmit = {
                marriageCapacityActDetails : JSON.stringify(marriageCapacityActDetails),
                // serviceType: ServiceType.NATIONALITY_CERTIFICATE,
                contactPhoneNumber,
                documents,
            };

            const result = processAndValidateFormData(DemandeCreateSchema, dataForSubmit, {
                outputFormat: "formData"
            });

            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }
            // Ajouter le type de service
            (result.data as FormData).append("serviceType", ServiceType.MARRIAGE_CAPACITY_ACT);

            // Envoyer les données au serveur
            const response = await createDemandRequestAction(result.data as FormData);

            if (!response.success) {
                throw new Error(response.error!);
            }

            return response.data!;

        },
        onSuccess: async () => {
            await invalidateDemandeQuery();
            toast.success("Demande créée avec succès");
        },
        onError: async (error) => {
            toast.error(error.message);
        },
    });
};

