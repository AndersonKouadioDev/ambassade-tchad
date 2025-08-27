import { useQueryStates } from 'nuqs';
import { useMemo } from "react";
import { evenementFiltersClient } from '../filters/evenement.filters';
import { useEvenementsListQuery } from "../queries/evenement-list.query";
import { IEvenementRechercheParams } from "../types/evenement.type";

export const useEvenementList = () => {
  const [filters, setFilters] = useQueryStates(evenementFiltersClient, {
    clearOnDefault: true
  });

  const currentSearchParams: IEvenementRechercheParams = useMemo(() => {
    const params: IEvenementRechercheParams = {
      // published: true,
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 12,
    };

    if (filters.title && filters.title.trim()) {
      params.title = filters.title.trim();
    }

    if (filters.description && filters.description.trim()) {
      params.description = filters.description.trim();
    }

    if (filters.authorId && filters.authorId.trim()) {
      params.authorId = filters.authorId.trim();
    }

    return params;
  }, [filters]);

  const { data, isLoading, error } = useEvenementsListQuery(currentSearchParams);


  const handleTextFilterChange = (filterName: 'title' | 'description' | 'authorId', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1, 
    }));
  };

  const handlePublishedFilterChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      published: value as 'true' | 'false' | 'all',
      page: 1, // Réinitialise à la première page
    }));
  };

  const handleDateFilterChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      eventDate: value, //TODO: Rechercher dans la base de données pour savoir si c'est le champ created_at
      page: 1, // Réinitialise à la première page
    }));
  };

  // Extraction des données de pagination
  const paginationData = {
    data: Array.isArray(data?.data) ? data.data : [],
    meta: data?.meta || {
      page: 1,
      limit: 12,
      totalItems: 0,
      totalPages: 1,
    },
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters(prev => ({
      ...prev,
      limit,
      page: 1, // Retour à la première page lors du changement de limite
    }));
  };

  return {
    data: paginationData.data,
    isLoading,
    error,
    filters,
    pagination: {
      currentPage: paginationData.meta.page,
      totalPages: paginationData.meta.totalPages,
      // totalItems: paginationData.meta.totalItems,
      itemsPerPage: paginationData.meta.limit,
    },
    handleTextFilterChange,
    handlePublishedFilterChange,
    handleCreatedAtFilterChange: handleDateFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
