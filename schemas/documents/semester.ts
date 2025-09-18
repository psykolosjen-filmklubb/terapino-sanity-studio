import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "semester",
  title: "Semesterprogram",
  type: "document",
  fields: [
    defineField({
      name: "semester_name",
      title: "Semester-navn",
      type: "string",
      description: 'F.eks. "Høst 2021"',
    }),
    defineField({
      name: "start_date",
      title: "Startdato",
      type: "date",
      description:
        "Første dag i semesteret (ikke viktig at det er nøyaktig, brukes til å sortere semesterene i riktig rekkefølge)",
    }),
    defineField({
      name: "color",
      title: "Semester-farge",
      type: "color",
      description: "Fargen semesteret vises med i arkivet",
    }),
    defineField({
      name: "screenings",
      title: "Visninger",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: { type: "screening" },
        }),
      ],
      description: "Visningene som er en del av dette semesteret",
    }),
  ],
  orderings: [
    {
      title: "Startdato, synkende",
      name: "start_date_desc",
      by: [{ field: "start_date", direction: "desc" }],
    },
    {
      title: "Startdato, stigende",
      name: "start_date_asc",
      by: [{ field: "start_date", direction: "asc" }],
    },
  ],
});
