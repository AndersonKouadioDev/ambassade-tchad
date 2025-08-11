"use server";

import { ActionResponse, PaginatedResponse } from "@/types";
import { demandeAPI } from "../apis/demande.api";
import { IDemande, IDemandeRechercheParams, IDemandeStatsResponse } from "../types/demande.type";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { IService } from "../types/service.type";

export async function createDemandRequestAction(formData: FormData): Promise<ActionResponse<IDemande>> {
    try {
        const createdDemande = await demandeAPI.createDemandRequest(formData);
        return {
            success: true,
            data: createdDemande,
            message: "Demande créée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la création de la demande.");
    }

}

export async function getAllFilteredDemandRequestsAction(params: IDemandeRechercheParams): Promise<ActionResponse<PaginatedResponse<IDemande>>> {
    try {
        const demandes = await demandeAPI.getAllFilteredDemandRequests(params);
        return {
            success: true,
            data: demandes,
            message: "Demandes récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des demandes.");
    }
}

export async function getMyRequestsAction(params: Omit<IDemandeRechercheParams, 'userId'>): Promise<ActionResponse<PaginatedResponse<IDemande>>> {
    try {
        const demandes = await demandeAPI.getMyRequests(params);
        return {
            success: true,
            data: demandes,
            message: "Demandes récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des demandes.");
    }
}

export async function trackDemandByTicketAction(ticket: string): Promise<ActionResponse<IDemande>> {
    try {
        const demande = await demandeAPI.trackDemandByTicket(ticket);
        return {
            success: true,
            data: demande,
            message: "Demande récupérée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la demande.");
    }
}

export async function getDemandByTicketAction(ticket: string): Promise<ActionResponse<IDemande>> {
    try {
        const demande = await demandeAPI.getDemandByTicket(ticket);
        return {
            success: true,
            data: demande,
            message: "Demande récupérée avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de la demande.");
    }
}

export async function getServicesPricesAction(): Promise<ActionResponse<IService[]>> {
    try {
        const servicesPrices = await demandeAPI.getServicesPrices();
        return {
            success: true,
            data: servicesPrices,
            message: "Services récupérés avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des services.");
    }
}


export async function getUserStatsAction(): Promise<ActionResponse<IDemandeStatsResponse>> {
    try {
        const userStats = await demandeAPI.getUserStats();
        return {
            success: true,
            data: userStats,
            message: "Statistiques utilisateur récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des statistiques utilisateur.");
    }
}

