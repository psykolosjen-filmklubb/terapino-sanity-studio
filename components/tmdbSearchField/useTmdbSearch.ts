import useSWRImmutable from 'swr/immutable'

interface TmdbResponse {
  results: Movie[]
  total_results: number
  total_pages: number
  page: number
}

export interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string
}

const fetcher = async (url: string): Promise<TmdbResponse> => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return res.json()
}

export function useTmdbSearch(searchTerm: string) {
  const {data, error, isLoading} = useSWRImmutable(
    searchTerm
      ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.SANITY_STUDIO_TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`
      : null,
    fetcher,
  )

  return {
    movies: data?.results,
    error,
    isLoading,
  }
}
