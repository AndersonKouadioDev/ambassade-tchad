"use server";
import { ActionResponse, PaginatedResponse } from "@/types";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { IPhoto, IPhotoRechercheParams } from "../types/photo.type";
import { photoAPI } from "../apis/photo.api";


export async function getPhotoDetailAction(id: string): Promise<ActionResponse<IPhoto>> {
    try {
        const photo = await photoAPI.getById(id);
        return {
            success: true,
            data: photo,
            message: "Photo récupérée avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la récupération de la photo.");
    }
}

export async function getPhotoTousAction(params: IPhotoRechercheParams):
    Promise<ActionResponse<PaginatedResponse<IPhoto>>> {
    try {
        const photos = await photoAPI.getAll(params);
        return {
            success: true,
            data: photos,
            message: "Photos récupérées avec succès.",
        };
    } catch (apiError: any) {
        return handleServerActionError(apiError, "Erreur lors de la récupération des photos.");
    }
}
