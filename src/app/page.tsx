import { requireBook } from "@/server/require-book";

// Écran d'accueil du narrateur. Il ne présente jamais une page blanche : à
// partir de la phase 2, il rappelle la dernière page enregistrée et propose une
// suite.

export default async function AccueilPage() {
  const { book } = await requireBook();

  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-xl mx-auto w-full">
      <h1 className="mb-6">{book.title ?? "Mon Histoire"}</h1>
      <p className="recit">
        Votre compte est prêt. Vous pourrez bientôt raconter votre première page.
      </p>
    </main>
  );
}
