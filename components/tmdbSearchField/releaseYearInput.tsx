import { useEffect, useRef } from "react";
import { useFormValue, set, KeyedSegment, NumberInputProps } from "sanity";

export const ReleaseYearInput = (props: NumberInputProps) => {
  const { onChange, value } = props;

  const tmdbReleaseYear = useFormValue([
    "movies",
    { _key: (props.path[1] as KeyedSegment)._key },
    "tmdb_data",
    "release_year",
  ]) as number;
  // Start from the loaded value so opening a document does not overwrite the
  // field, even when React strict mode runs the effect twice on mount.
  const previousTmdbReleaseYear = useRef(tmdbReleaseYear);

  useEffect(() => {
    if (previousTmdbReleaseYear.current === tmdbReleaseYear) {
      return;
    }
    previousTmdbReleaseYear.current = tmdbReleaseYear;

    if (tmdbReleaseYear && tmdbReleaseYear !== value) {
      onChange(set(tmdbReleaseYear));
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbReleaseYear, onChange]);

  return props.renderDefault(props);
};
