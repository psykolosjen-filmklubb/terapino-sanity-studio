import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'verv',
  type: 'object',
  fields: [
    defineField({
      name: 'role',
      title: 'Rolle',
      description: 'Hvis rollen ikke finnes, må den legges til under "Rolle" i menyen til venstre.',
      validation: (rule) => rule.required(),
      type: 'reference',
      to: {type: 'role'},
    }),
    defineField({
      name: 'from_date',
      title: 'Fra dato',
      type: 'date',
      description: 'Datoen personen fikk rollen.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'to_date',
      title: 'Til dato',
      type: 'date',
      description: 'La feltet være tomt hvis rollen er nåværende',
    }),
  ],
  preview: {
    select: {
      role: 'role.name',
      from: 'from_date',
      to: 'to_date',
    },
    prepare(selection) {
      const {role, from, to} = selection
      return {
        title: role ?? 'Medlem',
        subtitle: to ? from + ' - ' + to : 'Siden ' + from,
      }
    },
  },
})
