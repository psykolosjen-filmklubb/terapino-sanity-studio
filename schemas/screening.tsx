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
        source: (doc) => {
          const date = typeof doc.date === 'string' ? doc.date : ''
          const titles = Array.isArray(doc.movies)
            ? doc.movies
                .map((movie) => (typeof movie.title === 'string' ? movie.title : ''))
                .join('-og-')
            : ''
          return date + '-' + titles
        },
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
  preview: {
    select: {
      title0: 'movies.0.title',
      title1: 'movies.1.title',
      title2: 'movies.2.title',
      date: 'date',
      poster: 'poster',
    },
    prepare({title0, title1, title2, date, poster}) {
      let dateString = 'Ikke satt dato'

      if (date) {
        const eventDate = new Date(date)
        const isCurrentYear = eventDate.getFullYear() === new Date().getFullYear()
        const dateFormatter = new Intl.DateTimeFormat('nb-NO', {
          day: 'numeric',
          month: 'long',
          ...(isCurrentYear ? {} : {year: 'numeric'}),
        })
        dateString = dateFormatter.format(eventDate)
      }

      return {
        title: [title0, title1, title2].filter(Boolean).join(' & '),
        subtitle: dateString,
        media: poster,
      }
    },
  },
})
