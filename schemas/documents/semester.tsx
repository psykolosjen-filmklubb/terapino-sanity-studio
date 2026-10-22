import { defineField, defineType } from "sanity";
import {
  semesterName,
  validateSemester,
  type SemesterDocument,
} from "../../utils/semester";

// "fall" sorts before "spring", so ascending season is latest first.
export const SEMESTERS_NEWEST_FIRST = {
  title: "Nyeste først",
  name: "newest_first",
  by: [
    { field: "semester_year", direction: "desc" as const },
    { field: "semester_season", direction: "asc" as const },
  ],
};

export default defineType({
  name: "semester",
  title: "Semesterprogram",
  type: "document",
  // Validate the combined identity whenever any field changes, not just the year.
  validation: (rule) =>
    rule.custom((_value, context) =>
      context.document
        ? validateSemester(
            context
              .getClient({ apiVersion: "2024-01-16" })
              .withConfig({ useCdn: false }),
            context.document as SemesterDocument,
          )
        : true,
    ),
  // Year and season identify the semester and give it its name.
  fieldsets: [
    {
      name: "period",
      title: "År og semester",
      description:
        "Semestre opprettes automatisk når en visning publiseres. Navnet, f.eks. «Høst 2026», settes fra år og semester når du publiserer.",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "semester_year",
      title: "År",
      type: "number",
      fieldset: "period",
      validation: (rule) => rule.required().integer().min(1000).max(9999),
    }),
    defineField({
      name: "semester_season",
      title: "Semester",
      type: "string",
      fieldset: "period",
      options: {
        list: [
          { title: "Vår", value: "spring" },
          { title: "Høst", value: "fall" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      // Derived from year and season by the publish action. Stored so Studio
      // search and the website can use it directly.
      name: "semester_name",
      title: "Semester-navn",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "color",
      title: "Semester-farge",
      type: "color",
      description: "Fargen semesteret vises med i arkivet",
    }),
  ],
  orderings: [
    SEMESTERS_NEWEST_FIRST,
    {
      title: "Eldste først",
      name: "oldest_first",
      by: [
        { field: "semester_year", direction: "asc" },
        { field: "semester_season", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      year: "semester_year",
      season: "semester_season",
      color: "color",
    },
    prepare({ year, season, color }) {
      const mediaElement = (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: color?.hex ?? "#6b8e72",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
          }}
        >
          🎬
        </div>
      );

      return {
        // Unpublished drafts do not have their derived name yet.
        title:
          typeof year === "number" && (season === "spring" || season === "fall")
            ? semesterName(year, season)
            : "Uten år og semester",
        media: mediaElement,
      };
    },
  },
});
