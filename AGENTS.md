<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mon Histoire

PWA de mémoires vocales. Une personne âgée (70–95 ans, peu à l'aise avec le numérique)
raconte sa vie à voix haute. L'app enregistre, transcrit, nettoie la lisibilité sans
dénaturer sa voix, et range les souvenirs dans une frise qu'elle a construite. Le résultat
est un livre imprimé par un partenaire éditeur.

**Le narrateur utilise. Son enfant (45–65 ans) achète.** Deux publics, deux parcours.

Produit perso / SaaS. Marché français.

---

## Documents de référence

Tout le détail est dans `docs/`. En cas de doute, va les lire plutôt que de deviner.

- `docs/00-BRIEF-CLAUDE-CODE.md` — **le document maître.** Stack, modèle de données,
  phases, prompt IA
- `docs/01-PLAN-VALIDE.md` — **le plan arrêté.** Fait foi sur les points qu'il tranche
- `docs/mon-histoire-brief-fonctionnel.md` — produit et anticipation des défaillances
- `docs/mon-histoire-decisions-structure.md` — fragments, édition, chapitres, audio
- `docs/mon-histoire-onboarding-frise.md` — livre unique, onboarding, frise, aiguillage
- `docs/charte-graphique.md` — couleurs, typographie, tokens, voix
- `docs/impression-et-marche-france.md` — specs d'impression (partie 1) et business
  (partie 2, pas nécessaire au code)

En cas de contradiction entre documents, le plus récent l'emporte, et tu le signales.

---

## Les sept règles qu'on ne discute pas

1. **`rawText` et l'audio original ne sont jamais écrasés ni supprimés.** Trois couches :
   `rawText` (dit) → `readableText` (nettoyé) → `editedText` (repris à la main). Toute
   opération qui perd `rawText` est un bug.
2. **Aucune suppression définitive immédiate**, sur aucun objet. « Mettre de côté »,
   restaurable sans limite.
3. **L'aidant aide, il n'écrit pas.** Aucun droit d'écriture sur le contenu narratif.
4. **L'IA nettoie la lisibilité, elle ne réécrit pas.** Elle ne déplace, ne fusionne ni ne
   scinde un passage de sa propre initiative : le rangement est toujours une proposition
   validée par le narrateur, jamais automatique.
5. **Aucun état ambigu affiché.** Un utilisateur qui doute que son enregistrement soit
   conservé est un utilisateur perdu.
6. **L'export intégral est toujours disponible pour le narrateur**, sans condition. Deux
   exports distincts : « Mon archive » (tout, fragments privés et audio compris) et
   « Le livre » (à partager et à imprimer, sans les fragments privés).
7. **Le produit ne juge, ne corrige et ne modère jamais le contenu du récit.** Ni les
   faits, ni les dates, ni les contradictions, ni les répétitions.

---

## Règles de code permanentes

**Aucun `delete` Prisma dans le code applicatif.** « Mettre de côté » est un `setAsideAt`
horodaté. En fin de chaque phase, grep `delete` et `deleteMany` : toute occurrence doit être
justifiée par écrit ou retirée. C'est la règle la plus facile à casser par accident, et la
plus coûteuse.

**Tout accès part de `requireBook()`.** Aucun identifiant venu du client n'entre dans un
`where` sans être re-filtré par `bookId`. `Book.userId` est unique.

**Le texte affiché est toujours `editedText ?? readableText ?? rawText`**, partout, y
compris à l'impression. `editedAt != null` fait disparaître « Améliorer la lecture » sur ce
fragment, définitivement.

---

## Stack

Next.js 16 App Router · TypeScript strict, pas de `any` · Tailwind v4 · Prisma 7 + Neon
(région UE) · Better Auth, lien e-mail sans mot de passe · Vercel Blob UE · Serwist ·
Whisper (OpenAI) · Claude API · PostHog + Sentry · Vercel.

Prisma 7 diffère des versions antérieures : generator `prisma-client` avec `output`
obligatoire, URL de connexion dans `prisma.config.ts` et non dans le bloc `datasource`, et
driver adapter `@prisma/adapter-pg` requis à l'instanciation du client.

Server Components par défaut. Server Actions pour les mutations, validation Zod en entrée.
Toute requête Prisma filtrée par la session serveur, jamais par un identifiant client.

**Windows / PowerShell** : séparateur `;`, jamais `&&`. Cmdlets PowerShell
(`Copy-Item`, `Move-Item`, `Remove-Item`).

---

## Interface

- Police de base **20px minimum**, partout, sans exception. Réglage de taille toujours
  accessible
- Cibles tactiles 56px minimum
- Contraste AAA visé, AA absolu
- Une action principale par écran. Pas de hamburger, pas de navigation imbriquée
- Boutons libellés avec un verbe, en toutes lettres. Pas d'icône seule
- Aucun chargement muet : « J'écris ce que vous venez de dire… », jamais un spinner seul
- Tout doit être faisable à la voix, y compris l'onboarding, avec le clavier en alternative
- Vouvoiement systématique. Erreurs en langage courant, jamais vagues, jamais d'excuses

Design : pas de dégradé, pas d'emoji dans l'UI, pas d'Inter, pas de couleur flashy, pas
d'esthétique « générée par IA ». Icônes Lucide uniquement. Lighthouse 90+ sur les quatre
axes.

Couleurs : encre `#4A3B7C` · encre profonde `#221F2E` · papier `#F8F8F5` · papier marqué
`#EBEBE4` · marge `#C1443A` (réservé au signal d'enregistrement en cours) · réglure
`#C3C8DE`.
Polices : Spectral (titres) · Literata (récit) · Atkinson Hyperlegible (interface).

---

## Modèle économique

Achat unique ~129 € : 12 mois de dictée, photos incluses, un livre imprimé et expédié.
Lecture, export et audio **à vie**. Pas d'abonnement.

L'expiration suspend la dictée et **rien d'autre**. Jamais de suppression de contenu.

Ne sont jamais payants : les photos, le nombre de chapitres, la durée d'enregistrement,
« Améliorer la lecture », l'export, le partage familial.

---

## Méthode de travail

- Une phase à la fois (voir §8 du brief maître, renuméroté : paiement en 10, export et
  impression en 11). Arrêt et validation à chaque fin de phase
- Le plan et le `schema.prisma` complet se valident **avant** la première migration
- Si une règle paraît coûteuse à tenir ou si deux documents se contredisent : le dire,
  pas l'arbitrer silencieusement
