import {useEffect, useRef} from 'react'
import {useFormValue, set, StringInputProps, KeyedSegment} from 'sanity'

/**
 * Value used to indicate that the TMDB title value has not been initialized yet.
 * This value is used to distinguish the initial state from subsequent updates.
 */
const TMDB_DIRECTORS_UNINITIALIZED = 'uninitialized'

export const DirectorsInput = (props: StringInputProps) => {
  const {onChange, value} = props

  const previousTmdbDirectors = useRef<string>(TMDB_DIRECTORS_UNINITIALIZED)
  const tmdbDirectors = useFormValue([
    'movies',
    {_key: (props.path[1] as KeyedSegment)._key},
    'tmdb_data',
    'directors',
  ]) as string

  useEffect(() => {
    if (previousTmdbDirectors.current === TMDB_DIRECTORS_UNINITIALIZED) {
      // This is the first time the component is rendered, so we don't want to
      // trigger an update
      previousTmdbDirectors.current = tmdbDirectors
      return
    }

    if (tmdbDirectors && tmdbDirectors !== value) {
      onChange(set(tmdbDirectors))
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbDirectors, onChange])

  return props.renderDefault(props)
}
