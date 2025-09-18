import { defineField, defineType } from "sanity";

export default defineType({
  name: "membership",
  type: "object",
  fields: [
    defineField({
      name: "from_date",
      title: "Fra dato",
      type: "date",
      description: "Datoen personen ble medlem.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "to_date",
      title: "Til dato",
      type: "date",
      description: "La feltet være tomt hvis personen fortsatt er med",
    }),
  ],
  preview: {
    select: {
      from: "from_date",
      to: "to_date",
    },
    prepare(selection) {
      const { from, to } = selection;
      return {
        title: to ? "Medlem fra " + from + " til " + to : "Med siden " + from,
      };
    },
  },
});
