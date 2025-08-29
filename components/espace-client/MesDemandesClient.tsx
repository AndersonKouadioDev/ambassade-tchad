"use client";

import { useState } from "react";
import RequestsTablePro from "@/components/espace-client/RequestsTablePro";
import { useTranslations } from "next-intl";
import { useMyDemandesListQuery } from "@/features/demande/queries/demande-me-list.query";
import { IDemande } from "@/features/demande/types/demande.type";
import { Alert, Divider } from "@heroui/react";

const SERVICES = [
  "Carte Consulaire",
  "Visa",
  "Laissez-passer",
  "Procuration",
  "Acte de Capacité de Mariage",
  "Acte de Décès",
  "Certificat de Nationalité",
  "Acte de Naissance",
];

const STATUS_OPTIONS = [
  "NEW",
  "IN_REVIEW_DOCS",
  "PENDING_ADDITIONAL_INFO",
  "APPROVED_BY_AGENT",
  "APPROVED_BY_CHEF",
  "APPROVED_BY_CONSUL",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "ARCHIVED",
  "EXPIRED",
  "RENEWAL_REQUESTED",
  "REJECTED",
];

export default function MesDemandesClient() {
  const t = useTranslations("espaceClient.mesDemandesClient");

  const translateStatus = (statuts: string) => {
    const translations: Record<string, string> = {
      NEW: t("statuts.NEW"),
      IN_REVIEW_DOCS: t("statuts.IN_REVIEW_DOCS"),
      PENDING_ADDITIONAL_INFO: t("statuts.PENDING_ADDITIONAL_INFO"),
      APPROVED_BY_AGENT: t("statuts.APPROVED_BY_AGENT"),
      APPROVED_BY_CHEF: t("statuts.APPROVED_BY_CHEF"),
      APPROVED_BY_CONSUL: t("statuts.APPROVED_BY_CONSUL"),
      READY_FOR_PICKUP: t("statuts.READY_FOR_PICKUP"),
      DELIVERED: t("statuts.DELIVERED"),
      ARCHIVED: t("statuts.ARCHIVED"),
      EXPIRED: t("statuts.EXPIRED"),
      RENEWAL_REQUESTED: t("statuts.RENEWAL_REQUESTED"),
      REJECTED: t("statuts.REJECTED"),
    };
    return translations[statuts] || statuts;
  };

  const translateServiceType = (serviceType: string) => {
    const translations: Record<string, string> = {
      CONSULAR_CARD: t("services.carteConsulaire"),
      POWER_OF_ATTORNEY: t("services.procuration"),
      MARRIAGE_CAPACITY_ACT: t("services.acteCapaciteMariage"),
      LAISSEZ_PASSER: t("services.laissezPasser"),
      DEATH_ACT_APPLICATION: t("services.acteDeces"),
      NATIONALITY_CERTIFICATE: t("services.certificatNationalite"),
      BIRTH_ACT_APPLICATION: t("services.acteNaissance"),
      VISA: t("services.visa"),
    };
    return translations[serviceType] || serviceType;
  };

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    ticket: "",
    service: "",
    statuts: "",
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data,
    isLoading: loading,
    error,
  } = useMyDemandesListQuery({
    page,
    limit,
  });

  const demandes = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;
  const total = data?.meta?.total || 0;

  const requests = demandes.map(
    (d: IDemande) =>
      ({
        ...d,
        ticketNumber: d.ticketNumber || d.id || "",
        serviceType: translateServiceType(d.serviceType || ""),
        submissionDate: d.submissionDate
          ? new Date(d.submissionDate).toLocaleDateString("fr-FR")
          : "",
        status: translateStatus(d.status || ""),
        paied: d.paied || false,
      } as IDemande)
  );
  // Fonction pour générer les boutons
  const renderPagination = () => {
    const pagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-sm text-gray-600 ">
          {total} {t("demandes")} • {t("page")} {page} {t("sur")} {totalPages}
        </div>

        <div className="flex items-center gap-1">
          {/* Bouton Précédent */}
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`p-2 rounded-lg transition-colors ${
              page === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 "
            }`}
            aria-label={t("pagePrecedente")}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Première page */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  1 === page
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 "
                }`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-1 text-gray-500">...</span>}
            </>
          )}

          {/* Pages intermédiaires */}
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg transition-colors ${
                p === page
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100 "
              }`}
            >
              {p}
            </button>
          ))}

          {/* Dernière page */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-1 text-gray-500">...</span>
              )}
              <button
                onClick={() => setPage(totalPages)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  totalPages === page
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 "
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Bouton Suivant */}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={`p-2 rounded-lg transition-colors ${
              page === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 "
            }`}
            aria-label={t("pageSuivante")}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const clearFilters = () => {
    setFilters({
      ticket: "",
      service: "",
      statuts: "",
    });
  };

  const hasActiveFilters = filters.ticket || filters.service || filters.statuts;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white  rounded-xl shadow-sm overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200 ">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 ">
                {t("title")}
              </h1>
              <p className="text-gray-600 ">{t("description")}</p>
            </div>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-600  hover:text-gray-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {t("effacerFiltres")}
                </button>
              )}
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-orange-500 text-orange-500  font-medium rounded-lg hover:bg-orange-50 transition-colors"
                onClick={() => setShowFilter((v) => !v)}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                  />
                </svg>
                {t("filtrer")}
                <svg
                  className={`ml-2 h-4 w-4 transition-transform ${
                    showFilter ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        {showFilter && (
          <div className="px-6 py-4 bg-gray-50  border-b border-gray-200 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">
                  {t("noTicket")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("placeholderTicket")}
                    value={filters.ticket}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, ticket: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300  bg-white  text-gray-900  placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">
                  {t("typeService")}
                </label>
                <div className="relative">
                  <select
                    value={filters.service}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, service: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors appearance-none"
                  >
                    <option value="">{t("tous")}</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700  mb-2">
                  {t("statut")}
                </label>
                <div className="relative">
                  <select
                    value={filters.statuts}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, statuts: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300  bg-white  text-gray-900  focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors appearance-none"
                  >
                    <option value="">{t("tous")}</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {translateStatus(s)}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300  text-gray-700  font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("effacer")}
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                onClick={() => setShowFilter(false)}
              >
                {t("appliquer")}
              </button>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 ">
              {t("listeDemandes")}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error.message}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    {t("reessayer")}
                  </button>
                </div>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 ">
                {t("aucuneDemandeTrouvee")}
              </h3>
              <p className="mt-1 text-sm text-gray-500 ">
                {t("aucuneDemandeMessage")}
              </p>
            </div>
          ) : (
            <>
              {/* Demandes en attente de paiement */}
              {(() => {
                const pendingRequests = requests.filter(
                  (req) => req.paied === false
                );
                return pendingRequests.length > 0 ? (
                  <div className="mb-8">
                    <Alert color="danger" className="mb-4">
                      {t("alert_paiement")}
                    </Alert>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 ">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {pendingRequests.length}
                        </span>
                        <span className="ml-2">{t("demandesEnAttente")}</span>
                      </h3>
                    </div>
                    <RequestsTablePro
                      filters={filters}
                      requests={pendingRequests}
                    />
                  </div>
                ) : null;
              })()}

              {/* Toutes les demandes */}
              <Divider className="mb-4" />

              <div className="overflow-x-auto">
                <RequestsTablePro filters={filters} requests={requests} />
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
