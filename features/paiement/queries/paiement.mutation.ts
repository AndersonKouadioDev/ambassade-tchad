import {
    useMutation,
} from '@tanstack/react-query';
import {
    pay,
} from '../paiement.action';
import { toast } from "sonner";
import { processAndValidateFormData } from 'ak-zod-form-kit';
import { useInvalidatePaiementQuery } from './index.query';
import { CreatePaiementKkiapayDTO, createPaiementKkiapaySchema } from '../paiement.schema';

export const usePaiementCreateMutation = () => {
    const invalidatePaiementQuery = useInvalidatePaiementQuery();

    return useMutation({
        mutationFn: async ({ data }: { data: CreatePaiementKkiapayDTO }) => {
            console.log(data);
            const result = processAndValidateFormData(createPaiementKkiapaySchema, data, {
                outputFormat: "object",
                transformations: {
                    transactionRef: (value) => value.toString().trim(),
                    ticketNumber: (value) => value.toString().trim(),
                },
            });
            console.log(result);
            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Envoyer les données au serveur
            const response = await pay(result.data as CreatePaiementKkiapayDTO);

            if (!response.success) {
                throw new Error(response.error!);
            }

            return response.data!;

        },
        onSuccess: async () => {
            await invalidatePaiementQuery();
            toast.success("Paiement effectué avec succès");
        },
        onError: async (error) => {
            toast.error(error.message);
        },
    });
};

