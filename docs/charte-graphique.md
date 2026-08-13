# Mon Histoire — Charte graphique

---

## 1. Le point de départ

Une personne née entre 1935 et 1955 a appris à écrire à la plume, à l'encre violette, sur
du papier réglé Seyès — la grande réglure avec la marge rouge à gauche. C'est le premier
support sur lequel elle a raconté quelque chose.

L'identité vient de là. Pas d'une esthétique « souvenirs » générique, pas de sépia, pas de
photos jaunies, pas de cadres dorés. Le cahier d'écolier français : neutre, précis,
familier, et sans nostalgie sirupeuse.

Ce choix règle aussi un problème pratique : il est spécifiquement français, sur un produit
qui s'adresse à la France.

**Ce qu'on évite délibérément :** le fond crème avec serif contrasté et accent terracotta.
C'est devenu la signature visuelle par défaut de tout ce que produisent les outils
génératifs, et ça se repère immédiatement.

---

## 2. Couleurs

| Nom | Hex | Rôle |
|---|---|---|
| Encre violette | `#4A3B7C` | Couleur principale. Actions, liens, marque |
| Encre profonde | `#221F2E` | Texte courant, titres |
| Papier | `#F8F8F5` | Fond principal. Blanc neutre de cahier, **pas un crème** |
| Papier marqué | `#EBEBE4` | Surfaces secondaires, séparations, zones inactives |
| Marge | `#C1443A` | Accent unique et rare. Enregistrement en cours, alertes |

Cinq couleurs. Pas une de plus.

**Le rouge de marge ne sert qu'à une chose : signaler que le micro écoute.** Sur du papier
Seyès, la ligne rouge verticale marque l'endroit où l'on commence à écrire. Ici elle marque
le moment où la voix devient texte. L'utiliser ailleurs lui retire tout son sens.

Contrastes vérifiés : encre violette sur papier ≈ 9:1, encre profonde sur papier ≈ 15:1.
AAA sur les deux.

Aucun dégradé. Aucune ombre portée colorée. Les élévations se font par un trait fin en
papier marqué, pas par du flou.

---

## 3. Typographie

Trois familles, trois métiers distincts. Aucune n'est Inter.

**Spectral** — titres, couverture du livre, nom de la marque.
Dessinée par Production Type, fonderie française. Bookish sans être ornementale.
Utilisée avec retenue : titres de chapitres, couverture, écrans clés.

**Literata** — le récit lui-même.
Conçue pour la lecture longue à l'écran, grande hauteur d'x, formes ouvertes. C'est la
police dans laquelle le narrateur relit sa vie, c'est celle qui compte le plus.

**Atkinson Hyperlegible** — toute l'interface.
Dessinée par le Braille Institute pour les personnes malvoyantes : les caractères
habituellement confondus (I, l, 1 — O, 0) sont différenciés à dessein. Sur un produit
destiné à des gens de 85 ans, ce n'est pas un choix esthétique, c'est le bon outil.

### Échelle

| Rôle | Taille | Famille | Interligne |
|---|---|---|---|
| Titre d'écran | 34px | Spectral | 1.2 |
| Titre de chapitre | 28px | Spectral | 1.25 |
| Récit | 22px | Literata | 1.75 |
| Interface | 20px | Atkinson Hyperlegible | 1.5 |
| Bouton | 20px | Atkinson Hyperlegible | 1.2 |
| Mention secondaire | 18px | Atkinson Hyperlegible | 1.4 |

**20px est le plancher absolu.** Rien en dessous, nulle part, y compris les mentions
légales et les libellés de champ. Le réglage de taille du récit va de 22 à 34px et reste
atteignable en permanence depuis la vue lecture.

Longueur de ligne du récit : 60 à 70 caractères. Texte aligné à gauche, jamais justifié —
la justification crée des rivières blanches qui gênent la lecture des personnes
malvoyantes.

---

## 4. L'élément signature : la réglure

