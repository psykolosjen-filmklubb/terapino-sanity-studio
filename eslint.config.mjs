import { defineConfig } from "eslint/config";
import studio from "@sanity/eslint-config-studio";

export default defineConfig([...studio, { ignores: ["dist/"] }]);
