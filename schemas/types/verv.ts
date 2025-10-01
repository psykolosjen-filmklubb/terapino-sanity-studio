import { defineField, defineType } from "sanity";
import { monthYearFormatter } from "../../utils/dateFormatters";
import { CalendarIcon } from "@sanity/icons";

export default defineType({
  name: "verv",
  type: "object",
  fields: [
    defineField({
      name: "role",
      title: "Rolle",
      description:
        'Hvis rollen ikke finnes, må den legges til under "Roller" i menyen til venstre.',
      validation: (rule) => rule.required(),
      type: "reference",
      to: { type: "role" },
    }),
    defineField({
      name: "from_date",
      title: "Fra dato",
      type: "date",
      description: "Datoen personen fikk rollen.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "to_date",
      title: "Til dato",
      type: "date",
      description: "La feltet være tomt hvis rollen er nåværende",
    }),
  ],
  preview: {
    select: {
      role: "role.name",
      from: "from_date",
      to: "to_date",
    },
    prepare(selection) {
      const { role, from, to } = selection;

      const fromDate = new Date(from);
      const toDate = to ? new Date(to) : null;

      const fromStr = monthYearFormatter.format(fromDate);
      const toStr = toDate ? monthYearFormatter.format(toDate) : null;

      return {
        title: role ?? "Medlem",
        subtitle: toStr ? fromStr + " - " + toStr : "Siden " + fromStr,
        media: CalendarIcon,
      };
    },
  },
});
