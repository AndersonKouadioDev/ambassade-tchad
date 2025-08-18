import { IUser } from "@/features/demande/types/user.type";


export interface IEvenement {
    id: string;
    title: string;
    description: string;
    eventDate: Date;
    location?: string;
    imageUrl: string[];
    published: boolean;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;

    author?: IUser;
}

export interface IEvenementRechercheParams {
    title?: string;
    description?: string;
    eventDate?: Date;
    published?: boolean;
    authorId?: string;
    page?: number;
    limit?: number;
}

export interface IEvenementStats {
    total: number;
    published: number;
    unpublished: number;
    byAuthor: {
        authorId: string;
        _count: {
            id: number;
        };
    }[];
 
}