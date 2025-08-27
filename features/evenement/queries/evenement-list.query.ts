import { useQuery } from "@tanstack/react-query";
import getQueryClient from "@/lib/get-query-client";
import { IEvenementRechercheParams } from "../types/evenement.type";
import { getEvenementTousAction } from "../actions/evenement.action";
import { evenementKeyQuery } from "./index.query";
import React from "react";
import { toast } from "react-toastify";

const queryClient = getQueryClient();


// Option de requête
export const evenementListQueryOption = (evenementSearchParams: IEvenementRechercheParams) => {
    return {
        queryKey: evenementKeyQuery('list', evenementSearchParams),
        queryFn: async () => {
            const result = await getEvenementTousAction(evenementSearchParams);
            if (!result.success) {
                throw new Error(result.error!);
            }
            return result.data!;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        enable: true,
    };
}

// Hook pour récupérer les événements
export const useEvenementsListQuery = (evenementSearchParams: IEvenementRechercheParams) => {
    const query = useQuery(evenementListQueryOption(evenementSearchParams));

    React.useEffect(() => {
        if (query.isError || query.error) {
            toast.error(query.error?.message);
        }
    }, [query]);

    return query;
};

// Hook pour précharger les événements
export const prefetchEvenementsListQuery = (evenementSearchParams: IEvenementRechercheParams) => {
    return queryClient.prefetchQuery(evenementListQueryOption(evenementSearchParams));
}

