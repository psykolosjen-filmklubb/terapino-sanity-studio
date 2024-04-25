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
      name: 'memberships',
      title: 'Medlemskap',
      description: 'Når ble personen medlem og eventuelt når sluttet personen.',
      validation: (rule) => rule.required(),
      type: 'array',
      of: [{type: 'membership'}],
    },
    {
      name: 'verv',
      title: 'Roller',
      description: 'Legg til hvilke perioder personen har hatt rolle eller har nå.',
      type: 'array',
      of: [{type: 'verv'}],
    },
  ],
})
