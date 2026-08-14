"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Bouton } from "@/components/bouton";

type Etat = "saisie" | "envoi" | "envoye";

export default function ConnexionPage() {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<Etat>("saisie");
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyerLeLien(evenement: React.FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    setEtat("envoi");

    const { error } = await authClient.signIn.magicLink({
      email: email.trim(),
      callbackURL: "/",
    });

    if (error) {
      // Les erreurs ne s'excusent pas et ne sont jamais vagues : ce qui s'est
      // passé, et quoi faire maintenant.
      setErreur(
        "Le lien n'a pas pu partir. Vérifiez votre adresse e-mail, puis réessayez.",
      );
      setEtat("saisie");
      return;
    }

    setEtat("envoye");
  }

  if (etat === "envoye") {
    return (
      <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-xl mx-auto w-full">
        <h1 className="mb-6">Regardez votre boîte e-mail</h1>
        <p className="recit mb-4">
          Nous venons d&apos;envoyer un lien à {email}. Ouvrez-le, et vous serez connecté.
        </p>
        <p className="recit mb-8">
          Le lien reste valable une heure. Vous pouvez fermer cette page.
        </p>
        <Bouton variante="discret" onClick={() => setEtat("saisie")}>
          Utiliser une autre adresse
        </Bouton>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-xl mx-auto w-full">
      <h1 className="mb-4">Mon Histoire</h1>
      <p className="recit mb-8">
        Indiquez votre adresse e-mail. Nous vous enverrons un lien pour entrer, sans mot de
        passe à retenir.
      </p>

      <form onSubmit={envoyerLeLien}>
        <label htmlFor="email" className="block mb-2 font-ui">
          Votre adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(evenement) => setEmail(evenement.target.value)}
          className="w-full mb-6 px-4 py-4 rounded-doux font-ui text-base
                     bg-papier border-2 border-encre-profonde/30
                     focus:border-encre"
        />

        {erreur !== null && (
          <p role="alert" className="mb-6 font-ui text-marge">
            {erreur}
          </p>
        )}

        <Bouton type="submit" disabled={etat === "envoi"}>
          {etat === "envoi" ? "J'envoie votre lien…" : "Recevoir mon lien"}
        </Bouton>
      </form>
    </main>
  );
}
