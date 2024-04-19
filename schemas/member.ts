import {defineType} from 'sanity'

export default defineType({
  name: 'member',
  title: 'Medlemmer',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'active',
      title: 'Aktiv',
      type: 'boolean',
      description: 'Er personen i styret nå?',
    },
  ],
})
