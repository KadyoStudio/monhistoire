# Mon Histoire — Brief de développement

**À lire en entier avant d'écrire la moindre ligne de code.**

---

## 0. Ce qu'on attend de toi, dans cet ordre

1. Lire ce document et les trois documents de contexte (§1)
2. **Proposer un plan** : architecture, modèle de données, découpage en phases, ordre
   d'attaque, points où tu vois un risque ou une ambiguïté
3. **Poser tes questions** avant de coder. Il y a des décisions produit dans ce projet qui
   ne se rattrapent pas après coup
4. Attendre validation
5. Coder phase par phase, en s'arrêtant à chaque fin de phase

Ne commence pas par générer du code. Le plan d'abord.

---

## 1. Documents de contexte

À lire dans cet ordre :

1. `mon-histoire-brief-fonctionnel.md` — le produit et l'anticipation des défaillances
2. `mon-histoire-decisions-structure.md` — fragments, édition, longueur, chapitres, audio
3. `mon-histoire-onboarding-frise.md` — livre unique, onboarding, frise, aiguillage
4. `charte-graphique.md` — identité visuelle et tokens

En cas de contradiction entre documents, le plus récent l'emporte, et tu le signales.

---

## 2. Le produit en trois phrases

Une personne âgée raconte sa vie à voix haute depuis une tablette. L'app enregistre,
transcrit, nettoie la lisibilité sans dénaturer sa voix, et range les souvenirs dans une
frise chronologique qu'elle a elle-même construite. Le résultat est un livre lisible en
ligne, partageable avec la famille, et imprimable par un partenaire éditeur qui l'expédie à
domicile.

**Utilisateur : 70 à 95 ans, peu à l'aise avec le numérique.** Ce n'est pas une contrainte
d'accessibilité en fin de checklist, c'est le paramètre qui décide de toutes les autres.

**Acheteur : son enfant, 45 à 65 ans.** Le narrateur utilise, l'aidant paie. Les deux
parcours sont distincts.

---

## 3. Stack

- Next.js 15 App Router, TypeScript strict, pas de `any`
- Tailwind v4
- Prisma + Neon PostgreSQL, **région européenne**
- Better Auth — connexion par lien e-mail, pas de mot de passe
- Vercel Blob région UE pour l'audio
- Serwist (`@serwist/next`) pour la PWA
- Whisper (OpenAI) pour la transcription
- Claude API (`@anthropic-ai/sdk`) pour « Améliorer la lecture »
- PostHog + Sentry
- Déploiement Vercel

Environnement local Windows / PowerShell : séparateur `;`, jamais `&&`. Cmdlets PowerShell.

Server Components par défaut. Server Actions pour les mutations, validation Zod en entrée.
Toute requête Prisma filtrée par la session serveur — jamais par un identifiant venu du
client.

---

## 4. Les sept règles qu'on ne discute pas

1. **`rawText` et l'audio original ne sont jamais écrasés ni supprimés.** Trois couches
   distinctes : `rawText` (dit) → `readableText` (nettoyé) → `editedText` (repris à la
   main). Toute opération qui perd `rawText` est un bug, pas un compromis.
2. **Aucune suppression définitive immédiate**, sur aucun objet. « Mettre de côté »,
   restaurable sans limite de temps.
3. **L'aidant aide, il n'écrit pas.** Aucun droit d'écriture sur le contenu narratif.
4. **L'IA nettoie la lisibilité, elle ne réécrit pas.** Voir §6.
5. **Aucun état ambigu affiché.** Un utilisateur qui ne sait pas si son enregistrement est
   conservé est un utilisateur perdu.
6. **L'export intégral est toujours disponible**, sans condition, y compris compte expiré.
7. **Le produit ne juge, ne corrige et ne modère jamais le contenu du récit.** Ni les
   faits, ni les dates, ni les contradictions, ni les répétitions.

---

## 5. Modèle de données

À produire en une seule passe avant la première migration. C'est l'artefact où les quatre
documents se croisent, et le plus coûteux à rattraper.

