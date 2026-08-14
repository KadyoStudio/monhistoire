# Mon Histoire — Plan validé

Arrêté le 13 août 2026, après le tour de questions du §9 du brief maître et la réponse de
`reponse-plan-claude-code.md`.

Ce document fait foi sur les points qu'il tranche. Les documents de référence gardent
l'autorité sur tout le reste. En cas de contradiction avec un document antérieur, celui-ci
l'emporte, et la correction est reportée dans le document d'origine — voir §7.

---

## 1. Décisions d'architecture arrêtées

### 1.1 Enregistrement en arrière-plan — Wake Lock et coupure assumée

La limite est réelle et n'a pas de contournement : sur iOS, une PWA en arrière-plan voit son
contexte JavaScript suspendu et `MediaRecorder` s'arrête. Deux exigences distinctes, une
seule est tenable :

| Exigence | Tenable |
|---|---|
| Ne rien perdre de ce qui précède l'interruption | Oui — segments écrits en continu dans IndexedDB |
| Continuer à enregistrer écran verrouillé | Non |

**Pas d'application native.** Elle réglerait le problème mais ferait sauter l'installation
par lien, qui est ce qui permet à l'aidant d'installer le compte à distance.

À implémenter :

- `navigator.wakeLock.request('screen')` dans un `try/catch`, réacquis sur `visibilitychange`
  — le lock se libère de lui-même quand l'app perd le focus
- **Le Wake Lock était cassé dans les PWA installées jusqu'à iOS/iPadOS 18.4** (mars 2025).
  L'iPad d'occasion transmis par un petit-enfant est un cas fréquent sur ce public : l'échec
  d'acquisition est un cas réel, pas théorique
- Si l'acquisition échoue : consigne affichée **une seule fois**, avant le premier
  enregistrement — « Sur cette tablette, désactivez le verrouillage automatique de l'écran
  avant de commencer. Je vous montre comment. » Marche à suivre iPad, et un bouton pour
  l'envoyer par e-mail à l'aidant
- Au retour après coupure : le mot « conservé » figure dans la première phrase. Jamais un
  message qui ressemble à une erreur ou à un reproche. La coupure est un fait, pas un incident
- L'écran d'enregistrement reste lisible à distance : la tablette est posée sur la table.
  Niveau sonore en gros, filet de marge rouge actif, un seul bouton d'arrêt

### 1.2 Deux exports, jamais au même endroit

La règle 6 se lit : *l'export intégral est toujours disponible **pour le narrateur**, sans
condition.* Elle n'a jamais visé le partage.

- **« Mon archive »** — pour le narrateur seul. Tout, y compris les fragments privés, y
  compris l'audio. Portabilité RGPD
- **« Le livre »** — à partager et à imprimer. Exclut les fragments privés, sans option

Un fragment privé n'apparaît jamais dans un aperçu de bon à tirer, ni dans un compteur de
pages visible par un tiers.

### 1.3 L'impression est dans le périmètre V1

C'est la raison d'achat et le seul indicateur qui compte. Restent hors périmètre :
correction ou vérification factuelle, collaboration temps réel, application native,
multilingue. Les suggestions ancrées sur la frise (déterministes) et la banque de questions
d'amorçage (écrite à la main) sont **dans** le périmètre — ce qui en est exclu, c'est une IA
qui invente des sujets à partir du récit.

### 1.4 Les tomes ne sont pas des livres

`Book` reste unique par compte. Un tome est une coupe à l'impression : `volumeIndex` sur
`PrintOrder`. L'option commerciale s'appelle **« impression en plusieurs tomes »** ; le
« second tome » disparaît du vocabulaire.

### 1.5 Accès et récupération

Le vrai mécanisme d'accès est la session d'un an sur la tablette. Le lien e-mail n'est que la
porte d'entrée initiale.

- Sessions longues glissantes, aucune déconnexion automatique
- E-mail de l'aidant en voie de secours, saisi à l'inscription, modifiable

La voie de secours crée une tension avec la règle 3 — celui qui peut récupérer l'accès peut
de fait entrer dans le compte. Encadrement :

- La récupération par l'aidant **notifie le narrateur** de façon visible et durable, pas un
  bandeau qui disparaît
- Le narrateur change d'aidant à tout moment, seul, sans validation de personne
- La récupération ouvre une session, elle ne transfère pas la propriété du livre
- Toute récupération est tracée et consultable par le narrateur

### 1.6 Suppression de compte

La règle 2 protège les objets du récit dans l'usage courant, pas le compte entier. Une
suppression de compte demandée explicitement, **différée de 30 jours**, annoncée comme telle
et annulable pendant le délai, respecte à la fois la règle 2 et le droit à l'effacement.

