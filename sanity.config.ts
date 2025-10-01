import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { colorInput } from "@sanity/color-input";
import { createPublishMemberAction } from "./actions/publish-member-action";

export default defineConfig({
  name: "default",
  title: "Terapino Studio",

  projectId: "4s9wdr84",
  dataset: "production",

  plugins: [structureTool(), visionTool(), colorInput()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) =>
      prev.map((originalAction) => {
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
