import { defineField, defineType } from "sanity";
import { CustomMoviePreview } from "../../components/CustomMoviePreview";
import { TmdbSearchFieldSingle } from "../../components/tmdbSearchFieldSingle/tmdbSearchFieldSingle";
import { MovieSingleInput } from "../../components/MovieSingleInput";

export default defineType({
  name: "screening_movie_single",
  title: "Film",
  type: "object",
  // MovieSingleInput fills these from the search, so they stay folded away
  // unless someone wants to edit them by hand.
  fieldsets: [
    {
      name: "details",
      title: "Rediger detaljer manuelt",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "tmdb_data",
      title: "Søk etter film",
      description:
        "Her kan du søke opp en film (via TMDB). Hvis du ikke finner filmen, vil endre noen detaljer, eller bare er veldig gira på å skrive inn infoen manuelt, så kan du bruke feltene under.",
      type: "object",
      fields: [
        defineField({
          name: "title",
          type: "string",
        }),
        defineField({
          name: "release_year",
          type: "number",
        }),
        defineField({
          name: "directors",
          type: "string",
        }),
        defineField({
          name: "tmdb_id",
          type: "number",
        }),
      ],
      components: {
        input: TmdbSearchFieldSingle,
      },
    }),
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      fieldset: "details",
    }),
    defineField({
      name: "release_year",
      title: "Utgivelsesår",
      type: "number",
      fieldset: "details",
    }),
    defineField({
      name: "directors",
      type: "string",
      title: "Regissør(er)",
      fieldset: "details",
    }),
    defineField({
      name: "tmdb_id",
      type: "number",
      title: "TMDB ID",
      fieldset: "details",
      description: (
        <span>
          ID-en til filmen på{" "}
          <a href="https://www.themoviedb.org/">The Movie Database</a>. Brukes
          til å hente bilde og info om filmen.
        </span>
      ),
    }),
  ],
  components: {
    input: MovieSingleInput,
    preview: CustomMoviePreview,
  },
  preview: {
    select: {
      movie_title: "title",
      release_year: "release_year",
      directors: "directors",
      tmdb_id: "tmdb_id",
    },
  },
});