La réglure Seyès est le seul geste décoratif du produit, et il encode quelque chose de
vrai.

**La marge.** Un filet rouge vertical de 2px, à gauche de la zone de récit, présent en
permanence en vue lecture. C'est le repère de l'écran, l'équivalent de la marge du cahier.

**Les lignes.** Pendant qu'un enregistrement se transcrit, la réglure horizontale apparaît
derrière l'emplacement du texte, en `#C3C8DE` à faible opacité, et le texte s'y écrit au
fur et à mesure. Une fois la transcription terminée, la réglure disparaît en fondu.

Le sens est direct : le papier est visible tant que la page s'écrit, puis s'efface quand
elle est écrite. Et ça résout un problème réel — l'attente de transcription est un moment
où l'utilisateur doute que quelque chose se passe.

**Contrainte impérative :** la réglure ne reste jamais derrière du texte définitif. Un fond
ligné sous un texte à lire est un obstacle pour une vue diminuée. Elle est transitoire ou
elle n'est pas.

`prefers-reduced-motion` respecté : le fondu devient un simple changement d'état.

---

## 5. Logo

Le guillemet français « .

C'est le signe typographique exact où la parole devient de l'imprimé — précisément ce que
fait le produit. Il est français, il est simple, il tient à 16 pixels, et il ne ressemble
pas à un logo d'application.

**Version principale :** deux chevrons en encre violette, accompagnés du nom en Spectral.

**Icône :** carré à coins arrondis en encre violette, guillemet en papier, filet rouge de
marge sur le bord gauche.

**Favicon :** guillemet seul, sans le filet — à 16px la ligne se transforme en bouillie.

Interdit : incliner le logo, le mettre en dégradé, l'entourer d'un cercle, lui ajouter une
plume, un livre ou un micro. Le mark seul suffit.

Zone de protection : la hauteur d'un chevron sur les quatre côtés.

---

## 6. Voix

Le produit tutoie l'usage et vouvoie la personne. Vouvoiement systématique — cette
génération le lit comme du respect, pas comme de la distance.

**Phrases courtes. Verbes actifs. Pas de jargon, jamais.**

Un bouton dit ce qui va se passer, et le message qui suit emploie le même mot :
« Raconter une page » produit « Votre page est enregistrée ».

| Ne pas écrire | Écrire |
|---|---|
| Soumettre | Enregistrer ma page |
| Erreur de synchronisation | Votre page est sur cette tablette. Elle partira dès que le wifi reviendra |
| Supprimer | Mettre de côté |
| Chargement… | J'écris ce que vous venez de dire… |
| Embellir | Améliorer la lecture |
| Aucun contenu | Vous n'avez encore rien raconté. On commence ? |

Les erreurs ne s'excusent pas et ne sont jamais vagues : ce qui s'est passé, et quoi faire
maintenant.

Aucun emoji, nulle part. Aucune exclamation enthousiaste. Aucune relance culpabilisante —
jamais de « vous n'avez rien raconté depuis 8 jours ».

---

## 7. Tokens Tailwind v4

```css
@theme {
  --color-encre: #4A3B7C;
  --color-encre-profonde: #221F2E;
  --color-papier: #F8F8F5;
  --color-papier-marque: #EBEBE4;
  --color-marge: #C1443A;
  --color-reglure: #C3C8DE;

  --font-titre: "Spectral", Georgia, serif;
  --font-recit: "Literata", Georgia, serif;
  --font-ui: "Atkinson Hyperlegible", system-ui, sans-serif;

  --text-base: 1.25rem;      /* 20px plancher */
  --text-recit: 1.375rem;    /* 22px */

  --radius-doux: 0.75rem;
  --spacing-touche: 3.5rem;  /* 56px cible tactile minimale */
}
```

Polices en `font-display: swap`, sous-ensemble latin étendu (les récits contiennent des
noms propres accentués), auto-hébergées plutôt que servies par Google Fonts — RGPD et
performance.
