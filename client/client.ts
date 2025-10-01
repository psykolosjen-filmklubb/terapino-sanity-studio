import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "4s9wdr84",
  dataset: "production",
  apiVersion: "2024-01-16",
  useCdn: false,
});
