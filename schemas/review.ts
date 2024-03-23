import {defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Anmeldelser',
  type: 'document',
  fields: [
    {
      name: 'review_title',
      title: 'Overskriften til anmeldelsen',
      type: 'string',
      description: 'Denne kan også bare være film-tittelen',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'review_title',
        maxLength: 96,
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
    },
    {
      name: 'movie_title',
      title: 'Filmtittel',
      type: 'string',
    },
    {
      name: 'tmdb_id',
      title: 'TMDB ID',
      type: 'number',
      description:
        'ID-en til filmen på The Movie Database. Brukes til å hente bilde og info om filmen',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'authors',
      title: 'Forfatter(e)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {type: 'author'},
        },
      ],
    },
    {
      name: 'review',
      title: 'Anmeldelse',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Skriv selve filmanmeldelsen her',
    },
    {
      name: 'excerpt',
      title: 'Utdrag',
      type: 'string',
      description: 'Dette vises på fremsiden sammen med thumbnail',
    },
  ],
})
