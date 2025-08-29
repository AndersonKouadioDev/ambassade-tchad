export enum PaiementMethod {
    MOBILE_MONEY = 'MOBILE_MONEY',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD'
}

export interface IPaiement {
    id: string;
    requestId: string | null;
    amount: number;
    paymentDate: string;
    method: PaiementMethod;
    source: string;
    transactionRef: string | null;
    recordedById: string;
    createdAt: string;
    updatedAt: string;
}
