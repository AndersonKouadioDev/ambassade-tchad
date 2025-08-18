export interface IVideo {
    id: string;
    title: string;
    description: string;
    youtubeUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;

}

export interface IVideoRechercheParams {
    title?: string;
    description?: string;
    createdAt?: string;
    page?: number;
    limit?: number;
}

