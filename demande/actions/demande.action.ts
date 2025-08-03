"use server";


import { demandeAPI } from "../apis/demande.api";
import { IDemandeRechercheParams } from "../types/demande.type";

export const createDemandRequestAction = async (data: FormData) => {
    return await demandeAPI.createDemandRequest(data);
}

export const getAllFilteredDemandRequestsAction = (params: IDemandeRechercheParams) => {
    return demandeAPI.getAllFilteredDemandRequests(params);
}

export const getMyRequestsAction = (params: Omit<IDemandeRechercheParams, 'userId'>) => {
    return demandeAPI.getMyRequests(params);
}

export const trackDemandByTicketAction = (ticket: string) => {
    return demandeAPI.trackDemandByTicket(ticket);
}

export const getDemandByTicketAction = (ticket: string) => {
    return demandeAPI.getDemandByTicket(ticket);
}

export const getServicesPricesAction = () => {
    return demandeAPI.getServicesPrices();
}