Seul point du dossier à conséquence juridique : il doit vivre dans les documents, pas
seulement dans le code.

### 1.7 Édition manuelle et « Améliorer la lecture »

La règle est maintenue : l'amélioration ne s'applique jamais à un fragment édité à la main.
Deux garde-fous contre le piège pratique :

- « Améliorer la lecture » placé **avant** « Modifier ce passage » dans l'ordre de lecture
- Avertissement à la **première** édition manuelle uniquement : « Après cette modification,
  ce passage sera le vôtre : je n'y toucherai plus. »

### 1.8 Onboarding à la voix

Chaque réponse passe par un court enregistrement et Whisper, pas par l'API de reconnaissance
vocale du navigateur — trop inégale sur iOS pour porter une promesse produit. La latence de
quelques secondes est acceptée ; le gain sur le dictionnaire dès la première minute la
compense.

**Saisie clavier en alternative sur chaque question**, pour l'aidant qui remplit à côté du
narrateur.

### 1.9 Vue « Ce que j'ai raconté »

C'est **l'ordre** qui est immuable, pas le texte. Elle affiche le texte courant
(`editedText ?? readableText ?? rawText`) dans l'ordre d'origine, qui ne bouge jamais.

Un fragment mis de côté y reste visible avec une mention discrète, sans marqueur négatif —
sinon la trace est trouée, et c'est précisément ce que cette vue garantit.

---

## 2. Les cinq réponses du §9

**Découpage en fragments.** Automatique à la transcription, jamais soumis à validation. Seul
le rangement est validé. Fusionner et scinder restent possibles à la main, en permanence,
sans passer par un mode d'édition.

**Reprise après interruption.** Pas de seuil temporel — un seuil arbitraire produit des
comportements incompréhensibles. Si le narrateur accepte « on continue », les segments
rejoignent le **même `Recording`**, quel que soit le délai. S'il refuse, l'enregistrement est
finalisé tel quel et le suivant est distinct. C'est cohérent parce que l'unité de lecture est
le `Fragment`, pas le `Recording`.

**Jalons sans date.** Zone « à situer » en bas de la frise. Aucun marqueur négatif : ni gris,
ni pointillés, ni point d'exclamation, ni compteur. Formulée comme une invitation : « Ces
souvenirs ne sont pas encore placés dans le temps. Vous pouvez les situer quand vous
voulez. » Un narrateur qui ne situe jamais rien doit avoir un livre parfaitement lisible.

**Suggestions.** Deux **sessions distinctes** pour brûler une suggestion, avec 24 h minimum
entre deux affichages de la même. Jamais pendant l'enregistrement, jamais en notification,
une seule visible à la fois.

**Indisponibilité Whisper / Claude.** Attente en V1, pas de second fournisseur. L'état est
affiché en clair **dès la première seconde**, pas au bout d'un délai ; c'est le message qui
change :

- immédiatement — « Votre page est enregistrée. J'écris le texte. »
- au-delà d'une heure — « Votre page est enregistrée et conservée. Le texte arrivera plus
  tard, je vous préviendrai. »

Aucun message ne suggère que quelque chose est perdu ou en danger. L'audio est là, c'est ce
qui compte, et il faut le dire.

---

## 3. Architecture

```
src/
  app/
    (narrateur)/          — l'app du narrateur, 20px, une action par écran
      raconter/           — enregistrement
      mon-histoire/       — vue « Mon livre », rangée
      ce-que-jai-raconte/ — vue trace, ordre immuable
      ma-frise/           — timeline, écran principal pour beaucoup
      avant-de-commencer/ — onboarding, 6 questions
    (aidant)/             — parcours distinct : lecture et technique, zéro écriture narrative
    (achat)/              — pages de vente et Stripe, s'adresse à l'enfant
    api/
      auth/[...all]/      — Better Auth
      transcription/      — file d'attente Whisper
      upload/             — reprise par morceaux vers Vercel Blob
  server/
    actions/              — Server Actions, Zod en entrée, session serveur en sortie
    auth.ts               — Better Auth
    db.ts                 — Prisma singleton
    require-book.ts       — résout session → Book. Point d'entrée unique de tout accès
  domain/
    timeline/resolve.ts   — résolution des dates floues. Pur, testé
    fragments/split.ts    — découpage sur frontières
    improve/prompt.ts     — le prompt contraint du §6 du brief
  local/
    recorder/             — MediaRecorder et segments IndexedDB
    queue/                — file d'upload persistante
```

