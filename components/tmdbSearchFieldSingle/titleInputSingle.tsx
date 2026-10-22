import { useEffect, useRef } from "react";
import { useFormValue, set, StringInputProps } from "sanity";

export const TitleInputSingle = (props: StringInputProps) => {
  const { onChange, value } = props;

  const tmdbTitle = useFormValue(["movie", "tmdb_data", "title"]) as string;
  // Start from the loaded value so opening a document does not overwrite the
  // field, even when React strict mode runs the effect twice on mount.
  const previousTmdbTitle = useRef(tmdbTitle);

  useEffect(() => {
    console.log(tmdbTitle);
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
