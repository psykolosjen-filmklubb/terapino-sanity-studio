import { useEffect, useRef } from "react";
import { Card, Stack } from "@sanity/ui";
import { Image, ObjectInputProps, set } from "sanity";
import { CustomMoviePreview } from "./CustomMoviePreview";

type MovieValue = {
  title?: string;
  release_year?: number;
  directors?: string;
  tmdb_id?: number;
  poster?: Image;
  tmdb_data?: Omit<MovieValue, "tmdb_data" | "poster">;
};

const SYNCED_FIELDS = [
  "title",
  "release_year",
  "directors",
  "tmdb_id",
] as const;

// Shows the TMDB search, a poster card for the chosen film, and the manual
// fields (collapsed) below it.
export const MovieSingleInput = (props: ObjectInputProps) => {
  const { onChange } = props;
  const value = props.value as MovieValue | undefined;
  const tmdbData = value?.tmdb_data;

  // Copy the search result into the manual fields. This lives here rather
  // than in each field, because collapsed fields are not mounted.
  // Start from the loaded value so opening a document does not overwrite the
  // fields, even when React strict mode runs the effect twice on mount.
  const previousTmdbId = useRef(tmdbData?.tmdb_id);

  useEffect(() => {
    if (previousTmdbId.current === tmdbData?.tmdb_id) {
      return;
    }
    previousTmdbId.current = tmdbData?.tmdb_id;

    const patches = SYNCED_FIELDS.filter(
      (field) => tmdbData?.[field] && tmdbData[field] !== value?.[field],
    ).map((field) => set(tmdbData?.[field], [field]));

    if (patches.length > 0) {
      onChange(patches);
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbData, onChange]);

  const isSearch = (member: (typeof props.members)[number]) =>
    member.kind === "field" && member.name === "tmdb_data";

  return (
    <Stack gap={4}>
      {props.renderDefault({
        ...props,
        members: props.members.filter(isSearch),
      })}

      {(value?.title || value?.tmdb_id || value?.poster?.asset) && (
        <Card border radius={2} padding={3}>
          <CustomMoviePreview
            movie_title={value.title}
            release_year={value.release_year}
            directors={value.directors}
            tmdb_id={value.tmdb_id ? String(value.tmdb_id) : undefined}
            poster={value.poster}
          />
        </Card>
      )}

      {props.renderDefault({
        ...props,
        members: props.members.filter((member) => !isSearch(member)),
      })}
    </Stack>
  );
};
