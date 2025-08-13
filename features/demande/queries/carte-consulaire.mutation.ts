import {useInvalidateDemandeQuery} from "@/features/demande/queries/index.query";
import {useMutation} from "@tanstack/react-query";
import {processAndValidateFormData} from "ak-zod-form-kit";
import {DemandeCreateSchema} from "@/features/demande/schema/demande.schema";
import {ServiceType} from "@/features/demande/types/service.type";
import {createDemandRequestAction} from "@/features/demande/actions/demande.action";
import {toast} from "sonner";
import {CarteConsulaireDetailsDTO} from "@/features/demande/schema/carte-consulaire.schema";

export const useCarteConsulaireCreateMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async ({ data }: { data: CarteConsulaireDetailsDTO }) => {
            const { contactPhoneNumber, documents, ...consularCardDetails } = data;

            const dataForSubmit = {
                consularCardDetails,
                contactPhoneNumber,
                documents,
            }

            console.log("data", dataForSubmit);

            const result = processAndValidateFormData(DemandeCreateSchema, dataForSubmit, {
                outputFormat: "formData"
            });

            if (!result.success) {
                throw new Error(result.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            // Ajouter le type de service
            (result.data as FormData).append("serviceType", ServiceType.CONSULAR_CARD);

            // Envoyer les données au serveur
            const response = await createDemandRequestAction(result.data as FormData);

            console.log(response);

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