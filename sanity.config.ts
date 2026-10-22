import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { colorInput } from "@sanity/color-input";
import { createPublishMemberAction } from "./actions/publish-member-action";
import { createPublishScreeningAction } from "./actions/publish-screening-action";
import { createPublishSemesterAction } from "./actions/publish-semester-action";
import { SemesterScreeningsView } from "./components/SemesterScreeningsView";
import { SEMESTERS_NEWEST_FIRST } from "./schemas/documents/semester";

export default defineConfig({
  name: "default",
  title: "Terapino Studio",

  projectId: "4s9wdr84",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({
      // The default list, except that semesters are sorted newest first.
      structure: (S) =>
        S.list()
          .title("Content")
          .items(
            S.documentTypeListItems().map((item) =>
              item.getId() === "semester"
                ? item.child(
                    S.documentTypeList("semester").defaultOrdering(
                      SEMESTERS_NEWEST_FIRST.by,
                    ),
                  )
                : item,
            ),
          ),
      defaultDocumentNode: (S, { schemaType }) =>
        schemaType === "semester"
          ? S.document().views([
              S.view.form(),
              S.view.component(SemesterScreeningsView).title("Visninger"),
            ])
          : S.document(),
    }),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) =>
      prev.map((originalAction) => {
        if (
          originalAction.action === "publish" &&
          context.schemaType === "screening"
        ) {
          return createPublishScreeningAction(originalAction);
        }
        if (
          originalAction.action === "publish" &&
          context.schemaType === "semester"
        ) {
          return createPublishSemesterAction(originalAction);
        }
        if (
          originalAction.action === "publish" &&
          context.schemaType === "member"
        ) {
          return createPublishMemberAction(originalAction);
        }
        return originalAction;
      }),
  },
});
