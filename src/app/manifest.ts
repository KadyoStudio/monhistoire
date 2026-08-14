import type { MetadataRoute } from "next";

// L'application s'installe sur l'écran d'accueil d'un iPad. Elle s'ouvre en
// plein écran, sans barre d'adresse : le narrateur ne doit jamais voir qu'il
// est dans un navigateur.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mon Histoire",
    short_name: "Mon Histoire",
    description: "Racontez votre vie à voix haute. Nous en faisons un livre.",
    lang: "fr",
    dir: "ltr",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F8F8F5",
    theme_color: "#4A3B7C",
    // En PNG : iOS ignore les icônes SVG déclarées ici, et produirait une
    // capture de la page à la place du logo.
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
