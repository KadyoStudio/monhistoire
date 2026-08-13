# Mon Histoire — Décisions de structure, d'édition et de stockage

Complément au brief fonctionnel. Ce document **amende** la règle §4.4 du brief
(« ne jamais réorganiser l'ordre du récit ») et la précise. Voir §1 ci-dessous.

---

## 1. Les allers-retours dans le temps

### Le comportement réel

Personne ne raconte sa vie dans l'ordre. Le narrateur commence son service militaire,
s'interrompt pour expliquer qui était le camarade dont il vient de citer le nom, revient
sur son enfance pour dire d'où venait ce camarade, puis reprend. Une page enregistrée
contient couramment trois époques.

C'est la forme naturelle du récit oral. Ce n'est pas un défaut à corriger.

### Le principe d'arbitrage

Le brief interdisait de réorganiser le récit. Cette interdiction était trop large. La
bonne frontière est ailleurs :

> **Le texte d'un souvenir est intouchable. La place de ce souvenir dans le livre
> appartient au narrateur.**

L'IA n'a pas le droit de modifier une phrase, de fusionner deux passages, de réécrire une
transition. Elle a le droit de **proposer** qu'un passage soit rangé ailleurs — et
uniquement de le proposer.

### Le mécanisme

Le découpage se fait à un niveau que le brief n'avait pas nommé : le **fragment**.

- Un enregistrement produit une transcription
- La transcription est découpée en fragments — un fragment = un sujet cohérent
- Chaque fragment reçoit une proposition de rattachement (chapitre, époque approximative)
- Le narrateur valide, corrige, ou ignore

Le découpage en fragments est une opération **sur les frontières, pas sur les mots**. Le
texte de chaque fragment est exactement celui de la transcription, au caractère près.
Aucune phrase n'est coupée en deux, aucune transition n'est ajoutée pour recoller.

### L'interface

Deux vues sur le même contenu, et c'est ce double accès qui fait tout le produit :

**Vue « Ce que j'ai raconté »** — chronologie des séances, dans l'ordre où le narrateur a
parlé. Rien n'est déplacé, rien n'est masqué. C'est sa trace brute, elle ne bouge jamais.

**Vue « Mon livre »** — les fragments rangés par chapitre. C'est la vue qui sert à la
lecture et à l'export.

Un fragment déplacé dans « Mon livre » reste à sa place d'origine dans « Ce que j'ai
raconté ». Le narrateur ne perd jamais le fil de ce qu'il a effectivement dit un jour
donné.

### Les propositions de rangement

Formulées en langage courant, jamais en jargon : « Ce passage parle de votre service
militaire. Le ranger avec le reste ? » — avec « Oui » et « Non, laisser ici ».

Contraintes :

- Aucun déplacement automatique, jamais, même avec un niveau de confiance élevé
- Les propositions ignorées ne reviennent pas
- Un narrateur qui ne range jamais rien doit avoir un livre parfaitement lisible : l'ordre
  chronologique des séances est un ordre valide par défaut
- Aucune détection de doublon, aucune suggestion de fusion (règle du brief §4.5 maintenue)

### Conséquence sur CLAUDE.md

Remplacer dans la liste des interdictions du prompt d'amélioration :

- ~~« réorganiser l'ordre du récit »~~
- → « déplacer, fusionner ou scinder un passage de sa propre initiative — le rangement est
  toujours une proposition validée par le narrateur »

---

## 2. Modifier, supprimer, ajouter du texte

### Édition directe

Le texte est éditable là où il est lu, sans écran séparé ni mode dédié. On appuie sur le
texte, on écrit. Sauvegarde automatique, jamais de bouton « Enregistrer » à ne pas oublier.

Le clavier n'est pas le seul moyen d'ajouter du texte : à 88 ans, taper est souvent plus
difficile que parler. **Ajouter un passage doit être possible à la voix**, y compris au
milieu d'un fragment existant.

### Suppression

Aucune suppression immédiate et définitive (règle du brief maintenue). Un fragment supprimé
part dans « Pages mises de côté », consultable et restaurable, sans date d'expiration.

Le mot « supprimer » est évité dans l'interface. « Mettre de côté » dit la même chose sans
la brutalité, et correspond à la réalité technique.

### L'état bancal que le brief ne traitait pas

Que se passe-t-il si le narrateur modifie son texte à la main, puis relance
« Améliorer la lecture » ?

Décision : **l'amélioration ne s'applique jamais à du texte édité manuellement.** Une fois
que le narrateur a touché un fragment, ce fragment est le sien, définitivement. Le bouton
disparaît sur ce fragment.

Raison : la règle inverse produit une boucle où la main de l'utilisateur et celle de l'IA
se repassent dessus jusqu'à ce que plus personne ne sache d'où vient quoi. Et c'est
toujours l'IA qui gagne à la fin.

Les trois couches restent distinctes et jamais écrasées :
`rawText` (dit) → `readableText` (nettoyé) → `editedText` (repris à la main).

---

## 3. Combien de mots par page

### La question est mal posée

Découper par nombre de mots, c'est laisser une contrainte d'impression décider du modèle de
capture. Un souvenir fait la longueur qu'il fait. Certains tiennent en quatre phrases,
d'autres courent sur mille mots.

Un basculement automatique « page suivante » à 300 mots interromprait un narrateur en
plein récit — c'est exactement l'inverse de ce qu'on veut.

### La décision

**L'unité de capture est le souvenir, pas la page.** La pagination n'existe qu'à
l'impression et à l'export, où elle est calculée à partir de la mise en page réelle.

Ce que voit le narrateur : des souvenirs, des chapitres, un livre. Jamais un compteur de
mots, jamais un quota, jamais une barre de progression vers une page pleine.

Repères internes, non affichés :

- Fragment court : moins de 80 mots — candidat au regroupement, jamais automatiquement
- Fragment confortable : 150 à 400 mots
- Fragment long : plus de 800 mots — candidat à une proposition de découpage, jamais imposée

Le mot « page » peut rester dans le vocabulaire de l'interface s'il parle mieux aux
utilisateurs que « souvenir » — à tester. Mais il ne doit correspondre à aucune contrainte
technique.

---

## 4. Plusieurs livres

Techniquement oui, le schéma le prévoit. Produit : **un seul livre par défaut, et on n'en
parle pas.**

À la création du compte, un livre existe, sans que le narrateur ait à le nommer ni à le
créer. Aucun écran de sélection, aucune liste. L'app s'ouvre directement dedans.

La création d'un second livre est possible mais rangée, accessible depuis les réglages. Les
cas réels existent — « Mes années au Maroc », « Pour Léa, quand elle sera grande », un
livre de recettes de famille — mais ils viennent après, et rarement.

Dès qu'il y a deux livres ou plus, un écran de choix apparaît à l'ouverture. Avant, jamais :
faire choisir entre une seule option est une friction pure.

---

## 5. Les chapitres de la vie

### Pourquoi le squelette « vie classique » est un piège

Le réflexe naturel est de pré-remplir : enfance, école, service militaire, rencontre,
mariage, enfants, carrière, retraite. C'est efficace et c'est ce que font les concurrents.

Le problème est qu'un chapitre vide n'est pas neutre. Il pose une question. « Mariage »
resté vide demande à quelqu'un pourquoi il ne s'est jamais marié. « Enfants » resté vide
peut tomber sur une personne qui en a perdu un, ou n'a pas pu en avoir. « Carrière » ne veut
rien dire pour une femme née en 1935 qui a tenu une maison pendant cinquante ans.

Le produit s'adresse à des gens en fin de vie. Leur présenter un formulaire de vie normale
qu'ils n'ont pas remplie est une manière discrète de leur dire qu'ils s'y sont mal pris.

### La décision

**Aucun chapitre pré-créé. Les chapitres émergent de ce qui a été raconté.**

Au démarrage, le livre n'a pas de chapitres. Le narrateur enregistre. Les fragments
s'accumulent dans « Ce que j'ai raconté ». Quand un thème revient — trois ou quatre
fragments sur la même époque — l'app propose : « Vous avez raconté plusieurs souvenirs de
votre enfance. En faire un chapitre ? »

Le narrateur nomme lui-même. Le nom proposé vient de ses propres mots, pas d'une
nomenclature. S'il a dit « quand j'étais à la ferme », le chapitre s'appelle « À la ferme »,
pas « Enfance ».

### L'amorçage

Le vrai problème n'est pas l'absence de chapitres, c'est l'absence de première phrase.
Face à un micro et à « racontez votre vie », personne ne sait par où commencer.

La réponse n'est pas une structure, c'est une **question**. Une seule, à la fois, ouverte,
concrète, sensorielle : « Quelle est la première maison dont vous vous souvenez ? » —
« Qu'est-ce qu'on mangeait le dimanche chez vous ? » — « Qui vous faisait rire, quand vous
étiez jeune ? »

Une banque de questions, présentées une par une, sautables sans justification, jamais
comme une liste à compléter. Le narrateur peut aussi ignorer la question et parler d'autre
chose : c'est même le comportement souhaitable.

Les chapitres se construisent ensuite, à partir de ce qui est sorti.

---

## 6. Faut-il conserver l'audio

### Sur le fond, je ne suis pas d'accord avec « ce qui importe est surtout le texte »

Dans dix ans, quand le narrateur ne sera plus là, ses enfants reliront le texte une fois.
La voix, ils l'écouteront. C'est le seul élément du produit qui ne peut plus jamais être
recréé.

Le texte est le livrable. L'audio est ce qui a de la valeur.

Le rire au milieu d'une phrase, l'hésitation avant de parler d'un frère, l'accent que la
génération d'après n'a plus — rien de tout ça ne survit à la transcription. Une famille qui
découvre après coup que les enregistrements ont été effacés ne le pardonnera pas, et elle
aura raison.

**Décision : on conserve l'audio, sans limite de durée.**

### Le poids n'est pas un problème

Opus mono, 24 kbps, largement suffisant pour de la voix parlée :

- environ 11 Mo par heure d'enregistrement
- une vie racontée en profondeur : 20 à 40 heures, soit 220 à 440 Mo
- mille utilisateurs à 30 heures chacun : environ 330 Go

C'est négligeable et parfaitement modélisable dans le prix. L'argument du poids ne tient
pas. Conserver le WAV brut, en revanche, serait absurde : transcodage en Opus après
transcription, suppression de l'original.

### Le cadre légal

Utilisateurs français, données personnelles, RGPD applicable — indépendamment du lieu
d'hébergement et de ta situation fiscale personnelle.

Ce qui est requis :

- **Base légale** : consentement explicite, recueilli en langage clair, à l'inscription.
  Pas une case noyée dans des CGU de douze pages.
- **Finalité** : transcription et conservation du récit. Toute autre utilisation — et en
  particulier l'entraînement de quelque modèle que ce soit — est exclue et doit être écrite
  noir sur blanc.
- **Durée de conservation** : définie et annoncée. « Conservation illimitée » est un choix
  produit valide s'il est explicite et si la suppression reste possible à tout moment.
- **Droit à l'effacement et portabilité** : couverts par l'export intégral et la
  suppression de compte. Déjà prévus au brief §4.8.
- **Hébergement en région européenne** : Neon et Vercel Blob proposent tous deux des
  régions UE. À fixer avant la première migration, pas après.
- **Sous-traitants** : OpenAI (transcription) et Anthropic (amélioration) sont des
  sous-traitants au sens du RGPD. À mentionner nommément dans la politique de
  confidentialité, avec leurs garanties de transfert hors UE.

Une précision utile : un enregistrement vocal est une donnée personnelle ordinaire. Il ne
devient une **donnée biométrique** au sens de l'article 9 — donc soumis au régime renforcé —
que s'il est traité aux fins d'identifier une personne de manière unique. Ce n'est pas le
cas ici et ce ne doit jamais le devenir. Toute fonctionnalité de reconnaissance ou de
clonage vocal ferait basculer le produit dans un autre régime juridique.

### Le point que personne n'anticipe

Les récits parlent de tiers. Un narrateur va nommer ses enfants, raconter ses voisins,
évoquer des personnes vivantes qui n'ont jamais consenti à rien et qui, parfois, préfèrent
que certaines choses ne soient pas écrites.

Ce risque est réel mais il n'appelle pas de solution technique, et surtout pas de
modération. Il se traite par :

- le partage strictement contrôlé par le narrateur (déjà au brief §4.7)
- le marquage privé d'un souvenir (déjà au brief §4.6)
- des conditions d'utilisation qui posent que le narrateur est responsable de ce qu'il
  raconte et de qui il laisse lire

Le produit n'arbitre pas les histoires de famille.

---

## 7. Récapitulatif des décisions

| Question | Décision |
|---|---|
| Allers-retours dans le temps | Découpage en fragments, rangement **proposé** et validé par le narrateur, jamais automatique |
| Deux vues | « Ce que j'ai raconté » (immuable) et « Mon livre » (rangé) |
| Édition | Directe, en place, à la voix ou au clavier, sauvegarde automatique |
| Suppression | « Mettre de côté », restaurable sans limite |
| Édition + amélioration IA | L'amélioration ne s'applique plus à un fragment édité à la main |
| Longueur de page | Aucune. L'unité est le souvenir ; la pagination n'existe qu'à l'export |
| Plusieurs livres | Un seul par défaut, second livre possible mais rangé dans les réglages |
| Chapitres | Aucun pré-créé. Ils émergent et sont nommés par le narrateur, avec ses mots |
| Amorçage | Questions ouvertes une par une, jamais une structure à remplir |
| Audio | Conservé sans limite. Opus 24 kbps mono. ~11 Mo/heure |
| Cadre légal | RGPD, consentement explicite, hébergement UE, sous-traitants nommés, aucun usage biométrique |
