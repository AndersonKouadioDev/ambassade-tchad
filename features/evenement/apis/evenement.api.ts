import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types";
import { IEvenement, IEvenementRechercheParams } from "../types/evenement.type";
import { SearchParams } from "ak-api-http";
export interface IEvenementAPI {
    getAll: (params: IEvenementRechercheParams) => Promise<PaginatedResponse<IEvenement>>;
    getById: (id: string) => Promise<IEvenement>;
}

export const evenementAPI: IEvenementAPI = {
    getAll(params: IEvenementRechercheParams): Promise<PaginatedResponse<IEvenement>> {
        return api.request<PaginatedResponse<IEvenement>>({
            endpoint: `/events`,
            method: "GET",
            searchParams: params as SearchParams,
            service: "public"
        });
    },

    getById(id: string): Promise<IEvenement> {
        return api.request<IEvenement>({
            endpoint: `/events/${id}`,
            method: "GET",
            service: "public"
        });
    },
};