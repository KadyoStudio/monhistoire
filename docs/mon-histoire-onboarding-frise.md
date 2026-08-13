# Mon Histoire — Onboarding, frise de vie et aiguillage

Complément au brief fonctionnel et au document de décisions de structure.
**Amende** le §4 (plusieurs livres) et le §5 (chapitres émergents) du document de
décisions de structure.

---

## 1. Un livre par compte

Un compte = un narrateur = un livre. Décision définitive.

Conséquences directes :

- Aucun écran de sélection de livre, jamais, à aucun moment
- L'application ouvre directement dans le livre
- Le mot « livre » peut disparaître de l'interface courante : c'est simplement
  « mon histoire »
- Une personne qui voudrait un second ouvrage crée un second compte

En base : conserver `Book` comme table distincte avec `userId` en contrainte unique.
Fondre les champs dans `User` économiserait peu et coûterait une refonte si la décision
change.

Un couple qui veut deux livres prend deux comptes. C'est cohérent : deux récits, deux voix,
deux propriétaires, deux ayants droit.

---

## 2. Pourquoi un aiguillage avant de dicter

Le document précédent recommandait de ne rien pré-structurer et de laisser les chapitres
émerger. C'était juste sur le principe et faux en pratique : devant un micro et une consigne
aussi vaste que « racontez votre vie », la plupart des gens ne commencent pas. La page
blanche ne libère pas, elle paralyse.

L'aiguillage est donc adopté. Mais avec une distinction qui reste centrale :

> **On ne présente pas une vie type à remplir. On pose des questions dont les réponses
> construisent sa vie à lui.**

La différence est invisible en base de données et décisive à l'usage. Dans un cas, le
narrateur constate ce qui manque à sa vie par rapport au modèle. Dans l'autre, il découvre
la carte de ce qu'il a vécu.

---

## 3. « Avant de commencer » — la construction de la frise

### Cadre

- Durée cible : cinq à dix minutes
- Interruptible à tout instant, repris exactement là où il s'est arrêté
- Réalisable en plusieurs fois, sur plusieurs jours, sans aucune pénalité
- Souvent fait avec l'aidant à côté — l'écran doit être lisible à deux
- **Jamais bloquant** : « Je préfère commencer à raconter tout de suite » est visible en
  permanence et donne accès à l'enregistrement immédiatement

Aucun champ obligatoire. Aucune question à laquelle on ne peut pas répondre « je ne sais
plus » ou « on verra plus tard ». Aucune barre de progression : elle transformerait
l'exercice en formulaire à terminer.

**Toutes les réponses peuvent être données à la voix.** Taper est difficile à 85 ans ;
l'onboarding d'une app de dictée ne peut pas commencer par un clavier.

### Les questions d'ancrage

Posées une par une, écran par écran, dans cet ordre. Chacune est sautable.

1. **L'année et le lieu de naissance.** Le seul point fixe de la frise. « Où êtes-vous né,
   et en quelle année ? »
2. **Les lieux.** « Dans quels endroits avez-vous vécu ? » Réponse libre, énumérée à la
   voix. Chaque lieu devient un jalon à situer approximativement.
3. **Les gens.** « Qui sont les personnes les plus importantes de votre vie ? » Parents,
   fratrie, conjoint, enfants, amis — sans catégorie imposée, sans champ « conjoint » vide
   à contempler. Ces noms alimentent aussi le dictionnaire personnel de transcription.
4. **Les tournants.** « Y a-t-il des moments qui ont changé le cours de votre vie ? »
   Question ouverte, sans exemples normatifs. Ce que le narrateur cite définit ses
   chapitres.
5. **Le travail, les occupations.** Formulée largement : « Qu'est-ce qui a occupé vos
   journées, au fil des années ? » — englobe une carrière, une ferme, une maison, des
   enfants élevés.
6. **Ce qu'il veut transmettre.** « Pour qui écrivez-vous ce livre ? » Détermine le ton et
   sert de rappel de motivation les jours sans élan.

Six questions maximum. Au-delà, c'est un questionnaire administratif.

### Le traitement des dates

Point critique, et principale cause d'abandon si mal traité.

**Aucun sélecteur de date. Jamais.**

Formes de réponse acceptées, toutes également valides :

- une année précise — « 1958 »
- une année approximative — « vers 1960 », « au début des années soixante »
- un âge — « j'avais une vingtaine d'années »
- un repère historique — « juste après la guerre », « pendant Mai 68 »
- un repère personnel relatif — « deux ans après mon mariage », « quand les enfants
  étaient petits »
- rien du tout — « je ne sais plus »

En base, un jalon ne stocke pas une date mais une **période approximative** : le libellé
exact prononcé par le narrateur, une année de début et de fin estimées, un niveau de
précision, et éventuellement un rattachement relatif à un autre jalon. Le libellé prononcé
est ce qui s'affiche ; les années estimées ne servent qu'au classement.

