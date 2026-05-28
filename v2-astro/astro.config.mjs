// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Your GitHub Pages domain
  site: "https://rnavpatel.github.io",

  // Since the Astro project lives in the /v2-astro subfolder,
  // we build output to a relative dist folder.
  // The GitHub Actions workflow will deploy from there.
  outDir: "../dist",

  // No base path needed since this will be at the root when deployed
  base: "/",

  // Build settings
  build: {
    // Inline small assets for performance
    inlineStylesheets: "auto",
  },
});
