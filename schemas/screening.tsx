import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'screening',
  title: 'Visninger',
  type: 'document',
  fields: [
    defineField({
      name: 'movie_title',
      title: 'Filmtittel',
      type: 'string',
    }),
    defineField({
      name: 'release_year',
      title: 'Utgivelsesår',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'director',
      title: 'Regissør',
      type: 'string',
    }),
    defineField({
      name: 'tmdb_id',
      title: 'TMDB ID',
      type: 'number',
      description: (
        <span>
          ID-en til filmen på <a href="https://www.themoviedb.org/">The Movie Database</a>. Brukes
          til å hente bilde og info om filmen.
        </span>
      ),
    }),
    defineField({
      name: 'date',
      title: 'Visningsdato',
      type: 'date',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Dette blir URL-en til visningen, og må derfor være unik. Du kan trykke på "Generate" for å lage en basert på dato og tittel.',
      options: {
        source: (doc) => doc.date + '-' + doc.movie_title,
      },
    }),
    defineField({
      name: 'poster',
      title: 'Poster',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'poster_artists',
      title: 'Poster-kunstner(e)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: {type: 'author'},
        },
      ],
    }),
    defineField({
      name: 'promo_material',
      title: 'Promomateriale',
      type: 'array',
      of: [
        {
          name: 'image',
          type: 'image',
          title: 'Bilde',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternativ tekst',
              description: 'Beskriv bildet for skjermlesere',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'event_media',
      title: 'Bilder fra visningen',
      type: 'array',
      of: [
        {
          name: 'image',
          type: 'image',
          title: 'Bilde',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternativ tekst',
              description: 'Beskriv bildet for skjermlesere',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
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
})
