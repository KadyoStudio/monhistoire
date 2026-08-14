"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * Mesure d'usage.
 *
 * Le seul indicateur qui compte au démarrage est le taux de comptes créés qui
 * aboutissent à un livre imprimé — pas les inscriptions, pas le temps passé.
 *
 * Deux règles non négociables ici : l'hébergement est européen, et aucun
 * contenu de récit ne sort de l'application. On mesure des parcours, jamais des
 * souvenirs.
 */

const CLE = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOTE = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export function Analytics() {
  useEffect(() => {
    if (!CLE) return;

    posthog.init(CLE, {
      api_host: HOTE,
      // Pas de capture automatique du DOM : les libellés d'écran contiennent
      // les mots du narrateur (titres de chapitres nommés par lui).
      autocapture: false,
      capture_pageview: true,
      disable_session_recording: true,
      persistence: "localStorage",
    });
  }, []);

  return null;
}
