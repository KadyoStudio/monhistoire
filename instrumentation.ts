import * as Sentry from "@sentry/nextjs";

// Sans DSN, l'initialisation est inerte : le projet démarre et se déploie sans
// aucun secret d'observabilité.
// Le DSN doit pointer une région européenne (ingest.de.sentry.io) — les
// récits sont des données personnelles au sens du RGPD.

export function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    // Le contenu des récits ne doit jamais partir dans un outil tiers.
    sendDefaultPii: false,
  });
}

export const onRequestError = Sentry.captureRequestError;
