import { defineArrayMember, defineField, defineType } from "sanity";
import { formatPreviewDate } from "../../utils/formatPreviewDate";
import {
  SemesterReferenceInput,
  UntitledField,
} from "../../components/SemesterReferenceInput";

export default defineType({
  name: "screening",
  title: "Visninger",
  type: "document",
  // Groups the automatic toggle with the semester under one heading.
  fieldsets: [{ name: "semester", title: "Semester" }],
  fields: [
    defineField({
      name: "movies",
      title: "Film(er)",
      description: "Legg til filmer som skal vises",
      type: "array",
      of: [defineArrayMember({ type: "screening_movie" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Visningsdato",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "auto_semester",
      title: "Automatisk semester",
      type: "boolean",
      fieldset: "semester",
      description:
        "Slå av for å velge semester selv, eller for å holde visningen utenfor semesterarkivet.",
      initialValue: true,
    }),
    defineField({
      name: "semester",
      title: "Semester",
      type: "reference",
      fieldset: "semester",
      to: [{ type: "semester" }],
      options: { disableNew: true },
      // A missing value means automatic: older drafts predate this field.
      readOnly: ({ document }) => document?.auto_semester !== false,
      // The fieldset already shows the "Semester" heading.
      components: { input: SemesterReferenceInput, field: UntitledField },
    }),
    defineField({
      name: "tickets_url",
      title: "Billettlenke",
      type: "url",
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description:
        'Dette blir URL-en til visningen, og må derfor være unik. Du kan trykke på "Generate" for å lage en basert på dato og tittel.',
      options: {
        source: (doc) => {
          const date = typeof doc.date === "string" ? doc.date : "";
          const titles = Array.isArray(doc.movies)
            ? doc.movies
                .map((movie) =>
                  typeof movie.title === "string" ? movie.title : "",
                )
                .join("-og-")
            : "";
          return date + "-" + titles;
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "poster_artists",
      title: "Poster-kunstner(e)",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: { type: "member" },
        }),
      ],
    }),
    defineField({
      name: "promo_material",
      title: "Promomateriale",
      type: "event_media",
    }),
    defineField({
      name: "event_media",
      title: "Bilder fra visningen",
      type: "event_media",
    }),
  ],
  orderings: [
    {
      title: "Visningsdato, synkende",
      name: "date_desc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Visningsdato, stigende",
      name: "date_asc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title0: "movies.0.title",
      title1: "movies.1.title",
      title2: "movies.2.title",
      date: "date",
      poster: "poster",
    },
    prepare({ title0, title1, title2, date, poster }) {
      return {
        title: [title0, title1, title2].filter(Boolean).join(" & "),
        subtitle: formatPreviewDate(date),
        media: poster,
      };
    },
  },
});
