import {defineField, defineType} from 'sanity'
import {TmdbSearchField} from '../../components/tmdbSearchField/tmdbSearchField'
import {TitleInput} from '../../components/tmdbSearchField/titleInput'
import {ReleaseYearInput} from '../../components/tmdbSearchField/releaseYearInput'
import {DirectorsInput} from '../../components/tmdbSearchField/directorInput'
import {TmdbIdInput} from '../../components/tmdbSearchField/tmdbIdInput'

export default defineType({
  name: 'screening_movie',
  title: 'Film',
  type: 'object',
  fields: [
    defineField({
      name: 'tmdb_data',
      title: 'Søk etter film',
      description:
        'Her kan du søke opp en film (via TMDB). Hvis du ikke finner filmen, vil endre noen detaljer, eller bare er veldig gira på å skrive inn infoen manuelt, så kan du bruke feltene under.',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
        }),
        defineField({
          name: 'release_year',
          type: 'number',
        }),
        defineField({
          name: 'directors',
          type: 'string',
        }),
        defineField({
          name: 'tmdb_id',
          type: 'number',
        }),
      ],
      components: {
        input: TmdbSearchField,
      },
    }),
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      components: {
        input: TitleInput,
      },
    }),
    defineField({
      name: 'release_year',
      title: 'Utgivelsesår',
      type: 'number',
      components: {
        input: ReleaseYearInput,
      },
    }),
    defineField({
      name: 'directors',
      type: 'string',
      title: 'Regissør(er)',
      components: {
        input: DirectorsInput,
      },
    }),
    defineField({
      name: 'tmdb_id',
      type: 'number',
      title: 'TMDB ID',
      components: {
        input: TmdbIdInput,
      },
      description: (
        <span>
          ID-en til filmen på <a href="https://www.themoviedb.org/">The Movie Database</a>. Brukes
          til å hente bilde og info om filmen.
        </span>
      ),
    }),
  ],
})