**Règle d'accès uniforme.** Tout modèle métier porte `bookId`, `Book.userId` est unique, et
une seule fonction `requireBook()` résout la session serveur vers le `Book`. Aucun
identifiant venu du client n'entre dans un `where` sans être re-filtré par `bookId`.

**Trois couches de texte.** Le texte affiché est `editedText ?? readableText ?? rawText`,
partout, y compris à l'impression. `editedAt != null` suffit à faire disparaître « Améliorer
la lecture ».

**Aucun `delete`.** « Mettre de côté » est un `setAsideAt` horodaté. Revue en fin de chaque
phase — voir la règle permanente dans `CLAUDE.md`.

**Audio.** WebM/Opus à l'enregistrement, transcodage Opus 24 kbps mono après transcription.
Seul l'original non compressé est supprimé, jamais l'audio final.

---

## 4. Stack figée

| | |
|---|---|
| Next.js | 16.3.0, App Router, TypeScript strict |
| React | 19.2.8 |
| Tailwind | v4 |
| Prisma | 7.x — generator `prisma-client`, config dans `prisma.config.ts` |
| Base | Neon PostgreSQL, région UE |
| Auth | Better Auth 1.x, lien e-mail, sessions longues |
| PWA | Serwist |
| Transcription | Whisper (OpenAI) |
| Amélioration | Claude API |
| Stockage audio | Vercel Blob UE |
| Observabilité | Sentry + PostHog |

Le brief figeait Next.js 15 ; la version stable la plus récente est retenue, compatibilité
Serwist vérifiée au build.

**Prisma 7 diffère de ce qui a été validé** : le generator est `prisma-client` (plus
`prisma-client-js`), `output` est obligatoire, et l'URL de connexion vit dans
`prisma.config.ts` et non dans le bloc `datasource`. Le schéma validé est repris à
l'identique sur le fond, adapté sur ces trois points.

---

## 5. Phases

Chaque phase se termine par un arrêt et une validation.

| # | Phase |
|---|---|
| 1 | Fondations — schéma, migration, Better Auth, charte, PWA, observabilité, `resolveTimeline` testée |
| 2 | Enregistrement audio |
| 3 | Onboarding et frise |
| 4 | Transcription |
| 5 | Fragments et rangement |
| 6 | Améliorer la lecture |
| 7 | Édition |
| 8 | Aiguillage continu |
| 9 | Famille |
| **10** | **Paiement — Stripe unique, droit d'accès au compte, achat pour un tiers avec code d'activation** |
| 11 | Export et impression |

Le droit d'accès et le décompte d'exemplaires existent en base **dès la phase 1**, même si
l'écran de paiement n'arrive qu'en phase 10.

---

## 6. Périmètre de la phase 1

- `schema.prisma` complet et migration Neon UE
- Better Auth par lien e-mail, sessions longues glissantes
- Tokens de la charte, trois polices auto-hébergées, layout de base
- PWA installable sur écran d'accueil iPad
- Sentry + PostHog
- `resolveTimeline` **écrite et testée avant d'être branchée**, sur : rattachement relatif à
  un jalon lui-même flou, chaînes de rattachements, cycles, jalons sans aucune ancre
- Les corrections documentaires du §7

*Fini quand :* on peut créer un compte, se connecter par lien e-mail, et installer l'app sur
un écran d'accueil iPad.

---

## 7. Corrections documentaires à passer en phase 1

- `00-BRIEF` §6 — ajouter « scinder » aux verbes interdits d'initiative
- `00-BRIEF` §8 — renumérotation des phases (paiement en 10, export/impression en 11)
- `00-BRIEF` §4 règle 6 — préciser « pour le narrateur », et les deux exports
- `brief-fonctionnel` §6 — retirer l'impression du hors-périmètre, reformuler la ligne sur
  les suggestions IA
- `brief-fonctionnel` §4.8 — ajouter la suppression de compte différée à 30 jours
- `impression` §2.4 — renommer « second tome » en « impression en plusieurs tomes »
- `decisions-structure` — noter que la vue « Ce que j'ai raconté » a un ordre immuable, pas
  un texte figé

---

## 8. Ce qui reste ouvert

- **Fournisseur d'envoi d'e-mail** pour les liens de connexion. Non tranché dans les
  documents. En développement, le lien est écrit dans la console ; un fournisseur est
  nécessaire avant toute mise en ligne
- **Partenaire d'impression** — API de dépôt de commande ou dépôt manuel assumé. À ne pas
  construire avant cinquante livres vendus
- **Secrets** : `DATABASE_URL` Neon UE, Vercel Blob, OpenAI, Sentry, PostHog, Stripe
