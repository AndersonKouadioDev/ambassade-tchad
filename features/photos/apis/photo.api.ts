import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { SearchParams } from "ak-api-http";
import { IPhoto, IPhotoRechercheParams } from "../types/photo.type";
export interface IPhotoAPI {
    getAll: (params: IPhotoRechercheParams) => Promise<PaginatedResponse<IPhoto>>;
    getById: (id: string) => Promise<IPhoto>;
}

export const photoAPI: IPhotoAPI = {
    getAll(params: IPhotoRechercheParams): Promise<PaginatedResponse<IPhoto>> {
        // Validation des paramètres

        return api.request<PaginatedResponse<IPhoto>>({
            endpoint: `/photos`,
            method: "GET",
            searchParams: params as SearchParams
        });
    },

    getById(id: string): Promise<IPhoto> {
        return api.request<IPhoto>({
            endpoint: `/photos/${id}`,
            method: "GET",
        });
    },

};