"use server";

import {ActionResponse} from "@/types";
import {utilisateurAPI} from "../apis/utilisateur.api";
import {UtilisateurUpdateDTO, UtilisateurUpdateMotDePasseDTO} from "../schema/utilisateur.schema";
import {IUser} from "@/features/auth/types/auth.type";
import {handleServerActionError} from "@/utils/handleServerActionError";

export const obtenirUnUtilisateurAction = async (id: string): Promise<ActionResponse<IUser>> => {
    try {
        const data = await utilisateurAPI.obtenirUtilisateur(id);
        return {
            success: true,
            data: data,
            message: "Utilisateur obtenu avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la récupération de l'utilisateur");
    }
}

export const modifierProfilAction = async (formdata: UtilisateurUpdateDTO,id:string): Promise<ActionResponse<IUser>> => {
    try {
        const data = await utilisateurAPI.modifierProfil(formdata,id);
        return {
            success: true,
            data: data,
            message: "Profil modifie avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification du profil");
    }
}

export const modifierMotDePasseAction = async (formdata: UtilisateurUpdateMotDePasseDTO, id: string): Promise<ActionResponse<IUser>> => {
    try {
        const data = await utilisateurAPI.modifierMotdePasse(formdata, id);
        return {
            success: true,
            data: data,
            message: "Mot de passe modifié avec succès",
        }
    } catch (error) {
        return handleServerActionError(error, "Erreur lors de la modification du mot de passe");
    }
}