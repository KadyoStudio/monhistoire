/**
 * Envoi des liens de connexion.
 *
 * Le fournisseur d'envoi n'est pas tranché dans les documents (voir
 * docs/01-PLAN-VALIDE.md §8). En développement, le lien est écrit dans la
 * console : le parcours complet est testable sans aucun secret.
 *
 * En production, l'absence de fournisseur est une erreur franche et non un
 * silence : un lien qui n'arrive pas est indiscernable, pour le narrateur,
 * d'une application cassée.
 */

interface MagicLinkEmail {
  email: string;
  url: string;
}

export async function sendMagicLinkEmail({ email, url }: MagicLinkEmail): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n  Lien de connexion pour ${email} :\n  ${url}\n`);
    return;
  }

  throw new Error(
    "Aucun fournisseur d'envoi d'e-mail n'est configuré. " +
      "Le lien de connexion ne peut pas partir.",
  );
}