**Better Auth** — `User`, `Session`, `Account`, `Verification`, générés par
`npx @better-auth/cli generate`. Ne pas éditer à la main, lancer le CLI **avant** d'ajouter
les modèles métier.

**Métier :**

- `Book` — un seul par compte, `userId` en contrainte unique. Titre, sous-titre, couverture.
- `Milestone` — jalon de la frise. Libellé exactement tel que prononcé, année estimée de
  début et de fin, niveau de précision (exacte / approximative / relative / inconnue),
  rattachement relatif optionnel à un autre jalon.
- `Person` — nom cité par le narrateur, rôle libre. Alimente le dictionnaire de
  transcription.
- `Place` — lieu, rattachable à une période.
- `Chapter` — nommé par le narrateur avec ses mots. Jamais pré-créé. Rattachable à une
  période. Ordre.
- `Recording` — un enregistrement. URL Blob, durée, date, état d'upload, état de
  transcription.
- `Fragment` — l'unité du récit. Rattaché à un `Recording` avec sa position d'origine
  dedans, et optionnellement à un `Chapter` avec un ordre. Porte `rawText`,
  `readableText`, `editedText`, un indicateur privé, un indicateur mis de côté.
- `Suggestion` — sujet proposé, avec état : proposé / retenu / ignoré / refusé
  définitivement, et un compteur. Indispensable pour tenir la règle « ignorée deux fois,
  plus jamais ».
- `Invitation` — accès famille en lecture seule. Nominative, à usage unique, révocable.
- `PrintOrder` — commande d'impression. Voir `impression-et-marche-france.md`.

**Points d'attention :**

- Un `Fragment` garde toujours le lien vers son `Recording` et sa position dedans. C'est ce
  qui permet la vue « Ce que j'ai raconté ».
- Un `Milestone` ne stocke pas une date mais une **période approximative**. Prévoir une
  fonction de résolution qui ordonne la frise à partir de dates floues et de rattachements
  relatifs (« deux ans après mon mariage », le mariage étant lui-même « vers 1955 »).
  Écris-la tôt et teste-la sur des cas tordus.
- Le narrateur peut désigner un **bénéficiaire** (transmission après décès). Champ prévu
  dès l'inscription.

---

## 6. Le prompt « Améliorer la lecture »

Le bouton s'appelle **« Améliorer la lecture »**. Jamais « Embellir », jamais « Corriger »,
jamais « Réécrire ». Il est sur chaque fragment en vue lecture, à côté de
« Modifier ce passage ».

**Autorisé :** réparer la ponctuation et les coupures de phrases orales, retirer les
hésitations de diction (« euh », mot bégayé, répétition accidentelle), découper en
paragraphes, corriger l'orthographe des mots manifestement mal transcrits.

**Interdit :** reformuler une phrase déjà compréhensible, enrichir le vocabulaire, ajouter
transitions ou détails, uniformiser le registre, lisser un régionalisme ou une tournure
ancienne, modifier un fait, une date ou un nom, déplacer ou fusionner un passage de sa
propre initiative.

Le rangement d'un fragment est **toujours une proposition validée par le narrateur**, jamais
une action automatique, même à confiance élevée.

Une hésitation de contenu se conserve : « ma sœur Marie, enfin non, Marthe » reste tel quel,
parce que c'est ainsi que la personne pense. Seule l'hésitation de diction se retire.

**L'amélioration ne s'applique jamais à un fragment déjà édité à la main.** Une fois que le
narrateur a touché un passage, il est le sien définitivement, et le bouton disparaît dessus.
Sans cette règle, la main de l'utilisateur et celle de l'IA se repassent dessus jusqu'à ce
que plus personne ne sache d'où vient quoi — et c'est toujours l'IA qui gagne.

Retour à la version originale possible en un geste, depuis le fragment.

---

## 7. Contraintes d'interface

