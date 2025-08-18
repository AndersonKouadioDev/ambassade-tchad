import getQueryClient from "@/lib/get-query-client";
import { useQuery } from "@tanstack/react-query";
import { videoKeyQuery } from "./index.query";
import { getVideoDetailAction } from "../actions/video.action";
const queryClient = getQueryClient();

// Option de requête
export const videoQueryOption = (id: string) => {
    return {
        queryKey: videoKeyQuery(id),
        queryFn: async () => {    
            const result = await getVideoDetailAction(id);
            return result!;
        },
        enabled: !!id,
    };
}
// Hook pour récupérer une photo
export const useVideoDetailQuery = (id: string) => {
    return useQuery(videoQueryOption(id));
};
// Hook pour précharger une photo
export const prefetchVideoDetailQuery = (id: string) => {
    return queryClient.prefetchQuery(videoQueryOption(id));
}