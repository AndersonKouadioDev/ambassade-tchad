"use server";

import { ActionResponse } from "@/types";
import { handleServerActionError } from "@/utils/handleServerActionError";
import { paiementAPI } from "./paiement.api";
import { CreatePaiementKkiapayDTO } from "./paiement.schema";
import { IPaiement } from "./paiement.type";

export async function pay(
    formdata: CreatePaiementKkiapayDTO
): Promise<ActionResponse<IPaiement>> {

    try {
        const result = await paiementAPI.pay(formdata);
        return {
            success: true,
            data: result,
            message: "Paiement effectué avec succès.",
        };
    } catch (error) {
        return handleServerActionError(error, "Erreur lors du paiement.");
    }
};