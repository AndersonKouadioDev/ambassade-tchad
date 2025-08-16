"use server";

import { videoAPI } from "../apis/video.api";
import { IVideoRechercheParams } from "../types/video.type";


// Les gets sont appelés dans les queries

export async function getVideoDetailAction(id: string) {
    if (!id || id.trim() === "") {
        throw new Error("ID de la video requis.");
    }
    return videoAPI.getById(id);
}

    export async function getVideoTousAction(params: IVideoRechercheParams) {
    return videoAPI.getAll(params);
}
