import { IUser } from "@/features/auth/types/auth.type";

export interface IActualite {
    id: string;
    title: string;
    content: string;
    imageUrls?: string[];
    published: boolean;
    authorId: string;
    createdAt?: string;
    updatedAt?: string;

    author?: IUser;
}

export interface IActualiteRechercheParams {
    title?: string;
    content?: string;
    published?: boolean;
    authorId?: string;
    createdAt?: string;
    page?: number;
    limit?: number;
}


