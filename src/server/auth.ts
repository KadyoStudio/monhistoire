import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";
import { sendMagicLinkEmail } from "./email";

const UN_JOUR = 60 * 60 * 24;
const UN_AN = UN_JOUR * 365;

// Le lien de connexion vaut une heure, pas cinq minutes. Une personne de 85 ans
// va chercher son e-mail sur un autre appareil, parfois avec de l'aide : le
// délai par défaut de Better Auth la mettrait en échec sans qu'elle comprenne
// pourquoi.
const VALIDITE_DU_LIEN = 60 * 60;

// Les déploiements de prévisualisation Vercel ont une URL différente à chaque
// fois : sans cela, le lien de connexion y serait refusé comme origine inconnue.
const originesVercel = process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [];

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  trustedOrigins: originesVercel,

  // Pas de mot de passe. La perte du mot de passe est un cas extrêmement
  // fréquent dans cette tranche d'âge, et souvent définitif.
  emailAndPassword: { enabled: false },

  // Le vrai mécanisme d'accès est la session sur la tablette, glissante et
  // longue. Le lien e-mail n'est que la porte d'entrée initiale. Aucune
  // déconnexion automatique.
  session: {
    expiresIn: UN_AN,
    updateAge: UN_JOUR,
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "NARRATEUR", input: false },
      // Aidant : voie de secours d'accès, modifiable par le narrateur seul.
      helperEmail: { type: "string", required: false },
      helperName: { type: "string", required: false },
      // Transmission après décès. Prévu dès l'inscription.
      beneficiaryName: { type: "string", required: false },
      beneficiaryEmail: { type: "string", required: false },
      // Réglage de taille du récit, 22 à 34px, toujours atteignable.
      textSizePx: { type: "number", defaultValue: 22 },
    },
  },

  plugins: [
    magicLink({
      expiresIn: VALIDITE_DU_LIEN,
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ email, url });
      },
    }),
    // Doit rester le dernier plugin de la liste.
    nextCookies(),
  ],
});
