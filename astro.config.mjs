import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://fsn-web.vercel.app",
  output: "static",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
