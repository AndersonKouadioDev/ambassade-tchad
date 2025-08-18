import React from 'react';
import {formatCurrency} from "@/utils/format-currency";

function PriceViewer({price}: { price?: number }) {
    return (
        <span className="text-lg font-semibold text-green-700">Prix à payer : {formatCurrency(price ?? 5000)}</span>
    );
}

export default PriceViewer;