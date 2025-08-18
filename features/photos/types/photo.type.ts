
export interface IPhoto {
    id: string;
    title: string;
    description: string;
    imageUrl?: string[];
    createdAt?: Date;
    updatedAt?: Date;

}

export interface IPhotoRechercheParams {
    title?: string;
    createdAt?: string;
    page?: number;
    limit?: number;
}
