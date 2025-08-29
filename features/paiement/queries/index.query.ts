import { useQueryClient } from '@tanstack/react-query';

// 1- Clé de cache
export const paiementKeyQuery = (...params: any[]) => {
    if (params.length === 0) {
        return ['paiement'];
    }
    return ['paiement', ...params];
};

// 2. Créez un hook personnalisé pour l'invalidation
export const useInvalidatePaiementQuery = () => {
    const queryClient = useQueryClient();

    return async (...params: any[]) => {
        await queryClient.invalidateQueries({
            queryKey: paiementKeyQuery(...params),
            exact: false
        });

        await queryClient.refetchQueries({
            queryKey: paiementKeyQuery(),
            type: 'active'
        });
    };
};