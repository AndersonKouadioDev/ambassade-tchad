import { useMemo, useState } from "react";
import { useQueryStates } from 'nuqs';
import { videoFiltersClient } from "../filters/video.filters";
import { IVideo, IVideoRechercheParams } from "../types/video.type";
import { useVideosList } from "../queries/video-list.query";

export const useVideoCardList = () => {
  // Gestion des paramètres d'URL via Nuqs
  const [filters, setFilters] = useQueryStates(videoFiltersClient.filter, videoFiltersClient.option);

  // Construction des paramètres de recherche par défaut pour React Query
  const currentSearchParams: IVideoRechercheParams = useMemo(() => {
    return {
      page: Number(filters.page) || 1,
      limit: Number(filters.limit) || 10,
      title: filters.title.trim(),
      createdAt: filters.createdAt,
    }
  }, [filters]);

  // Recherche des  photos
  const { data, isLoading, error } = useVideosList(currentSearchParams);

  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);

  const handleView = (video: IVideo) => {
    setCurrentVideo(video);
  }

  const handleDelete = (video: IVideo) => {
    setCurrentVideo(video);
  }

  const handleTextFilterChange = (filterName: 'title' | 'createdAt', value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterName]: value,
      page: 1,
    }));
  };


  const handlePageChange = (page: number) => {
    setFilters((prev: any) => ({
      ...prev,
      page,
    }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setFilters((prev: any) => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  return {
    data: data,
    isLoading,
    error,
    filters,
    // pagination: {
    //   currentPage: data?meta.page, 
    //   totalPages: data?.totalPages,
    //   totalItems: data?.total,
    //   itemsPerPage: data?.limit,
    // },
    handleTextFilterChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleView,
    handleDelete,
    currentVideo,
  };
};

