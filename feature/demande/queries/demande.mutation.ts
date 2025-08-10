import {
    useMutation,
} from '@tanstack/react-query';
import {
    createDemandRequestAction,
} from '../actions/demande.action';
import { useInvalidateDemandeQuery } from './index.query';
import { toast } from "sonner";
import { DemandeCreateDTO, DemandeCreateSchema } from '../schema/demande.schema';
import { processAndValidateFormData } from 'ak-zod-form-kit';
import { ImageFile } from '@/components/block/image-drap-drop';
import { ServiceType } from '../types/service.type';

export const useVisaRequestCreateMutation = () => {
    const invalidateDemandeQuery = useInvalidateDemandeQuery();

    return useMutation({
        mutationFn: async ({ data, uploadedFiles }: { data: DemandeCreateDTO, uploadedFiles: ImageFile[] }) => {
            if (!uploadedFiles || uploadedFiles.length === 0) {
                throw new Error("Au moins un fichier justificatif est obligatoire.");
            }
            const files = uploadedFiles
                .filter((file) => file.file !== undefined)
                .map((file) => file.file);

            const createData = {
                ...data,
                serviceType: ServiceType.VISA,
                documents: files
            }
            console.log({ createData });

            const result = processAndValidateFormData(DemandeCreateSchema, createData, {
                outputFormat: "formData"
            });

            console.log({ result });

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

