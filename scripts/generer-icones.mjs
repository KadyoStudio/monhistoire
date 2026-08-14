import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// iOS ignore les icônes SVG déclarées dans un manifest : sans PNG, l'ajout à
// l'écran d'accueil produit une capture de la page au lieu du logo.
//
// À relancer si le logo change :  node scripts/generer-icones.mjs

const racine = resolve(dirname(fileURLToPath(import.meta.url)), "../public");
const source = readFileSync(`${racine}/brand/icone-app-512.svg`);
const ENCRE = "#4A3B7C";

mkdirSync(`${racine}/icons`, { recursive: true });

async function rendre(taille, sortie) {
  await sharp(source, { density: 512 })
    .resize(taille, taille)
    .flatten({ background: ENCRE }) // iOS n'accepte pas la transparence
    .png()
    .toFile(`${racine}/icons/${sortie}`);
  console.log(`${sortie} — ${taille}×${taille}`);
}

// Maskable : le logo doit tenir dans les 80 % centraux, sinon Android le rogne.
async function rendreMaskable(taille, sortie) {
  const interieur = Math.round(taille * 0.8);
  const marge = Math.round((taille - interieur) / 2);

  const logo = await sharp(source, { density: 512 })
    .resize(interieur, interieur)
    .png()
    .toBuffer();

  await sharp({
    create: { width: taille, height: taille, channels: 4, background: ENCRE },
  })
    .composite([{ input: logo, top: marge, left: marge }])
    .png()
    .toFile(`${racine}/icons/${sortie}`);
  console.log(`${sortie} — ${taille}×${taille} (maskable)`);
}

await rendre(180, "apple-touch-icon.png");
await rendre(192, "icon-192.png");
await rendre(512, "icon-512.png");
await rendreMaskable(512, "icon-maskable-512.png");
