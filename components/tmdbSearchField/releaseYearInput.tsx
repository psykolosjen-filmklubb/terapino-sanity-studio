import { useEffect, useRef } from "react";
import { useFormValue, set, KeyedSegment, NumberInputProps } from "sanity";

/**
 * Value used to indicate that the TMDB title value has not been initialized yet.
 * This value is used to distinguish the initial state from subsequent updates.
 */
const TMDB_RELEASYEAR_UNINITIALIZED = -1;

export const ReleaseYearInput = (props: NumberInputProps) => {
  const { onChange, value } = props;

  const previousTmdbReleaseYear = useRef<number>(TMDB_RELEASYEAR_UNINITIALIZED);
  const tmdbReleaseYear = useFormValue([
    "movies",
    { _key: (props.path[1] as KeyedSegment)._key },
    "tmdb_data",
    "release_year",
  ]) as number;

  useEffect(() => {
    if (previousTmdbReleaseYear.current === TMDB_RELEASYEAR_UNINITIALIZED) {
      // This is the first time the component is rendered, so we don't want to
      // trigger an update
      previousTmdbReleaseYear.current = tmdbReleaseYear;
      return;
    }

    if (tmdbReleaseYear && tmdbReleaseYear !== value) {
      onChange(set(tmdbReleaseYear));
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbReleaseYear, onChange]);

  return props.renderDefault(props);
};
