import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./db";
// Prisma 7 nomme les types de modèles avec le suffixe `Model`.
import type { BookModel } from "@/generated/prisma/models";

/**
 * Point d'entrée unique de tout accès aux données.
 *
 * Aucun identifiant venu du client n'entre dans un `where` sans être re-filtré
 * par le `bookId` que cette fonction renvoie. C'est la seule garantie qu'un
 * récit ne peut pas être lu par quelqu'un d'autre.
 */

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/connexion");
  }

  return session;
}

/**
 * Un compte = un narrateur = un livre. Le livre existe dès la création du
 * compte, sans que le narrateur ait à le nommer ni à le créer : il n'y a aucun
 * écran de sélection de livre, à aucun moment.
 */
export async function requireBook(): Promise<{ book: BookModel; userId: string }> {
  const session = await requireSession();
  const userId = session.user.id;

  const book = await prisma.book.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  return { book, userId };
}
