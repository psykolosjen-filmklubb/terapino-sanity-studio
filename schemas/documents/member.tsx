import { defineArrayMember, defineField, defineType } from "sanity";
import { urlFor } from "../../utils/imageBuilder";

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
    defineField({
      name: "is_active",
      title: "Er aktivt medlem?",
      type: "boolean",
      initialValue: true,
      hidden: true,
    }),
    defineField({
      name: "last_membership_date",
      title: "Siste medlemskapsdato",
      type: "date",
      initialValue: new Date().toISOString().split("T")[0],
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Medlemskap",
      name: "memberOrdering",
      by: [
        { field: "is_active", direction: "desc" },
        { field: "last_membership_date", direction: "desc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      name: "name",
      image: "image",
      isActive: "is_active",
    },
    prepare({ name, image, isActive }) {
      let imageUrl = urlFor(image).width(124).height(124).url();

      if (!isActive) {
        // Apply grayscale filter for inactive members
        imageUrl += "&cs=b-w";
      }

      return {
        title: name,
        media: (
          <img
            src={imageUrl}
            alt={name}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        ),
      };
    },
  },
});
