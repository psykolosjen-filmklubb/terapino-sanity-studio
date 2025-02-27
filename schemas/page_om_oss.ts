import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'page_om_oss',
  title: 'Side: Om oss',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Side-innhold til "Om oss"',
      type: 'string',
      description: 'Den som blir sist redigert er den som blir brukt på nettsiden.',
    }),
    defineField({
      name: 'header_image',
      title: 'Hoved-bilde',
      type: 'object',
      description: 'Bilde som vises helt øverst på siden',
      fields: [
        defineField({
          name: 'image',
          title: 'Bilde',
          type: 'image',
          options: {
            hotspot: true,
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternativ tekst',
          description: 'Beskriv bildet for skjermlesere',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'main_text',
      title: 'Tekst',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Hovedteksten om oss',
    }),
  ],
})
