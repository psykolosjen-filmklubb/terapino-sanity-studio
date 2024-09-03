import {defineType} from 'sanity'

export default defineType({
  name: 'page_om_oss',
  title: 'Side: Om oss',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Side-innhold til "Om oss"',
      type: 'string',
      description: 'Den som blir sist redigert er den som blir brukt på nettsiden.',
    },
    {
      name: 'header_image',
      title: 'Hoved-bilde',
      type: 'object',
      description: 'Bilde som vises helt øverst på siden',
      fields: [
        {
          name: 'image',
          title: 'Bilde',
          type: 'image',
          options: {
            hotspot: true,
          },
          validation: (rule) => rule.required(),
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternativ tekst',
          description: 'Beskriv bildet for skjermlesere',
          validation: (rule) => rule.required(),
        },
      ],
    },
    {
      name: 'main_text',
      title: 'Tekst',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Hovedteksten om oss',
    },
  ],
})
