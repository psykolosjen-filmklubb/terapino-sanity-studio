import { defineArrayMember, defineField, defineType } from "sanity";
import { formatPreviewDate } from "../../utils/formatPreviewDate";
import { getISOWeekNumber } from "../../utils/getCurrentWeek";

export default defineType({
  name: "movieOfTheWeek",
  title: "Ukens film",
  type: "document",
  fields: [
    defineField({
      name: "movie",
      title: "Film",
      description: "Legg til film som skal anbefales",
      type: "screening_movie_single",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "weekNumber",
      title: "Uke nummer",
      type: "number",
      initialValue: () => getISOWeekNumber(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "År",
      type: "number",
      initialValue: () => new Date().getFullYear(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Tekst",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Skriv hva du vil",
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description:
        'Dette blir URL-en til anbefalingen, og må derfor være unik. Du kan trykke på "Generate" for å lage en basert på dato og tittel.',
      options: {
        source: (doc) => {
          const weekNumber =
            typeof doc.weekNumber === "number" ? doc.weekNumber : "";
          const year = new Date(doc._createdAt).getFullYear();
          console.log({ doc });
          const title =
            typeof (doc.movie as any).title === "string"
              ? (doc.movie as any).title
              : "";
          return year + "-" + weekNumber + "-" + title;
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "recommender",
      title: "Anbefaler",
      type: "reference",
      to: { type: "member" },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "movie.title",
    },
  },
});
