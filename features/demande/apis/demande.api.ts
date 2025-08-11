import { api } from "@/lib/api";
import { SearchParams } from "ak-api-http";
import {
    IDemande,
    IDemandeStatsResponse,
    IDemandeRechercheParams,
} from "../types/demande.type";
import { IService } from "../types/service.type";
import { PaginatedResponse } from "@/types";

export interface IDemandRequestAPI {
    createDemandRequest(data: FormData): Promise<IDemande>;
    getMyRequests(params: Omit<IDemandeRechercheParams, 'userId'>): Promise<PaginatedResponse<IDemande>>;
    getUserStats(): Promise<IDemandeStatsResponse>;
    trackDemandByTicket(ticket: string): Promise<IDemande>;
    getDemandByTicket(ticket: string): Promise<IDemande>;
    getServicesPrices(): Promise<IService[]>;
}

export const demandeAPI: IDemandRequestAPI = {
    async createDemandRequest(data: FormData): Promise<IDemande> {

        return api.request<IDemande>({
            endpoint: `/demandes`,
            method: "POST",
            data,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        });
    },

    getMyRequests(params: Omit<IDemandeRechercheParams, 'userId'>): Promise<PaginatedResponse<IDemande>> {
        return api.request<PaginatedResponse<IDemande>>({
            endpoint: `/demandes/me`,
            method: "GET",
            searchParams: params as SearchParams,
        });
    },

    getUserStats(): Promise<IDemandeStatsResponse> {
        return api.request<IDemandeStatsResponse>({
            endpoint: `/demandes/stats/demandeur`,
            method: "GET",
        });
    },

    trackDemandByTicket(ticket: string): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/track/${ticket}`,
            method: "GET",
        });
    },

    getDemandByTicket(ticket: string): Promise<IDemande> {
        return api.request<IDemande>({
            endpoint: `/demandes/demande/${ticket}`,
            method: "GET",
        });
    },

    getServicesPrices(): Promise<IService[]> {
        return api.request<IService[]>({
            endpoint: `/demandes/services`,
            method: "GET",
        });
    },
};