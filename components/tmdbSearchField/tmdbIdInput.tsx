import { useEffect, useRef } from "react";
import { useFormValue, set, KeyedSegment, NumberInputProps } from "sanity";

export const TmdbIdInput = (props: NumberInputProps) => {
  const { onChange, value } = props;

  const tmdbId = useFormValue([
    "movies",
    { _key: (props.path[1] as KeyedSegment)._key },
    "tmdb_data",
    "tmdb_id",
  ]) as number;
  // Start from the loaded value so opening a document does not overwrite the
  // field, even when React strict mode runs the effect twice on mount.
  const previousTmdbId = useRef(tmdbId);

  useEffect(() => {
    if (previousTmdbId.current === tmdbId) {
      return;
    }
    previousTmdbId.current = tmdbId;

    if (tmdbId && tmdbId !== value) {
      onChange(set(tmdbId));
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId, onChange]);

  return props.renderDefault(props);
};
