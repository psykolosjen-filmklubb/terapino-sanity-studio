import {useEffect, useRef} from 'react'
import {useFormValue, set, KeyedSegment, NumberInputProps} from 'sanity'

/**
 * Value used to indicate that the TMDB title value has not been initialized yet.
 * This value is used to distinguish the initial state from subsequent updates.
 */
const TMDB_ID_UNINITIALIZED = -1

export const TmdbIdInput = (props: NumberInputProps) => {
  const {onChange, value} = props

  const previousTmdbId = useRef<number>(TMDB_ID_UNINITIALIZED)
  const tmdbId = useFormValue([
    'movies',
    {_key: (props.path[1] as KeyedSegment)._key},
    'tmdb_data',
    'tmdb_id',
  ]) as number

  useEffect(() => {
    if (previousTmdbId.current === TMDB_ID_UNINITIALIZED) {
      // This is the first time the component is rendered, so we don't want to
      // trigger an update
      previousTmdbId.current = tmdbId
      return
    }

    if (tmdbId && tmdbId !== value) {
      onChange(set(tmdbId))
    }

    // Disable exhaustive-deps since we don't want to trigger an update if
    // value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId, onChange])

  return props.renderDefault(props)
}
