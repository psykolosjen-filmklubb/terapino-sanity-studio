import {useEffect, useRef} from 'react'
import {useFormValue, set, StringInputProps, KeyedSegment} from 'sanity'

/**
 * Value used to indicate that the TMDB title value has not been initialized yet.
 * This value is used to distinguish the initial state from subsequent updates.
 */
const TMDB_TITLE_UNINITIALIZED = 'uninitialized'

export const TitleInput = (props: StringInputProps) => {
  const {onChange, value} = props

  const previousTmdbTitle = useRef<string>(TMDB_TITLE_UNINITIALIZED)
  const tmdbTitle = useFormValue([
    'movies',
    {_key: (props.path[1] as KeyedSegment)._key},
    'tmdb_data',
    'title',
  ]) as string

  useEffect(() => {
    if (previousTmdbTitle.current === TMDB_TITLE_UNINITIALIZED) {
      // This is the first time the component is rendered, so we don't want to
      // trigger an update
      previousTmdbTitle.current = tmdbTitle
      return
    }

    if (tmdbTitle && tmdbTitle !== value) {
      onChange(set(tmdbTitle))
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbTitle, onChange])

  return props.renderDefault(props)
}