Un jalon sans date se range par validation du narrateur, jamais par déduction affichée
comme certaine.

### Ce que produit l'onboarding

À la sortie : une frise, quelques jalons datés approximativement, une liste de noms
propres, et **des chapitres nommés avec les mots du narrateur**.

S'il a dit « quand j'étais à la ferme chez ma grand-mère », le chapitre s'appelle
« À la ferme chez ma grand-mère ». Pas « Enfance ». La nomenclature générique appartient au
produit, pas à sa vie.

Aucun chapitre n'est créé pour une période dont il n'a pas parlé. La frise n'a pas à être
complète pour être utile.

---

## 4. L'aiguillage pendant la dictée

Une fois la frise posée, les propositions cessent d'être génériques et deviennent ancrées.
C'est là que le travail d'onboarding paie vraiment.

**Suggestions ancrées.** « Vous avez placé votre arrivée à Lyon vers 1962, mais vous n'en
avez pas encore parlé. »

**Suggestions par les gens.** « Vous avez cité votre frère Paul plusieurs fois. Vous voulez
raconter quelque chose sur lui ? »

**Suggestions par les creux chronologiques.** « Entre votre mariage et la naissance de
Claire, il y a une dizaine d'années dont vous n'avez pas encore parlé. »

**Questions sensorielles quand rien ne vient.** Les questions concrètes débloquent mieux
que les questions abstraites : les odeurs, les repas, les trajets, les objets, les bruits.
« Qu'est-ce qu'on mangeait le dimanche, chez vous ? » produit systématiquement plus qu'une
question sur les valeurs ou les regrets.

### Règles de retenue

Elles comptent autant que les suggestions elles-mêmes.

- Une seule suggestion à la fois, jamais une liste
- Toujours sautable sans justification
- Une suggestion ignorée deux fois ne revient plus jamais
- « Ne plus me proposer ce sujet » accessible directement sur la suggestion
- Aucune relance sur un creux chronologique signalé comme volontaire
- Jamais de notification culpabilisante : pas de « vous n'avez rien raconté depuis 8 jours »

Un creux dans une frise n'est pas un oubli. C'est parfois une période dont quelqu'un ne veut
pas parler, et le produit n'a pas à insister. Une seule proposition, puis le silence.

---

## 5. La frise reste vivante

Tout ce qui a été saisi à l'onboarding est modifiable à tout moment, depuis le livre, sans
repasser par un mode « réglages ».

- Ajouter un jalon, un lieu, une personne oubliée
- Corriger une date, y compris trois mois plus tard
- Renommer, fusionner, supprimer un chapitre
- Déplacer un fragment d'un chapitre à un autre

La frise est aussi une **vue de lecture** à part entière : une ligne de temps où l'on voit
les chapitres remplis, les jalons posés, et les périodes encore vides. Pour beaucoup de
narrateurs ce sera l'écran principal — c'est celui qui donne le sentiment d'avancer, bien
plus qu'un compteur de pages.

Les périodes vides s'affichent sans marqueur négatif. Pas de gris, pas de pointillés, pas de
point d'exclamation. Un espace, simplement.

---

## 6. Conséquences sur le modèle de données

À intégrer dans `schema.prisma` avant la première migration.

- `Book` — contrainte unique sur `userId`
- `Milestone` — un jalon de la frise : libellé prononcé, période approximative
  (années estimées début/fin, niveau de précision), type libre, rattachement relatif
  optionnel à un autre jalon
- `Person` — les noms cités, réutilisés pour le dictionnaire de transcription
- `Place` — les lieux, rattachables à des périodes
- `Chapter` — nommé par le narrateur, rattachable à une période, jamais pré-créé
- `Fragment` — remplace `Page` (voir document précédent), rattaché à un `Recording` et
  optionnellement à un `Chapter`
- `Suggestion` — sujet proposé, avec état : proposé, retenu, ignoré, refusé définitivement.
  Nécessaire pour tenir la règle « ignorée deux fois, plus jamais »

---

## 7. Récapitulatif des décisions

| Question | Décision |
|---|---|
| Nombre de livres | Un seul par compte, définitivement. Aucun sélecteur |
| Aiguillage initial | Oui — « Avant de commencer », 5 à 10 minutes, jamais bloquant |
| Forme de l'aiguillage | Six questions d'ancrage, réponses à la voix, aucune obligatoire |
| Chapitres | Créés à partir des réponses, nommés avec les mots du narrateur |
| Vie type pré-remplie | Non. Aucun chapitre pour une période non évoquée |
| Dates | Aucun sélecteur. Approximations, âges, repères historiques et relatifs |
| Aiguillage continu | Suggestions ancrées sur la frise, une à la fois, ignorée deux fois = jamais |
| Relances | Aucune notification culpabilisante, aucun signalement de creux |
| Modifiabilité | Tout modifiable à tout moment, depuis le livre |
