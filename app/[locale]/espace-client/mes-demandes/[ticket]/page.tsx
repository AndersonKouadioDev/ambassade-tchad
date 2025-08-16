import React from "react";
import DemandeDetailsSection from '@/components/espace-client/DemandeDetailsSection';
import {prefetchGetDemandeByTicketQuery} from "@/features/demande/queries/demande-detail.query";

export default async function DemandeDetail({params} : {params:Promise<{ticket: string}>}) {
    const ticket = (await params).ticket;

    if (!ticket) {
        return (
            <div className="w-full">
                <div className="mx-auto">
                    <div className="text-center py-8 text-red-500">
                        <div className="text-lg mb-2">⚠️</div>
                        Ce ticket n&apos;existe pas ou a été supprimé.
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    await prefetchGetDemandeByTicketQuery(ticket)

    return (
        <DemandeDetailsSection ticket={ticket}/>
    );
} 