// @ts-check
import { defineConfig } from "astro/config";

/**
 * Eyebrow spacing — the gap around .text-sup is its CSS margin
 * (typography.css), so source whitespace around it would add a second,
 * inconsistent gap (a space, a newline, or nothing, depending on how the
 * line was typed). This strips whitespace between a .text-sup span and the
 * text on either side, including across wrapper tags like
 * <span class="tint-goal"> or </strong>. Whitespace inside tags (attributes)
 * and inside the eyebrow itself is left alone.
 * It also puts a word joiner (U+2060, zero width) after the eyebrow so a
 * line can't break between it and the word it labels.
 */
const TAG_RUN = String.raw`(?:<\/?[a-zA-Z][^<>]*>|\s)*`;
const SUP = String.raw`<span class="[^"]*\btext-sup\b[^"]*"[^>]*>[^<]*<\/span>`;
const SUP_WITH_RUNS = new RegExp(`(${TAG_RUN})(${SUP})(${TAG_RUN})`, "g");
const squeeze = (run) => run.replace(/>\s+</g, "><").trim();

function trimEyebrowWhitespace() {
  return {
    name: "trim-eyebrow-whitespace",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".astro") || !code.includes("text-sup")) return;
      return code.replace(SUP_WITH_RUNS, (_, before, sup, after) => squeeze(before) + sup + "⁠" + squeeze(after));
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Custom domain (see /CNAME) — used for canonical + OG URLs
  site: "https://aarnavdesigns.com",

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

  vite: {
    plugins: [trimEyebrowWhitespace()],
  },
});
