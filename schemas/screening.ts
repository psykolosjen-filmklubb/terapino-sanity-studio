import {Rule, SanityDocument} from 'sanity'

export default {
  name: 'screening',
  title: 'Visninger',
  type: 'document',
  fields: [
    {
      name: 'movie_title',
      title: 'Filmtittel',
      type: 'string',
    },
    {
      name: 'release_year',
      title: 'Utgivelsesår',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().integer().positive(),
    },
    {
      name: 'director',
      title: 'Regissør',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Visningsdato',
      type: 'date',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: SanityDocument) => doc.date + '-' + doc.movie_title,
      },
    },
    {
      name: 'poster',
      title: 'Poster',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'poster_artists',
      title: 'Poster-kunstner(e)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {type: 'author'},
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Visningsdato, synkende',
      name: 'date_desc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Visningsdato, stigende',
      name: 'date_asc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
}
