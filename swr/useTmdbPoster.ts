import useSWRImmutable from "swr/immutable";
import { fetcher } from "./fetcher";

interface TmdbResponse {
  poster_path: string;
}

export function useTmdbPoster(tmdbId: string) {
  const { data, error, isLoading } = useSWRImmutable(
    tmdbId
      ? `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.SANITY_STUDIO_TMDB_API_KEY}`
      : null,
    fetcher<TmdbResponse>,
  );

  return {
    poster: data?.poster_path,
    error,
    isLoading,
  };
}
