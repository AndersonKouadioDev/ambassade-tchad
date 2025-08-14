import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { SearchParams } from "ak-api-http";
import { IEvenement, IEvenementRechercheParams } from "../types/evenement.type";
export interface IEvenementAPI {
    getAll: (params: IEvenementRechercheParams) => Promise<PaginatedResponse<IEvenement>>;
    getById: (id: string) => Promise<IEvenement>;
}

export const evenementAPI: IEvenementAPI = {
    getAll(params: IEvenementRechercheParams): Promise<PaginatedResponse<IEvenement>> {
        return api.request<PaginatedResponse<IEvenement>>({
            endpoint: `/events`,
            method: "GET",
            searchParams: {
                ...params as unknown as SearchParams,
                include: "author" // Inclure les données de l'auteur
            },
        });
    },

    getById(id: string): Promise<IEvenement> {
        return api.request<IEvenement>({
            endpoint: `/events/${id}`,
            method: "GET",
            searchParams: {
                include: "author" // Inclure les données de l'auteur
            },
        });
    },
};