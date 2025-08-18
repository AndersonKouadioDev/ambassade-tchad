"use server";

import {ActionResponse, PaginatedResponse} from "@/types";
import {evenementAPI} from "../apis/evenement.api";
import {IEvenement, IEvenementRechercheParams} from "../types/evenement.type";
import {handleServerActionError} from "@/utils/handleServerActionError";

// Les gets sont appelés dans les queries
export async function getEvenementDetailAction(id: string): Promise<ActionResponse<IEvenement>> {
    try {
        if (!id || id.trim() === "") {
            throw new Error("ID de l'évènement requis.");
        }

        const evenement = await evenementAPI.getById(id);

        return {
            success: true,
            data: evenement,
            message: "Évènement récupéré avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de l'évènement.");
    }
}

export async function getEvenementTousAction(params: IEvenementRechercheParams): Promise<ActionResponse<PaginatedResponse<IEvenement>>> {
    try {
        const evenements = await evenementAPI.getAll(params);

        return {
            success: true,
            data: evenements,
            message: "Évènements récupérés avec succès.",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des évènements.");
    }
}
