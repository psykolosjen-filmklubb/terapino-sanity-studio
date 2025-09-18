import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "member",
  title: "Medlemmer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "memberships",
      title: "Medlemskap",
      description: "Når ble personen medlem og eventuelt når sluttet personen.",
      validation: (rule) => rule.required(),
      type: "array",
      of: [defineArrayMember({ type: "membership" })],
    }),
    defineField({
      name: "verv",
      title: "Roller",
      description:
        "Legg til hvilke perioder personen har hatt rolle eller har nå.",
      type: "array",
      of: [defineArrayMember({ type: "verv" })],
    }),
  ],
});
