"use client";

import {useMutation,} from '@tanstack/react-query';
import {modifierMotDePasseAction, modifierProfilAction,} from '../actions/utilisateur.action';
import {useInvalidateUtilisateurQuery} from './index.query';
import {
    UtilisateurUpdateDTO, UtilisateurUpdateMotDePasseDTO,
    UtilisateurUpdateMotDePasseSchema,
    UtilisateurUpdateSchema
} from '../schema/utilisateur.schema';
import {toast} from "sonner";
import {processAndValidateFormData} from "ak-zod-form-kit";

export const useModifierProfilMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()
    return useMutation({
        mutationFn: async ({data, id}: { data: UtilisateurUpdateDTO, id: string }) => {
            // Validation des données
            const validation = processAndValidateFormData(UtilisateurUpdateSchema, data,
                {
                    outputFormat: "object"

                })
            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            const result = await modifierProfilAction(validation.data as UtilisateurUpdateDTO,id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification de l'utilisateur");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Utilisateur modifié avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification utilisateur:", {
                description: error.message,
            });
        },
    });
};

export const useModifierMotDePasseMutation = () => {
    const invalidateUtilisateurQuery = useInvalidateUtilisateurQuery()
    return useMutation({
        mutationFn: async ({data, id}: { data: UtilisateurUpdateMotDePasseDTO, id: string }) => {
            // Validation des données
            const validation = processAndValidateFormData(UtilisateurUpdateMotDePasseSchema, data,
                {
                    outputFormat: "object"

                })
            if (!validation.success) {
                throw new Error(validation.errorsInString || "Une erreur est survenue lors de la validation des données.");
            }

            const result = await modifierMotDePasseAction(validation.data as UtilisateurUpdateMotDePasseDTO,id)
            if (!result.success) {
                throw new Error(result.error || "Erreur lors de la modification du mot de passe");
            }
            return result.data!;
        },
        onSuccess: async () => {
            await invalidateUtilisateurQuery();
            toast.success("Mot de passe modifié avec succès");
        },
        onError: async (error) => {
            toast.error("Erreur modification mot de passe:", {
                description: error.message,
            });
        },
    });
};