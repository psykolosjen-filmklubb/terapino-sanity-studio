import { PreviewProps } from "sanity";
import { Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useTmdbPoster } from "../swr/useTmdbPoster";
import { ErrorOutlineIcon } from "@sanity/icons/ErrorOutline";
import { VideoIcon } from "@sanity/icons/Video";

// Partial so MovieSingleInput can render it outside a Sanity preview.
type Props = Partial<PreviewProps> & {
  tmdb_id?: string;
  movie_title?: string;
  release_year?: number;
  directors?: string;
};

export const CustomMoviePreview = (props: Props) => {
  const { poster, isLoading, error } = useTmdbPoster(props.tmdb_id || "");

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
          src={`https://image.tmdb.org/t/p/w200${poster}`}
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
