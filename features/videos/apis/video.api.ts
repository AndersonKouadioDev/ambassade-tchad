import { PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { IVideo, IVideoRechercheParams } from "../types/video.type";
export interface IVideoAPI {
    getAll: (params: IVideoRechercheParams) => Promise<PaginatedResponse<IVideo>>;
    getById: (id: string) => Promise<IVideo>;

}

export const videoAPI: IVideoAPI = {
    getAll(params: IVideoRechercheParams): Promise<PaginatedResponse<IVideo>> {
        return api.request<PaginatedResponse<IVideo>>({
            endpoint: `/videos`,
            method: "GET",
            searchParams: params,
            service: "public"
        });
    },

    getById(id: string): Promise<IVideo> {
        return api.request<IVideo>({
            endpoint: `/videos/${id}`,
            method: "GET",
            service: "public"
        });
    },


};