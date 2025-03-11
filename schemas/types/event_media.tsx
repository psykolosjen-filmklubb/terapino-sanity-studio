import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'event_media',
  type: 'array',
  of: [
    defineArrayMember({
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
    }),
    defineArrayMember({
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
    }),
  ],
  options: {
    layout: 'grid',
  },
})
