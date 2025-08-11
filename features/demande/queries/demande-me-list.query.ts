import {
    useQuery,
} from '@tanstack/react-query';
import { getMyRequestsAction } from '../actions/demande.action'; // Import relevant actions
import { IDemandeRechercheParams } from '../types/demande.type';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';
import getQueryClient from '@/lib/get-query-client';
import React from 'react';

const queryClient = getQueryClient();

//1- Option de requête optimisée pour mes demandes
export const myDemandesListQueryOption = (params: Omit<IDemandeRechercheParams, 'userId'>) => {
    return {
        queryKey: demandeKeyQuery("my-list", params),
        queryFn: async () => {
            const result = await getMyRequestsAction(params);

            if (!result.success) {
                throw new Error(result.error!);
            }

            return result.data!;
        },
        placeholderData: (previousData: any) => previousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    };
};

//2- Hook pour récupérer mes demandes
export const useMyDemandesListQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    const query = useQuery(myDemandesListQueryOption(params));

    React.useEffect(() => {
        if (query.error, query.isError) {
            toast.error("Erreur lors de la récupération de mes demandes:", {
                description: query.error.message,
            });
        }
    }, [query]);

    return query;
};

//3- Fonction pour précharger mes demandes
export const prefetchMyDemandesListQuery = (
    params: Omit<IDemandeRechercheParams, 'userId'>
) => {
    return queryClient.prefetchQuery(myDemandesListQueryOption(params));
};