import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Instillinger",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel på instillingene",
      type: "string",
      description:
        'Tittelen på de aktive instillingene MÅ hete "Instillinger". Du kan velge å bare alltid ha ett sett med instillinger, eller "arkivere" gamle instillinger (ved å kalle de noe nytt) og lage nye.',
    }),
    defineField({
      name: "recruiting",
      title: "Opptaksinstillinger",
      type: "object",
      description:
        "Her kan du aktivere opptak og legge til link til Google form",
      fields: [
        defineField({
          name: "recruiting_active",
          title: "Aktivt opptak?",
          type: "boolean",
          description:
            "Aktiver når det er opptak, for å vise opptakssiden i menyen",
        }),
        defineField({
          name: "recruiting_form",
          title: "Link til Google form",
          type: "url",
          description: "Link til Google form for opptak",
          hidden: ({ parent }) => {
            return !parent?.recruiting_active;
          },
        }),
      ],
    }),
  ],
});
