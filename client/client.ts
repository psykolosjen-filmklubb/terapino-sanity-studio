import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "4s9wdr84",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-16",
  useCdn: false,
});
