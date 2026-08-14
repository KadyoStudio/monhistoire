import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sans connexion — Mon Histoire",
};

// Affichée quand la tablette n'a pas de réseau. Elle ne s'excuse pas et ne
// laisse aucun doute sur ce qui est conservé : c'est la défaillance la plus
// coûteuse du produit, et elle est presque toujours de communication.

export default function HorsLignePage() {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-xl mx-auto w-full">
      <h1 className="mb-6">Pas de connexion pour le moment</h1>
      <p className="recit mb-4">
        Cette tablette n&apos;est pas connectée à internet. Tout ce que vous avez raconté est
        conservé ici, sur l&apos;appareil.
      </p>
      <p className="recit">
        Dès que le wifi revient, vos pages partent toutes seules. Vous n&apos;avez rien à
        faire.
      </p>
    </main>
  );
}
