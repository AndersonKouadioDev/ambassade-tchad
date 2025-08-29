import { z } from 'zod';

export const createPaiementKkiapaySchema = z.object({
    transactionRef: z.string().nonempty({ message: 'La référence de la transaction est requise.' }),
    ticketNumber: z.string().nonempty({ message: 'Le numéro de ticket est requis.' }),
    reason: z.object({
        code: z.string(),
        description: z.string(),
    }).optional(),
});

export type CreatePaiementKkiapayDTO = z.infer<typeof createPaiementKkiapaySchema>
