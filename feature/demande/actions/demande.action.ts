"use server";


import { ActionResponse } from "@/types";
import { demandeAPI } from "../apis/demande.api";
import { IDemande, IDemandeRechercheParams } from "../types/demande.type";
import { handleServerActionError } from "@/utils/handleServerActionError";

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

export async function getAllFilteredDemandRequestsAction(params: IDemandeRechercheParams) {
    try {
        const demandes = await demandeAPI.getAllFilteredDemandRequests(params);
        return {
            success: true,
            data: demandes.data,
            meta: {
                total: demandes.total,
                page: demandes.page,
                limit: demandes.limit,
                totalPages: demandes.totalPages,
            },
            message: "Demandes récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des demandes.");
    }
}

export async function getMyRequestsAction(params: Omit<IDemandeRechercheParams, 'userId'>){
    try {
        const demandes = await demandeAPI.getMyRequests(params);
        return {
            success: true,
            data: demandes.data,
            meta: {
                total: demandes.total,
                page: demandes.page,
                limit: demandes.limit,
                totalPages: demandes.totalPages,
            },
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

export async function getServicesPricesAction(): Promise<ActionResponse<any>> {
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

export  async function getGlobalStatsAction(): Promise<ActionResponse<any>> {
    try {
        const globalStats = await demandeAPI.getGlobalStats();
        return {
            success: true,
            data: globalStats,
            message: "Statistiques globales récupérées avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération des statistiques globales.");
    }
}

export async function getUserStatsAction(): Promise<ActionResponse<any>> {
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

