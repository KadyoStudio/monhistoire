import { Resend } from "resend";

/**
 * Envoi des liens de connexion.
 *
 * En développement, le lien est écrit dans la console : le parcours complet est
 * testable sans aucun secret.
 *
 * En production, l'absence de fournisseur est une erreur franche et non un
 * silence. Un lien qui n'arrive pas est indiscernable, pour le narrateur, d'une
 * application cassée — et il n'a aucun moyen de savoir lequel des deux.
 */

interface MagicLinkEmail {
  email: string;
  url: string;
}

const EXPEDITEUR = process.env.EMAIL_FROM ?? "Mon Histoire <onboarding@resend.dev>";

// Le destinataire a souvent 85 ans et lit ses e-mails sur une tablette. Corps
// de texte large, une seule action, aucune image, aucun pied de page chargé.
function corpsHtml(url: string): string {
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#F8F8F5;font-family:Georgia,serif;color:#221F2E">
    <div style="max-width:520px;margin:0 auto">
      <p style="font-size:22px;line-height:1.6;margin:0 0 24px">Bonjour,</p>
      <p style="font-size:22px;line-height:1.6;margin:0 0 32px">
        Voici votre lien pour entrer dans Mon Histoire.
      </p>
      <p style="margin:0 0 32px">
        <a href="${url}"
           style="display:inline-block;background:#4A3B7C;color:#F8F8F5;font-size:22px;
                  padding:18px 32px;border-radius:12px;text-decoration:none">
          Entrer dans Mon Histoire
        </a>
      </p>
      <p style="font-size:20px;line-height:1.6;margin:0 0 24px">
        Ce lien reste valable une heure. Il ne fonctionne qu&rsquo;une fois.
      </p>
      <p style="font-size:20px;line-height:1.6;margin:0;color:#4A3B7C">
        Si le bouton ne s&rsquo;ouvre pas, copiez cette adresse dans votre navigateur :<br />
        ${url}
      </p>
    </div>
  </body>
</html>`;
}

function corpsTexte(url: string): string {
  return [
    "Bonjour,",
    "",
    "Voici votre lien pour entrer dans Mon Histoire :",
    url,
    "",
    "Ce lien reste valable une heure. Il ne fonctionne qu'une fois.",
  ].join("\n");
}

export async function sendMagicLinkEmail({ email, url }: MagicLinkEmail): Promise<void> {
  const cle = process.env.RESEND_API_KEY;

  if (!cle) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n  Lien de connexion pour ${email} :\n  ${url}\n`);
      return;
    }
    throw new Error(
      "RESEND_API_KEY est absente. Le lien de connexion ne peut pas partir.",
    );
  }

  const resend = new Resend(cle);

  const { error } = await resend.emails.send({
    from: EXPEDITEUR,
    to: email,
    subject: "Votre lien pour entrer dans Mon Histoire",
    text: corpsTexte(url),
    html: corpsHtml(url),
  });

  if (error) {
    // Remonte à Better Auth, qui renverra une erreur à la page de connexion.
    // Mieux vaut un message honnête qu'une attente sans fin devant une boîte
    // e-mail vide.
    throw new Error(`L'envoi du lien a échoué : ${error.message}`);
  }
}
