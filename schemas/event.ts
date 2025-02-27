import {defineField, defineType} from 'sanity'
import {formatPreviewDate} from '../utils/formatPreviewDate'

export default defineType({
  name: 'event',
  title: 'Bilder',
  type: 'document',
  fields: [
    defineField({
      type: 'string',
      name: 'name',
      title: 'Tittel',
    }),
    defineField({
      type: 'date',
      name: 'date',
      title: 'Dato',
    }),
    defineField({
      type: 'event_media',
      name: 'event_media',
      title: 'Bilder og videoer',
    }),
  ],
  orderings: [
    {
      title: 'Dato, synkende',
      name: 'date_desc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Dato, stigende',
      name: 'date_asc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      media: 'event_media',
      date: 'date',
      name: 'name',
    },
    prepare({media, date, name}) {
      const image = media?.find((m: {_type: string}) => m._type === 'image')

      return {
        title: name,
        subtitle: formatPreviewDate(date),
        media: image,
      }
    },
  },
})
