import { Image, PreviewProps } from "sanity";
import { Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useTmdbPoster } from "../swr/useTmdbPoster";
import { ErrorOutlineIcon } from "@sanity/icons/ErrorOutline";
import { VideoIcon } from "@sanity/icons/Video";
import { urlFor } from "../utils/imageBuilder";

// Partial so MovieSingleInput can render it outside a Sanity preview.
type Props = Partial<PreviewProps> & {
  tmdb_id?: string;
  movie_title?: string;
  release_year?: number;
  directors?: string;
  poster?: Image;
};

export const CustomMoviePreview = (props: Props) => {
  const hasCustomPoster = Boolean(props.poster?.asset);
  // An uploaded poster wins, so there is no need to ask TMDB for one.
  const tmdb = useTmdbPoster(hasCustomPoster ? "" : props.tmdb_id || "");
  const { isLoading, error } = tmdb;
  const poster =
    hasCustomPoster && props.poster
      ? urlFor(props.poster).width(80).height(150).fit("crop").url()
      : tmdb.poster && `https://image.tmdb.org/t/p/w200${tmdb.poster}`;

  const title = props.movie_title || "Ingen tittel";
  const releaseYearPostfix = props.release_year
    ? ` (${props.release_year})`
    : "";

  return (
    <Flex align="center" gap={3}>
      {/* Loading and error state for poster */}
      {(isLoading || error || !poster) && (
        <Card
          color="white"
          border
          radius={2}
          display={"flex"}
          style={{
            width: 50,
            height: 75,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading && <Spinner muted />}

          {!isLoading && error && <ErrorOutlineIcon />}

          {!isLoading && !error && !poster && (
            <VideoIcon style={{ fontSize: "2rem" }} />
          )}
        </Card>
      )}

      {/* Poster */}
      {!isLoading && !error && poster && (
        <img
          src={poster}
          alt="Movie Poster"
          style={{
            borderRadius: 2,
            width: 40,
            height: 75,
            objectFit: "cover",
          }}
        />
      )}

      {/* Title and subtitle */}
      <Stack gap={2}>
        <Text size={1} weight="medium">
          {title + releaseYearPostfix}
        </Text>
        {props.directors && (
          <Text size={1} style={{ color: "gray" }}>
            {props.directors}
          </Text>
        )}
      </Stack>
    </Flex>
  );
};