- Police de base 20px minimum. Réglage de taille accessible en permanence, pas enfoui.
- Cibles tactiles 56px minimum.
- Contraste AAA visé, AA absolu.
- Une action principale par écran. Pas de hamburger, pas de navigation imbriquée.
- Boutons libellés en toutes lettres avec un verbe. Pas d'icône seule.
- Aucun chargement muet : un texte explicite (« J'enregistre votre page… »), jamais un
  spinner seul.
- Erreurs en langage courant, avec une sortie claire. Elles ne s'excusent pas et ne sont
  jamais vagues.
- Tout doit être faisable à la voix, y compris pendant l'onboarding. Taper est difficile à
  85 ans.
- Écran vide = invitation à agir, jamais une page blanche.

Design : pas de dégradé, pas d'emoji dans l'UI, pas d'Inter, pas de couleur flashy, pas
d'esthétique « générée par IA ». Icônes Lucide uniquement. Lighthouse 90+ sur les quatre
axes.

---

## 8. Phases

Chaque phase se termine par un arrêt et une validation.

**Phase 1 — Fondations**
Schéma Prisma complet, migration, Better Auth par lien e-mail, layout, tokens de la charte,
polices, PWA installable, Sentry + PostHog.
*Fini quand :* on peut créer un compte, se connecter par lien e-mail, et installer l'app sur
un écran d'accueil iPad.

**Phase 2 — Enregistrement audio**
La pièce la plus risquée, donc traitée avant tout le reste. Écriture continue en local par
segments courts pendant l'enregistrement, jamais un blob unique gardé en mémoire. Reprise
après verrouillage d'écran, appel entrant, fermeture de l'app, redémarrage de l'appareil.
File d'upload persistante et reprise par morceaux. Contrôle du niveau sonore en temps réel
avec alerte immédiate si le micro ne capte rien. Arrêt automatique après une durée longue,
avec avertissement. Détection de permission micro refusée avec écran d'explication.
*Fini quand :* on peut enregistrer 20 minutes, verrouiller l'écran, recevoir un appel, tuer
l'app, redémarrer la tablette — et tout retrouver.

**Phase 3 — Onboarding et frise**
Six questions d'ancrage, réponses à la voix, aucune obligatoire, jamais bloquant
(« Je préfère commencer à raconter tout de suite » visible sur chaque écran). Dates floues,
aucun sélecteur de date. Génération des chapitres avec les mots du narrateur.
*Fini quand :* un narrateur sort de l'onboarding avec une frise et des chapitres nommés par
lui, ou le saute entièrement sans pénalité.

**Phase 4 — Transcription**
Whisper, dictionnaire personnel alimenté par les corrections et par les `Person` / `Place`.
Détection du silence avant envoi. Transcription présentée comme une première version, jamais
comme un résultat. Audio réécoutable en un geste depuis chaque fragment.

**Phase 5 — Fragments et rangement**
Découpage en fragments sur les frontières, jamais sur les mots. Les deux vues :
« Ce que j'ai raconté » (immuable) et « Mon livre » (rangé). Propositions de rangement
validées une par une.

**Phase 6 — Améliorer la lecture**
Voir §6. Comparaison avant/après, retour à l'original.

**Phase 7 — Édition**
Édition en place, à la voix ou au clavier, sauvegarde automatique. « Mettre de côté » et
restauration. Ajout d'un passage à la voix au milieu d'un fragment existant.

**Phase 8 — Aiguillage continu**
Suggestions ancrées sur la frise, une à la fois, ignorée deux fois = plus jamais. Aucune
notification culpabilisante.

**Phase 9 — Famille**
Invitations nominatives en lecture seule, révocables. Marquage privé d'un fragment.

**Phase 10 — Export et impression**
PDF de lecture, archive intégrale texte + audio, et PDF prêt pour l'imprimeur.
Voir `impression-et-marche-france.md`.

---

## 9. Ce que tu dois me demander avant de coder

Au minimum, tes questions sur :

- Le découpage en fragments — automatique à la transcription, ou déclenché par le narrateur
- La stratégie exacte de persistance locale de l'audio et sa reprise après crash
- La résolution des dates floues et l'ordonnancement de la frise
- Le déclenchement des suggestions : à quel moment, sur quel signal
- Ce qui se passe si Whisper ou Claude est indisponible — le produit doit rester utilisable

Si tu vois une contradiction entre les documents, ou une règle qui te paraît coûteuse à
tenir, dis-le maintenant plutôt que de l'arbitrer silencieusement.
