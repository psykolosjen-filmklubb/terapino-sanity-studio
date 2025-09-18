import { defineField, defineType } from "sanity";

export default defineType({
  name: "role",
  title: "Roller",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Rollenavn",
      type: "string",
    }),
    defineField({
      name: "sort_order",
      title: "Sorteringsrekkefølge",
      type: "number",
      description:
        'Bestemmer hvilken rekkefølge rollen blir vist i (f.eks. på "Om oss" siden). Lavt tall er høyere opp.',
    }),
  ],
  orderings: [
    {
      title: "Sorteringsrekkefølge",
      name: "sort_order",
      by: [{ field: "sort_order", direction: "asc" }],
    },
  ],
});
