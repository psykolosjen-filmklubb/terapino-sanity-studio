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
  ],
}
