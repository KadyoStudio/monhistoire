import type { Metadata, Viewport } from "next";
import { Spectral, Literata, Atkinson_Hyperlegible } from "next/font/google";
import { SerwistProvider } from "@serwist/next/react";
import { Analytics } from "@/lib/analytics";
import "./globals.css";

// Auto-hébergées au build par next/font : aucune requête du navigateur vers
// Google, comme l'exige la charte (RGPD et performance).
// Sous-ensemble latin étendu : les récits contiennent des noms propres accentués.

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Dessinée par le Braille Institute : I, l, 1 et O, 0 sont différenciés à
// dessein. Sur un produit destiné à des gens de 85 ans, c'est le bon outil.
const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mon Histoire",
  description: "Racontez votre vie à voix haute. Nous en faisons un livre.",
  applicationName: "Mon Histoire",
  appleWebApp: {
    capable: true,
    title: "Mon Histoire",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4A3B7C",
  width: "device-width",
  initialScale: 1,
  // Le zoom reste possible : le bloquer serait inacceptable sur ce public.
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${spectral.variable} ${literata.variable} ${atkinson.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-papier text-encre-profonde">
        <SerwistProvider swUrl="/sw.js">{children}</SerwistProvider>
        <Analytics />
      </body>
    </html>
  );
}
