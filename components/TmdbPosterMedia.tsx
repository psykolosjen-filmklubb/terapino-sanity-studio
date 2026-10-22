import { Spinner } from "@sanity/ui";
import { VideoIcon } from "@sanity/icons/Video";
import { useTmdbPoster } from "../swr/useTmdbPoster";

// Poster thumbnail for document list previews, fetched from TMDB.
export const TmdbPosterMedia = ({ tmdbId }: { tmdbId?: number }) => {
  const { poster, isLoading } = useTmdbPoster(tmdbId ? String(tmdbId) : "");

  if (isLoading) {
    return <Spinner muted />;
  }

  if (!poster) {
    return <VideoIcon />;
  }

  return (
    <img
      src={`https://image.tmdb.org/t/p/w92${poster}`}
      alt=""
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};
