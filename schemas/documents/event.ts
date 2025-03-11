import {defineField, defineType} from 'sanity'
import {formatPreviewDate} from '../../utils/formatPreviewDate'

export default defineType({
  name: 'event',
  title: 'Bilder',
  type: 'document',
  fields: [
    defineField({
      type: 'string',
      name: 'name',
      title: 'Tittel',
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: 'date',
      name: 'date',
      title: 'Dato',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'end_date',
      title: 'Sluttdato',
      type: 'date',
      description: 'Hvis eventet var over en periode, kan du legge til sluttdato',
    }),
    defineField({
      type: 'event_media',
      name: 'event_media',
      title: 'Bilder og videoer',
      validation: (rule) => rule.required(),
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
      endDate: 'end_date',
      name: 'name',
    },
    prepare({media, date, name, endDate}) {
      const image = media?.find((m: {_type: string}) => m._type === 'image')

      return {
        title: name,
        subtitle: endDate
          ? formatPreviewDate(date) + ' - ' + formatPreviewDate(endDate)
          : formatPreviewDate(date),
        media: image,
      }
    },
  },
})
