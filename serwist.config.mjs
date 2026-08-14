// @ts-check
import { spawnSync } from "node:child_process";
import { serwist } from "@serwist/next/config";

// Mode configurator : le service worker est construit après le prérendu de
// Next, en dehors du bundler. C'est ce qui le rend compatible avec Turbopack,
// activé par défaut depuis Next 16 — le mode plugin, lui, dépend de webpack.

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID();

export default serwist({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // La page « sans connexion » doit être disponible dès le premier passage
  // hors réseau.
  additionalPrecacheEntries: [{ url: "/hors-ligne", revision }],
});
