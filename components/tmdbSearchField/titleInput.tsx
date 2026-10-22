import { useEffect, useRef } from "react";
import { useFormValue, set, StringInputProps, KeyedSegment } from "sanity";

export const TitleInput = (props: StringInputProps) => {
  const { onChange, value } = props;

  const tmdbTitle = useFormValue([
    "movies",
    { _key: (props.path[1] as KeyedSegment)._key },
    "tmdb_data",
    "title",
  ]) as string;
  // Start from the loaded value so opening a document does not overwrite the
  // field, even when React strict mode runs the effect twice on mount.
  const previousTmdbTitle = useRef(tmdbTitle);

  useEffect(() => {
    if (previousTmdbTitle.current === tmdbTitle) {
      return;
    }
    previousTmdbTitle.current = tmdbTitle;

    if (tmdbTitle && tmdbTitle !== value) {
      onChange(set(tmdbTitle));
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbTitle, onChange]);

  return props.renderDefault(props);
};
