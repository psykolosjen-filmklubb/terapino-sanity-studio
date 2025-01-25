import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'screening',
  title: 'Visninger',
  type: 'document',
  fields: [
    defineField({
      name: 'movies',
      title: 'Film(er)',
      description: 'Legg til filmer som skal vises',
      type: 'array',
      of: [{type: 'screening_movie'}],
    }),
    defineField({
      name: 'movie_title',
      title: 'Filmtittel',
      type: 'string',
      deprecated: {
        reason: 'Dette feltet forsvinner snart. Legg til info om filmen i "Film(er)"-objektet. ',
      },
    }),
    defineField({
      name: 'release_year',
      title: 'Utgivelsesår',
      type: 'number',
      deprecated: {
        reason: 'Dette feltet forsvinner snart. Legg til info om filmen i "Film(er)"-objektet. ',
      },
    }),
    defineField({
      name: 'director',
      title: 'Regissør',
      type: 'string',
      deprecated: {
        reason: 'Dette feltet forsvinner snart. Legg til info om filmen i "Film(er)"-objektet. ',
      },
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
      deprecated: {
        reason: 'Dette feltet forsvinner snart. Legg til info om filmen i "Film(er)"-objektet. ',
      },
    }),
    defineField({
      name: 'date',
      title: 'Visningsdato',
      type: 'date',
    }),
    defineField({
      name: 'tickets_url',
      title: 'Billettlenke',
      type: 'url',
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
      validation: (rule) => rule.required(),
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
          to: {type: 'member'},
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
        {
          name: 'video',
          type: 'object',
          title: 'Video',
          fields: [
            defineField({
              name: 'youtube_id',
              type: 'string',
              title: 'YouTube ID',
              description: (
                <span>
                  Legg inn ID-en til YouTube-videoen. F.eks. i{' '}
                  <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                    youtube.com/watch?v=dQw4w9WgXcQ
                  </a>
                  , så er &quot;dQw4w9WgXcQ&quot; ID-en.
                </span>
              ),
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
