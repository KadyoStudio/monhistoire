# Validation du plan

Plan validé dans ses grandes lignes. Le schéma est retenu, avec les corrections ci-dessous.
Réponses dans ton ordre de priorité.

---

## §4.1 — PWA et arrière-plan : options 1 + 2, pas de natif

Tu as raison sur la limite, et la séparation des deux exigences est la bonne lecture. On
retient **Wake Lock + coupure assumée et clairement dite**. Pas d'application native : elle
réglerait le problème mais ferait sauter l'installation par lien, qui est ce qui permet à
l'aidant d'installer le compte à distance.

Une précision que ton analyse ne contient pas et qui change l'implémentation : le Screen
Wake Lock fonctionne dans Safari iOS depuis la 16.4, **mais il était cassé dans les PWA
installées jusqu'à iOS/iPadOS 18.4** (mars 2025). Sur notre public, l'iPad d'occasion
transmis par un petit-enfant est un cas fréquent, donc les versions antérieures sont un cas
réel, pas théorique.

À implémenter :

- `navigator.wakeLock.request('screen')` dans un `try/catch`, réacquis sur
  `visibilitychange` (le lock se libère seul quand l'app perd le focus)
- **Si l'acquisition échoue** : consigne affichée une seule fois, avant le premier
  enregistrement, en langage courant — « Sur cette tablette, désactivez le verrouillage
  automatique de l'écran avant de commencer. Je vous montre comment. » Avec la marche à
  suivre iPad, et un bouton pour l'envoyer par e-mail à l'aidant.
- Au retour après une coupure, message conforme à ta formulation de l'option 2. Le mot
  « conservé » doit apparaître dans la première phrase.
- Jamais de message qui ressemble à une erreur ou à un reproche. La coupure est un fait,
  pas un incident.

L'écran d'enregistrement doit rester lisible à distance : le narrateur pose la tablette sur
la table et parle. Niveau sonore visible en gros, filet de marge rouge actif, et un seul
bouton d'arrêt.

---

## §4.3 — Export : ta résolution est retenue

Deux exports distincts, jamais présentés au même endroit. C'est exactement ça.

- **« Mon archive »** — pour le narrateur seul. Tout, y compris les fragments privés, y
  compris l'audio. C'est la portabilité RGPD et c'est le sens de la règle 6.
- **« Le livre »** — à partager et à imprimer. Exclut les fragments privés, sans option.

La règle 6 du brief est à relire comme : *l'export intégral est toujours disponible pour le
narrateur, sans condition*. Elle n'a jamais visé le partage. Corrige la formulation dans les
documents.

Un fragment privé ne doit jamais apparaître dans un aperçu de bon à tirer, ni dans un
compteur de pages visible par un tiers.

---

## §4.2 — L'impression est dans le périmètre V1

Tu as raison, et c'est une erreur de ma part dans le brief fonctionnel. Le §6
« Hors périmètre V1 » est caduc sur deux lignes :

- « Impression et livraison d'un livre physique » — **supprimer**. C'est la raison d'achat
  et le seul indicateur qui compte.
- « Suggestions de sujets générées par IA » — **reformuler** : ce qui est hors périmètre,
  c'est une IA qui invente des sujets à partir du récit. Les suggestions ancrées sur la
  frise (déterministes) et la banque de questions d'amorçage (écrite à la main) restent
  dans le périmètre.

Restent hors périmètre : correction ou vérification factuelle, collaboration temps réel,
application native, multilingue.

---

## §4.4 — Tomes : ta proposition est retenue

`volumeIndex` sur `PrintOrder`, `Book` reste unique par compte. Un tome est une coupe à
l'impression, pas un second récit.

L'option commerciale est renommée **« impression en plusieurs tomes »**. Le « second tome »
disparaît du vocabulaire, il induisait en erreur.

---

## §4.5 — Perte d'accès à l'e-mail : validé, avec un garde-fou

Tes trois mesures sont retenues : sessions longues glissantes, e-mail de l'aidant en voie de
secours, aucune déconnexion automatique.

Mais la voie de secours par l'aidant crée une tension avec la règle 3 (« l'aidant aide, il
n'écrit pas ») : celui qui peut récupérer l'accès peut, de fait, entrer dans le compte.

À encadrer :

- La récupération par l'aidant **notifie le narrateur** sur sa tablette, visiblement et
  durablement — pas un bandeau qui disparaît
- Le narrateur peut changer d'aidant à tout moment, seul, sans validation de personne
- La récupération ouvre une session, elle ne transfère pas la propriété du livre
- Toute récupération est tracée et consultable par le narrateur

En pratique, le vrai mécanisme d'accès est la session d'un an sur la tablette — tu as raison
là-dessus. Le lien e-mail n'est que la porte d'entrée initiale.

---

## §4.6 — Suppression de compte : ta lecture est retenue

La règle 2 protège les objets du récit dans l'usage courant, pas le compte entier. Une
suppression de compte demandée explicitement, différée de 30 jours, annoncée comme telle et
annulable pendant le délai, respecte les deux.

C'est le seul point à conséquence juridique du dossier : écris-le dans les documents, pas
seulement dans le code.

---

## §4.7 — Les deux règles coûteuses

**Édition manuelle et « Améliorer la lecture ».** Tes deux garde-fous sont retenus. Ordre de
lecture avec « Améliorer la lecture » avant « Modifier ce passage », et avertissement à la
première édition manuelle uniquement. Ta formulation est bonne, garde-la telle quelle.

**Onboarding à la voix.** Ta proposition est retenue : chaque réponse passe par un court
enregistrement et Whisper, pas par l'API de reconnaissance vocale du navigateur. Elle est
trop inégale sur iOS pour porter une promesse produit. La latence de quelques secondes est
acceptable ; le gain sur le dictionnaire dès la première minute la compense.

Prévoir la saisie clavier en alternative sur chaque question, pour l'aidant qui remplit à
côté du narrateur.

---

## §4.8 — Les deux détails

**Next.js.** Pars sur la version stable la plus récente. Vérifie juste la compatibilité
Serwist avant de figer, c'est la dépendance la plus susceptible de traîner.

**Vue « Ce que j'ai raconté ».** Ta lecture est la bonne : c'est **l'ordre** qui est
immuable, pas le texte. Elle affiche le texte courant
(`editedText ?? readableText ?? rawText`), dans l'ordre d'origine, qui ne bouge jamais.

Un fragment mis de côté y reste visible avec une mention discrète, sans marqueur négatif —
sinon la trace est trouée, et c'est précisément ce que cette vue doit garantir.

---

## §3 — Réponses aux cinq questions

**1. Découpage.** Automatique à la transcription, jamais soumis à validation. Seul le
rangement est validé. Ta lecture est la bonne : une validation de découpage ajouterait un
écran de friction au tout premier usage, au pire moment.

Fusionner et scinder restent possibles à la main, en permanence, sans passer par un mode
d'édition.

**2. Reprise après interruption.** Pas de seuil temporel — un seuil arbitraire produira des
comportements incompréhensibles pour l'utilisateur.

La règle : si le narrateur accepte « on continue », les segments rejoignent le **même
`Recording`**, quel que soit le délai. S'il refuse, l'enregistrement est finalisé tel quel et
le suivant sera distinct.

C'est cohérent parce que le `Recording` n'est pas l'unité de lecture — le `Fragment` l'est.
Un `Recording` long découpé en fragments ne pose aucun problème d'affichage. Et ça évite
d'avoir à expliquer une règle de fusion à quelqu'un qui veut juste reprendre son récit.

**3. Jalons sans date.** Zone « à situer » en bas de la frise, retenue. Deux exigences :

- Aucun marqueur négatif : ni gris, ni pointillés, ni point d'exclamation, ni compteur
- Formulée comme une invitation, pas comme une tâche : « Ces souvenirs ne sont pas encore
  placés dans le temps. Vous pouvez les situer quand vous voulez. »

Un narrateur qui ne situe jamais rien doit avoir un livre parfaitement lisible.

**4. Suggestions.** Deux **sessions distinctes**, avec 24 h minimum entre deux affichages de
la même suggestion. Ta remarque est juste : brûler une suggestion parce que l'utilisateur
est passé trois fois sur l'accueil dans la même séance serait un bug de conception.

Tes règles de déclenchement sont retenues telles quelles — jamais pendant l'enregistrement,
jamais en notification, une seule visible à la fois.

**5. Indisponibilité Whisper / Claude.** Attente en V1, pas de second fournisseur. Ton
argument sur la calibration du dictionnaire est le bon.

Sur le délai : l'état est affiché en clair **dès la première seconde**, toujours, pas au
bout d'un délai. Ce qui change avec le temps, c'est le message :

- immédiatement — « Votre page est enregistrée. J'écris le texte. »
- au-delà d'une heure — « Votre page est enregistrée et conservée. Le texte arrivera plus
  tard, je vous préviendrai. »

Aucun message ne doit suggérer que quelque chose est perdu ou en danger. L'audio est là,
c'est ce qui compte, et il faut le dire.

---

## Corrections au schéma

Trois points avant migration.

**1. `Fragment.rawText` ne peut pas être requis.** Avec `rawText String @db.Text` non-null,
aucun fragment ne peut exister avant transcription — or tu promets en Q5 qu'un fragment
existe avec un état affiché.

Résolution : c'est le **`Recording`** qui s'affiche en attente, pas un fragment vide.
`rawText` reste non-null, et l'UI de la vue « Ce que j'ai raconté » liste les `Recording`,
en affichant leurs fragments quand ils existent et l'état de transcription sinon. Garde le
schéma tel quel, mais que ce soit explicite dans le code de la vue.

**2. `BigInt` sur `uploadedBytes` / `totalBytes`.** Ils ne se sérialisent pas dans les
payloads des Server Components. Passe en `Int` (2 Go suffisent largement pour un
enregistrement audio) ou prévois la conversion, mais ne le découvre pas en phase 2.

**3. Un caractère parasite** dans le schéma : `// Lien永 vers l'origine` sur `Fragment`.

Le reste du schéma est validé, y compris les six modèles ajoutés. `Photo`,
`DictionaryEntry`, `Consent` et `PrintRecipient` étaient des manques réels de ma part.

---

## Corrections documentaires

Regroupe-les toutes en une passe, en phase 1 :

- `00-BRIEF` §6 — ajouter « scinder » aux verbes interdits d'initiative
- `00-BRIEF` §8 — nouvelle numérotation des phases (paiement en 10, export/impression en 11)
- `00-BRIEF` §4 règle 6 — préciser « pour le narrateur », et les deux exports
- `brief-fonctionnel` §6 — supprimer l'impression du hors-périmètre, reformuler la ligne
  sur les suggestions IA
- `brief-fonctionnel` §4.8 — ajouter la suppression de compte différée à 30 jours
- `impression` §2.4 — renommer « second tome » en « impression en plusieurs tomes »
- `decisions-structure` — noter que la vue « Ce que j'ai raconté » a un ordre immuable, pas
  un texte figé

---

## Ensuite

Oui, consigne le plan arrêté dans `docs/01-PLAN-VALIDE.md`, avec ces réponses intégrées.

Puis phase 1 telle que tu l'as décrite. Deux exigences dessus :

- La fonction de résolution de frise est écrite et **testée avant d'être branchée**, sur les
  cas tordus : rattachement relatif à un jalon lui-même flou, chaînes de rattachements,
  cycles, jalons sans aucune ancre.
- La revue `delete` en fin de phase : bonne idée, garde-la. Ajoute-la comme règle
  permanente dans `CLAUDE.md`.

Arrêt et validation en fin de phase 1 avant d'attaquer l'audio.
