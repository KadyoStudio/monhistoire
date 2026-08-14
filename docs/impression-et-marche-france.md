# Mon Histoire — Impression et marché français

---

# Partie 1 — L'impression

## 1.1 Ce que le livre imprimé change au produit

Le livre imprimé n'est pas une fonctionnalité d'export. C'est **la raison d'achat**.

Personne ne paie pour une application de dictée. Les gens paient pour l'objet posé sur la
table du salon à Noël. Toute la conception doit en tenir compte : le livre est le produit,
l'app est l'outil qui le fabrique.

Conséquence directe : la qualité de la mise en page imprimée n'est pas un détail de fin de
projet. Un beau récit dans un livre laid tue le bouche-à-oreille.

## 1.2 Format

- **14 × 21 cm** — le format roman français standard. Reconnaissable, économique, tient
  dans une main âgée.
- Intérieur noir et blanc, papier bouffant crème 80 g (le crème est ici justifié :
  confort de lecture sur papier, contrairement à l'écran)
- Couverture quadri, dos carré collé, pelliculage mat
- Corps de texte 12 à 13 points minimum — le lecteur a l'âge du narrateur
- Marge intérieure généreuse : un dos carré collé se referme, un texte trop près du pli
  devient illisible
- Pagination multiple de 4, souvent de 8 ou 16 selon le partenaire

## 1.3 Le PDF à produire

- PDF/X-1a ou PDF/X-3
- Fonds perdus 3 à 5 mm, traits de coupe
- Polices intégrées, aucune police système
- Intérieur en niveaux de gris, couverture en CMJN
- Résolution des images 300 dpi

Attention : Spectral et Literata sont sous licence libre (SIL OFL), donc utilisables en
impression commerciale sans redevance. Vérifier ce point avec le partenaire, certains
imprimeurs le demandent.

## 1.4 Contenu du livre imprimé

Généré automatiquement, mais chaque partie doit être désactivable par le narrateur :

- Page de titre, avec le titre qu'il a choisi
- Dédicace, dictée à la voix comme le reste
- Frise de vie en ouverture, sur une double page
- Chapitres, dans l'ordre du livre
- Index des personnes citées — souvent le passage le plus lu par la famille
- Colophon : la date, et la mention que le récit a été dicté par lui

**Les fragments marqués privés ne sont jamais imprimés.** Sans exception, sans option.

Le texte imprimé est `editedText ?? readableText ?? rawText`, exactement comme à l'écran.

## 1.5 Le bon à tirer

Étape obligatoire, et point de bascule juridique.

- Aperçu complet paginé, consultable dans l'app avant commande
- Validation explicite : « J'ai relu, on peut imprimer »
- Après validation, aucun remboursement pour motif de contenu — c'est écrit clairement à
  cet endroit précis, pas dans les CGV
- Le PDF validé est archivé tel quel, pour pouvoir réimprimer à l'identique dans dix ans

Cette dernière ligne compte plus qu'il n'y paraît : une famille recommandera des
exemplaires supplémentaires après un décès, et le livre devra être rigoureusement identique.

## 1.6 Commande et expédition

Le point que la plupart des produits ratent : **celui qui commande n'est presque jamais
celui qui reçoit, et il commande rarement un seul exemplaire.**

Le cas réel : la fille commande six livres, un pour sa mère, un pour elle, quatre pour ses
frères et sœurs répartis dans quatre villes.

Donc, dès la V1 :

- Plusieurs exemplaires en une commande
- **Plusieurs adresses de livraison en une commande**
- Message personnalisé possible par destinataire
- Tarif dégressif au-delà de trois exemplaires

`PrintOrder` en base : exemplaires, adresses, état, référence partenaire, numéro de suivi,
PDF archivé, date de validation du bon à tirer.

États à suivre : brouillon → bon à tirer validé → payé → transmis à l'imprimeur → en
production → expédié → livré. Chaque changement d'état donne lieu à un e-mail à l'acheteur,
en français simple, et à une notification au narrateur — c'est un moment de fierté, il ne
faut pas le lui voler.

## 1.7 Ce qu'il faut négocier avec le partenaire

- API de dépôt de commande, ou à défaut un dépôt manuel assumé jusqu'à un certain volume.
  Ne pas construire une intégration lourde avant d'avoir vendu cinquante livres.
- Tirage unitaire réel, sans minimum de commande
- Expédition directe au domicile du destinataire, sans mention de l'imprimeur sur le colis
- Délai contractuel, et surtout délai en période de Noël — c'est là que la moitié du volume
  se fera, et c'est là que les imprimeurs saturent
- Reprise en cas de défaut d'impression, à leur charge
- Grille tarifaire dégressive par tranche de pages

## 1.8 Ce qui peut mal tourner

**Livre trop court.** Un narrateur qui a dicté trois heures produit une soixantaine de
pages, sous le minimum de certains imprimeurs. → Mise en page adaptative, et si nécessaire
un message honnête : « Votre livre fait 48 pages. Vous pouvez l'imprimer maintenant, ou
continuer à raconter. »

**Livre trop long.** Quarante heures de dictée donnent un pavé de 900 pages, cher et
difficile à relier. → Proposer un découpage en tomes, jamais une coupe de contenu.

**Le narrateur meurt avant l'impression.** Cas fréquent, et le plus douloureux. → Le
bénéficiaire désigné peut commander sans validation du bon à tirer par le narrateur, avec
une procédure sobre et sans obstacle administratif. Une famille en deuil ne doit pas se
battre contre un logiciel.

**Erreur découverte après impression.** → Correction possible dans l'app et réimpression au
tarif normal. Ne jamais bloquer le texte après impression.

---

# Partie 2 — Le marché français

## 2.1 Qui achète

**Ce n'est pas le narrateur.** Une personne de 87 ans ne sortira pas sa carte bancaire sur
une tablette, et ne s'estime généralement pas légitime à dépenser pour raconter sa vie.

L'acheteur est son enfant, 45 à 65 ans, souvent une fille, en général celle qui gère déjà
les papiers, les rendez-vous médicaux et le téléphone qui ne marche plus.

Ce qu'elle achète n'est pas un logiciel. C'est le fait de ne pas perdre l'histoire de sa
mère, et de ne pas avoir à mener elle-même les entretiens.

**Conséquence sur tout le produit :** le site, le prix, la publicité et le paiement
s'adressent à elle. L'application s'adresse au narrateur. Deux publics, deux langages, deux
parcours qui ne se croisent qu'au moment de l'installation.

## 2.2 Les moments d'achat

L'achat est presque toujours déclenché par un événement, pas par un besoin diffus :

- Un anniversaire rond — 80, 85, 90 ans
- Noël, fête des Mères, fête des Pères
- Un départ en maison de retraite
- Un diagnostic, un accident de santé, un veuvage
- Une naissance dans la famille — le lien entre les générations devient soudain concret

Le pic de saisonnalité est **octobre-décembre**, très marqué. La capacité d'impression de
décembre se négocie en septembre.

## 2.3 Le paysage

Le service équivalent existe : le **biographe familial**, qui mène les entretiens, rédige et
fait imprimer. Comptez 2 000 à 6 000 € et plusieurs mois. C'est excellent et c'est
inaccessible à la plupart des familles.

Le positionnement s'écrit tout seul : le même résultat, à un dixième du prix, au rythme du
narrateur, dans ses propres mots plutôt que dans ceux d'un rédacteur.

Ne jamais se positionner contre les biographes. Ils font un autre métier, ils peuvent
devenir prescripteurs, et une partie de leurs clients refusés faute de budget sont
exactement la cible.

## 2.4 Modèle économique

**Achat unique, livre imprimé inclus. Pas d'abonnement.**

L'abonnement pose un problème que ce produit ne peut pas se permettre : un prélèvement qui
continue sur le compte d'un défunt est un désastre relationnel, et une résiliation à faire
est une corvée de plus pour une famille en deuil. Un forfait se met sous un sapin et se
partage entre frères et sœurs. Un abonnement ne s'offre pas.

### La structure

**Forfait d'entrée — ordre de grandeur 129 €**

- Douze mois de dictée illimitée
- Photos incluses, sans limite
- Un exemplaire imprimé, relié, expédié à l'adresse choisie
- Lecture, export et téléchargement de l'audio **à vie**, sans condition

**Options réelles, par-dessus**

- Exemplaires supplémentaires, tarif dégressif dès le troisième
- Réimpression à l'identique, à tout moment, même des années plus tard
- Couverture rigide, papier supérieur
- Prolongation de la période de dictée, tarif réduit
- Impression en plusieurs tomes (une coupe à l'impression, jamais un second récit)
- Numérisation de photos papier ou de cassettes audio anciennes
- Livre audio monté à partir de sa vraie voix (à terme — forte valeur émotionnelle, coût
  marginal faible)

### Pourquoi la période de dictée est bornée et pas le reste

Le coût marginal de ce produit n'est pas nul, contrairement à un logiciel classique. Pour un
narrateur qui dicte trente heures — un usage normal, pas extrême :

| Poste | Coût approximatif |
|---|---|
| Transcription Whisper | ~20 € |
| « Améliorer la lecture », relances comprises | 5 à 10 € |
| Stockage audio Opus (~330 Mo) | négligeable |
| Impression + expédition d'un exemplaire | 15 à 25 € (à confirmer) |

Soit 40 à 55 € de coût de revient dans le pire cas. Marge confortable à 129 €, mais
seulement si la dictée est bornée : c'est elle qui coûte, pas la conservation.

D'où la règle : **on borne ce qui coûte, on offre à vie ce qui ne coûte rien.** Après douze
mois, la dictée se suspend, la lecture et l'export restent ouverts pour toujours. Aucune
suppression, jamais — règle 6 du brief.

### Ce qui n'est jamais payant

Les photos, en particulier, ne sont pas une option. C'est le paywall qui semble évident et
qui est le plus mauvais choix possible :

- elles coûtent presque rien à stocker
- elles augmentent massivement la valeur perçue du livre imprimé
- elles sont le meilleur amorçage de dictée qui existe : on raconte en regardant une photo
- elles poussent la famille à commander plus d'exemplaires

Les faire payer reviendrait à taxer ce qui fait vendre ce qu'on veut vendre. Et restreindre
les photos d'une vie derrière un paiement, sur ce produit, se paie en avis clients.

Ne seront jamais payants non plus : le nombre de chapitres, la durée d'un enregistrement,
« Améliorer la lecture », l'export, le partage familial. Rien de ce qui dégrade le récit
lui-même.

### L'ancrage de prix

Un biographe familial coûte 2 000 à 6 000 €. À 129 €, on n'est pas « pas cher » : on est
dix à quarante fois moins cher qu'un service équivalent. C'est un argument, pas un
positionnement bas de gamme, et il doit être dit explicitement sur la page de vente.

### Conséquences sur la trésorerie

L'achat unique signifie aucun revenu récurrent : le chiffre d'affaires dépend entièrement de
l'acquisition, et la saisonnalité est brutale — l'essentiel se fait entre octobre et
décembre.

Concrètement : creux de trésorerie de février à septembre, et capacité d'impression à
négocier en septembre pour tenir décembre.

Les amortisseurs sont les exemplaires supplémentaires et les réimpressions. Ils viennent du
même client, souvent bien plus tard, et parfois après un décès quand toute la famille en
veut un exemplaire. C'est une raison de plus pour archiver le PDF validé tel quel (§1.5).

### À vérifier avant de figer le prix

- Les tarifs réels de l'imprimeur partenaire, par tranche de pages et par quantité
- Le coût d'expédition France métropolitaine, et hors métropole
- Le **droit de rétractation** : quatorze jours en vente à distance. L'exception pour biens
  personnalisés devrait couvrir le livre imprimé une fois le bon à tirer validé, mais pas
  l'accès à l'application. À faire confirmer, et à refléter dans les CGV.
- La TVA applicable : le livre imprimé et le service numérique ne relèvent pas du même taux
  en France. Une offre unique mêlant les deux demande une ventilation.

### Conséquences techniques

À intégrer au développement, en phase de paiement :

- Stripe en paiement unique, pas d'abonnement
- Un droit d'accès en base porté par le compte : date de fin de dictée, exemplaires
  inclus restants, options achetées
- L'expiration de la dictée suspend l'enregistrement et **rien d'autre**. Lecture, export,
  téléchargement audio et commande d'exemplaires restent ouverts
- L'acheteur n'est pas toujours le titulaire du compte : prévoir l'achat pour un tiers, avec
  un code ou un lien d'activation à remettre au narrateur
- Écran de fin de période sobre et non anxiogène : « Votre année de dictée est terminée.
  Votre livre reste accessible pour toujours. Vous pouvez continuer à raconter en
  prolongeant. »

## 2.5 Acquisition

**Recherche.** L'intention est déjà formulée dans les recherches : « écrire les mémoires de
ma mère », « faire raconter sa vie à mon père », « biographie familiale », « cadeau
90 ans grand-mère », « livre souvenir famille ». Volumes modestes, intention très forte, peu
de concurrence publicitaire. Le canal le plus rentable au départ.

**Réseaux sociaux.** Facebook et Instagram, ciblage France 45-65 ans. Le format qui
convertit ici est le livre lui-même filmé — les mains qui le feuillettent, une page lue à
voix haute par la voix enregistrée. Jamais une démonstration d'interface.

**Prescription.** C'est là que se fait le volume durable :
EHPAD et résidences services, services d'aide à domicile, associations (Petits Frères des
Pauvres, réseaux d'accompagnement du grand âge), généalogistes, médiathèques et ateliers
d'écriture municipaux, notaires sur les successions.
Prévoir une offre partenaire dès que possible : ces structures ont besoin d'activités à
proposer et n'ont pas d'outil.

**Presse.** *Notre Temps*, *Pleine Vie*, *Version Femina*, la presse quotidienne
régionale. La PQR est sous-estimée : un article local sur un habitant de 92 ans qui a
publié son livre est exactement le format qu'elle cherche, et exactement ce qui convainc
son lectorat.

## 2.6 Les objections à traiter sur le site

- « Ma mère n'y arrivera pas toute seule » — c'est l'objection numéro un. Montrer le
  parcours d'installation par l'aidant, et le fait qu'une séance se résume à un bouton.
- « C'est une machine qui va écrire à sa place ? » — non, et c'est le cœur du produit.
  Montrer un avant/après réel, texte brut et texte nettoyé côte à côte.
- « Et si elle n'a rien à raconter ? » — montrer les questions d'amorçage.
- « Qui a accès à ce qu'elle raconte ? » — elle seule, et qui elle décide. Hébergement en
  France ou en Europe. Aucun usage des récits pour entraîner quoi que ce soit, écrit noir
  sur blanc.
- « Combien de temps ça prend ? » — donner un ordre de grandeur honnête : une vingtaine de
  séances de vingt minutes pour un livre substantiel.

## 2.7 Le seul indicateur qui compte au démarrage

Pas les inscriptions. Pas le temps passé. **Le taux de comptes créés qui aboutissent à un
livre imprimé.**

Tout le reste est du bruit. Un narrateur qui enregistre trente heures sans jamais commander
son livre signale un échec de produit, pas un succès d'engagement.

Deuxième indicateur, un cran plus loin : le nombre d'exemplaires par commande. Il mesure
directement si le livre plaît à la famille, et c'est lui qui décidera de la rentabilité.
