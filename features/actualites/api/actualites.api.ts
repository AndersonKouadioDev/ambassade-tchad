import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { IActualiteRechercheParams, IActualite } from "../types/actualites.type";

export interface IActualiteAPI {
    getAll: (params: IActualiteRechercheParams) => Promise<PaginatedResponse<IActualite>>;
    getById: (id: string) => Promise<IActualite>;
}

export const actualiteAPI: IActualiteAPI = {
    getAll(params: IActualiteRechercheParams): Promise<PaginatedResponse<IActualite>> {
        return api.request<PaginatedResponse<IActualite>>({
            endpoint: `/news`,
            method: "GET",
            searchParams: params,
            service: "public"
        });
    },

    getById(id: string): Promise<IActualite> {
        return api.request<IActualite>({
            endpoint: `/news/${id}`,
            method: "GET",
            service: "public"
        });
    },
};