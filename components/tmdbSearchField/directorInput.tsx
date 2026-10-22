import { useEffect, useRef } from "react";
import { useFormValue, set, StringInputProps, KeyedSegment } from "sanity";

export const DirectorsInput = (props: StringInputProps) => {
  const { onChange, value } = props;

  const tmdbDirectors = useFormValue([
    "movies",
    { _key: (props.path[1] as KeyedSegment)._key },
    "tmdb_data",
    "directors",
  ]) as string;
  // Start from the loaded value so opening a document does not overwrite the
  // field, even when React strict mode runs the effect twice on mount.
  const previousTmdbDirectors = useRef(tmdbDirectors);

  useEffect(() => {
    if (previousTmdbDirectors.current === tmdbDirectors) {
      return;
    }
    previousTmdbDirectors.current = tmdbDirectors;

    if (tmdbDirectors && tmdbDirectors !== value) {
      onChange(set(tmdbDirectors));
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbDirectors, onChange]);

  return props.renderDefault(props);
};
