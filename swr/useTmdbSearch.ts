import useSWRImmutable from "swr/immutable";
import { fetcher } from "./fetcher";

interface TmdbResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
}

export function useTmdbSearch(searchTerm: string) {
  const { data, error, isLoading } = useSWRImmutable(
    searchTerm
      ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.SANITY_STUDIO_TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`
      : null,
    fetcher<TmdbResponse>,
  );

  return {
    movies: data?.results,
    error,
    isLoading,
  };
}
