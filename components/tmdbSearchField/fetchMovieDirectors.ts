export interface TmdbCrewMember {
  id: number
  name: string
  job: string
}

interface TmdbCreditsResponse {
  id: number
  crew: TmdbCrewMember[]
}

export const fetchMovieDirectors = async (tmdb_id: number) => {
  const url = `https://api.themoviedb.org/3/movie/${tmdb_id}/credits?api_key=${process.env.SANITY_STUDIO_TMDB_API_KEY}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data: TmdbCreditsResponse = await response.json()

  const directors = data.crew.filter((crewMember) => crewMember.job === 'Director')

  return directors
}
