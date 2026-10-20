import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "4s9wdr84",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
