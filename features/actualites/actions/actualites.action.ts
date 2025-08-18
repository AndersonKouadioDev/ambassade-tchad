"use server";
import { ActionResponse, PaginatedResponse } from "@/types";
import { actualiteAPI } from "../api/actualites.api";
import { IActualite, IActualiteRechercheParams } from "../types/actualites.type";
import { handleServerActionError } from "@/utils/handleServerActionError";

export async function getActualitesDetailAction(id: string): Promise<ActionResponse<IActualite>> {
    try {
        const actualite = await actualiteAPI.getById(id);
        return {
            success: true,
            data: actualite,
            message: "Actualité récupérée avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la récupération de l'actualité.");
    }
}

export async function getActualitesTousAction(params: IActualiteRechercheParams):
    Promise<ActionResponse<PaginatedResponse<IActualite>>> {
    try {
        const actualites = await actualiteAPI.getAll(params);
        return {
            success: true,
            data: actualites,
            message: "Actualités récupérées avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la récupération des actualités.");
    }
}
