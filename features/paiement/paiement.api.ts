import { api } from "@/lib/api";
import { IPaiement } from "./paiement.type";
import { CreatePaiementKkiapayDTO } from "./paiement.schema";

export interface IPaiementAPI {
    pay: (data: CreatePaiementKkiapayDTO) => Promise<IPaiement>;
}

export const paiementAPI: IPaiementAPI = {
    pay(data: CreatePaiementKkiapayDTO): Promise<IPaiement> {
        return api.request<IPaiement>({
            endpoint: `/paiements/pay`,
            method: "POST",
            data,
        });
    },
};
