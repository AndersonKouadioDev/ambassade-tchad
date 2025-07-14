// Types partagés entre le frontend et le backend
// Source: interfaces.d.ts fourni par le développeur backend

// Base interface
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// User types
export enum Role {
    AGENT = 'AGENT',
    CHEF_SERVICE = 'CHEF_SERVICE',
    CONSUL = 'CONSUL',
    ADMIN = 'ADMIN'
}

export enum UserType {
    DEMANDEUR = 'DEMANDEUR',
    PERSONNEL = 'PERSONNEL'
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface User extends BaseEntity {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: Role;
    type: UserType;
    status: UserStatus;
}

// Content Management System types
export interface News extends BaseEntity {
    title: string;
    content: string;
    imageUrl?: string;
    published: boolean;
    authorId: string;
}

export interface NewsWithRelations extends News {
    author?: User;
}

export interface Event extends BaseEntity {
    title: string;
    description: string;
    eventDate: Date;
    location?: string;
    imageUrl?: string;
    published: boolean;
    authorId: string;
}

export interface EventWithRelations extends Event {
    author?: User;
}

export interface Photo extends BaseEntity {
    title?: string;
    description?: string;
    imageUrl: string;
}

export interface Video extends BaseEntity {
    title?: string;
    description?: string;
    youtubeUrl: string;
}

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<PaginatedResponse<T>> { }
