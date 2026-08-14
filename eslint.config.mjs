import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Fichiers générés : le service worker construit par Serwist et le client
    // Prisma. Ni l'un ni l'autre ne se corrige à la main.
    "public/sw.js",
    "public/swe-worker*.js",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
