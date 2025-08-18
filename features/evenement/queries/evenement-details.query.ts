import getQueryClient from "@/lib/get-query-client";
import {useQuery} from "@tanstack/react-query";
import {getEvenementDetailAction} from "../actions/evenement.action";
import {evenementKeyQuery} from "./index.query";
import React from "react";

const queryClient = getQueryClient();

// Option de requête
export const evenementQueryOption = (id: string) => {
    return {
        queryKey: evenementKeyQuery(id),
        queryFn: async () => {
            const result = await getEvenementDetailAction(id);
            if (!result.success) {
                throw new Error(result.error!);
            }
            return result.data!;
        },
        enabled: !!id,
    };
}

// Hook pour récupérer un événement
export const useEvenementQuery = (id: string) => {
    const query = useQuery(evenementQueryOption(id));
    React.useEffect(() => {
        if (query.error || query.isError) {
            console.error("Erreur lors de la récupération de l'événement:", query.error);
        }
    }, [query]);
    return query;
};

// Hook pour précharger un événement
export const prefetchEvenementQuery = (id: string) => {
    return queryClient.prefetchQuery(evenementQueryOption(id));
}