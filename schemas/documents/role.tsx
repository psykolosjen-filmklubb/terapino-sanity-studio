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
  preview: {
    select: {
      title: "name",
      order: "sort_order",
    },
    prepare({ title, order }) {
      const orderElement = (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {order}
        </div>
      );

      return {
        title: title,
        media: orderElement,
      };
    },
  },
});
