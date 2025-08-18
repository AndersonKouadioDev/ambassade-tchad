import {
    useQuery,
} from '@tanstack/react-query';
import { getUserStatsAction } from '../actions/demande.action';
import { demandeKeyQuery } from './index.query';
import { toast } from 'sonner';
import getQueryClient from '@/lib/get-query-client';

const queryClient = getQueryClient();

//1- Option de requête pour les statistiques des demandes de l'utilisateur
export const userDemandeStatsQueryOption = () => {
    return {
        queryKey: demandeKeyQuery("user-stats"),
        queryFn: async () => {
            return await getUserStatsAction();
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        onError: (error: Error) => {
            toast.error("Erreur lors de la récupération des statistiques des demandes de l'utilisateur:", {
                description: error.message,
            });
        },
    };
};

//2- Hook pour récupérer les statistiques des demandes de l'utilisateur
export const useUserDemandeStatsQuery = () => {
    return useQuery(userDemandeStatsQueryOption());
};

//3- Fonction pour précharger les statistiques des demandes de l'utilisateur
export const prefetchUserDemandeStatsQuery = () => {
    return queryClient.prefetchQuery(userDemandeStatsQueryOption());
};