import {api} from "@/lib/api";
import {UtilisateurUpdateDTO, UtilisateurUpdateMotDePasseDTO} from "../schema/utilisateur.schema";
import {IUser, IUtilisateurAddUpdateResponse} from "@/features/auth/types/auth.type";

export interface IUtilisateurAPI {
    obtenirUtilisateur(id: string): Promise<IUser>;
    modifierProfil(data: UtilisateurUpdateDTO,id:string): Promise<IUtilisateurAddUpdateResponse>;
    modifierMotdePasse(data: UtilisateurUpdateMotDePasseDTO, id: string): Promise<IUtilisateurAddUpdateResponse>;
}

export const utilisateurAPI: IUtilisateurAPI = {
    obtenirUtilisateur(id: string): Promise<IUser> {
        return api.request<IUser>({
            endpoint: `/users/demandeur/${id}/profile`,
            method: "GET",
        });
    },

    modifierProfil(data: UtilisateurUpdateDTO,id:string): Promise<IUtilisateurAddUpdateResponse> {
        return api.request<IUtilisateurAddUpdateResponse>({
            endpoint: `/users/update/${id}`,
            method: "PATCH",
            data,
        });
    },

    modifierMotdePasse(data: UtilisateurUpdateMotDePasseDTO, id: string): Promise<IUtilisateurAddUpdateResponse> {
        console.log("Modifier mot de passe", data, id);
        return api.request<IUtilisateurAddUpdateResponse>({
            endpoint: `/users/update/${id}/password`,
            method: "PATCH",
            data,
        });
    }
};
