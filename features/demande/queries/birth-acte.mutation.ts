import { useInvalidateDemandeQuery } from "@/features/demande/queries/index.query";
import { useMutation } from "@tanstack/react-query";
import { ActeNaissanceDetailsDTO } from "@/features/demande/schema/acte-naissance.schema";
import { processAndValidateFormData } from "ak-zod-form-kit";
import { DemandeCreateSchema } from "@/features/demande/schema/demande.schema";
import { ServiceType } from "@/features/demande/types/service.type";
import { createDemandRequestAction } from "@/features/demande/actions/demande.action";
import { toast } from "sonner";

export const useActeNaissanceCreateMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async ({ data }: { data: ActeNaissanceDetailsDTO }) => {
            const { contactPhoneNumber, documents, ...birthActDetails } = data;

            const dataForSubmit = {
                birthActDetails: JSON.stringify(birthActDetails),
                contactPhoneNumber,
                documents,
            }

            const result = processAndValidateFormData(DemandeCreateSchema, dataForSubmit, {
                outputFormat: "formData"
            });

            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Ajouter le type de service
            (result.data as FormData).append("serviceType", ServiceType.BIRTH_ACT_APPLICATION);

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
    })
}