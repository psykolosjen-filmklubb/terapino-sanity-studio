import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Anmeldelser',
  type: 'document',
  fields: [
    defineField({
      name: 'review_title',
      title: 'Overskriften til anmeldelsen',
      type: 'string',
      description: 'Denne kan også bare være film-tittelen',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'review_title',
        maxLength: 96,
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
    }),
    defineField({
      name: 'movie_title',
      title: 'Filmtittel',
      type: 'string',
    }),
    defineField({
      name: 'tmdb_id',
      title: 'TMDB ID',
      type: 'number',
      description:
        'ID-en til filmen på The Movie Database. Brukes til å hente bilde og info om filmen',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'authors',
      title: 'Forfatter(e)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: {type: 'member'},
        }),
      ],
    }),
    defineField({
      name: 'review',
      title: 'Anmeldelse',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Skriv selve filmanmeldelsen her',
    }),
    defineField({
      name: 'excerpt',
      title: 'Utdrag',
      type: 'string',
      description: 'Dette vises på fremsiden sammen med thumbnail',
    }),
  ],
})
