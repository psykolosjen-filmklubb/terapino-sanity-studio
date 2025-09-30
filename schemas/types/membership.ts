import { defineField, defineType } from "sanity";
import { monthYearFormatter } from "../../utils/dateFormatters";

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

      const fromDate = new Date(from);
      const toDate = to ? new Date(to) : null;

      const fromStr = monthYearFormatter.format(fromDate);
      const toStr = toDate ? monthYearFormatter.format(toDate) : null;

      return {
        title: to
          ? "Medlem fra " + fromStr + " til " + toStr
          : "Med siden " + fromStr,
      };
    },
  },
});
