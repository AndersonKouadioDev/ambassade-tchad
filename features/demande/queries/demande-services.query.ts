import {
    useQuery,
} from '@tanstack/react-query';
import { getServicesPricesAction } from '../actions/demande.action';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';
import getQueryClient from '@/lib/get-query-client';
import React from 'react';

const queryClient = getQueryClient();

//1- Option de requête pour les prix des services
export const servicesPricesQueryOption = () => {
    return {
        queryKey: demandeKeyQuery("services-prices"),
        queryFn: async () => {
            const result = await getServicesPricesAction();
            if (!result.success) {
                throw new Error(result.error!);
            }
            return result.data!;
        },
        staleTime: Infinity,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des prix des services:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer les prix des services
export const useServicesPricesQuery = () => {
    const query = useQuery(servicesPricesQueryOption());
    React.useEffect(() => {
        if (query.error || query.isError) {
            toast.error("Erreur lors de la récupération des prix des services:", {
                description: query.error.message,
            });
        }
    }, [query]);
    return query;
};

//3- Fonction pour précharger les prix des services
export const prefetchServicesPricesQuery = () => {
    return queryClient.prefetchQuery(servicesPricesQueryOption());
};