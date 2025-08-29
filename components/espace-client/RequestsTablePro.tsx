"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import { IDemande } from "@/features/demande/types/demande.type";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
  READY_TO_PICKUP: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  // Anciens statuts pour compatibilité
  nouveau: "bg-green-100 text-green-700",
  enCours: "bg-yellow-100 text-yellow-700",
  enAttente: "bg-yellow-100 text-yellow-700",
  pretARetirer: "bg-yellow-100 text-yellow-700",
};

interface Filters {
  ticket?: string;
  service?: string;
  status?: string;
}

interface RequestsTableProProps {
  filters?: Filters;
  requests?: IDemande[];
}

export default function RequestsTablePro({
  filters,
  requests = [],
}: RequestsTableProProps) {
  const t = useTranslations("espaceClient.mesDemandesClient");

  // Filtrer les demandes selon les critères
  const filteredRequests = requests.filter((req) => {
    if (
      filters?.ticket &&
      !req.ticketNumber.toLowerCase().includes(filters.ticket.toLowerCase())
    ) {
      return false;
    }
    if (filters?.service && req.serviceType !== filters.service) {
      return false;
    }
    if (filters?.status && req.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getStatusTranslation = (status: string) => {
    const statusTranslations: Record<string, string> = {
      NEW: t("statuts.NEW"),
      IN_PROGRESS: t("statuts.IN_PROGRESS"),
      PENDING: t("statuts.PENDING"),
      COMPLETED: t("statuts.COMPLETED"),
      READY_TO_PICKUP: t("statuts.READY_TO_PICKUP"),
      REJECTED: t("statuts.REJECTED"),
    };
    return statusTranslations[status] || status;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("noTicket")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("service")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("date")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("paye")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("statut")}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("action")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredRequests.map((req, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {req.ticketNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {req.serviceType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {req.submissionDate}
              </td>
              <td
                className={cn(
                  "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                  req.paied ? "text-green-500" : "text-red-500"
                )}
              >
                {req.paied ? t("oui") : t("non")}
              </td>
              <td className="py-2 md:py-3 px-2 md:px-6">
                <span
                  className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[req.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {getStatusTranslation(req.status)}
                </span>
              </td>
              <td className="flex gap-2 py-2 md:py-3 px-2 md:px-6">
                {!req.paied && (
                  <Button
                    as={Link}
                    size="sm"
                    href={`/espace-client/payment?amount=${
                      req.amount
                    }&ticketNumber=${
                      req.ticketNumber
                    }`}
                    color="warning"
                  >
                    {t("payer")}
                  </Button>
                )}
                <Button
                  as={Link}
                  size="sm"
                  href={`/espace-client/mes-demandes/${req.ticketNumber}`}
                  color="primary"
                >
                  {t("voir")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
