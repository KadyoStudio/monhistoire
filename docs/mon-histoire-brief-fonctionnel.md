# Mon Histoire — Brief fonctionnel et anticipation des défaillances

Document produit. Destiné à être lu par Claude Code avant toute décision d'implémentation,
et par toute personne rejoignant le projet.

---

## 1. Le projet en une page

Une personne âgée raconte sa vie à voix haute, page par page, depuis un téléphone ou une
tablette. L'application enregistre, transcrit, met le texte en forme sans le dénaturer, et
assemble le tout en un livre lisible, imprimable et partageable avec sa famille.

Le produit ne vend pas un outil. Il vend le fait que le récit existe avant qu'il ne
disparaisse. C'est une course contre le temps, et l'utilisateur le sait souvent mieux que
nous.

**Ce qui définit la réussite :** la personne relit une page et pense « oui, c'est moi ».

**Ce qui définit l'échec :** elle relit une page et pense « ce n'est pas comme ça que je
parle ». Ou pire — elle abandonne parce qu'elle a cru avoir tout perdu.

---

## 2. Utilisateurs et rôles

**Le narrateur.** 70 à 95 ans. Souvent peu à l'aise avec le numérique. Parfois une vue
diminuée, une audition diminuée, une motricité fine réduite. Utilise majoritairement une
tablette, parfois un téléphone posé sur la table plutôt que tenu en main.

**L'aidant.** Enfant ou petit-enfant, parfois auxiliaire de vie. C'est très souvent lui qui
installe l'application, crée le compte, et débloque les situations. Il n'est pas toujours
présent au moment où le narrateur enregistre.

**Le lecteur.** Membre de la famille invité à lire le livre. Aucun droit de modification.
Ce point n'est pas négociable et sera contesté par les familles.

Conséquence de conception : **l'aidant doit pouvoir aider sans pouvoir se substituer.**
Si l'aidant peut écrire à la place du narrateur, le produit perd sa raison d'être et
personne ne s'en rendra compte avant qu'il soit trop tard.

---

## 3. Parcours principal

1. L'aidant installe l'app et crée le compte du narrateur
2. Le narrateur ouvre l'app, voit un seul bouton : « Raconter une page »
3. Il parle. Il arrête quand il veut.
4. L'app confirme explicitement que c'est enregistré et conservé
5. La transcription apparaît quelques instants plus tard
6. Il peut lire, écouter à nouveau, améliorer la lecture, ou modifier
7. La page rejoint le livre
8. Plus tard : organisation en chapitres, invitation de la famille, export

Le parcours minimal viable s'arrête à l'étape 4. Si un narrateur peut enregistrer une page
et avoir la certitude absolue qu'elle est conservée, le produit a déjà de la valeur.

---

## 4. Ce qui peut mal tourner

Format : le risque, ce que vit réellement l'utilisateur, la réponse produit.

### 4.1 Pendant l'enregistrement

**Appel entrant, verrouillage d'écran, application mise en arrière-plan**
Le narrateur parle vingt minutes, sa fille l'appelle, il décroche. Au retour,
l'enregistrement a disparu.
→ Écriture continue en local (IndexedDB) par segments courts pendant l'enregistrement.
Jamais un seul blob gardé en mémoire jusqu'à l'arrêt. Au retour dans l'app, reprise
explicite : « Votre enregistrement de tout à l'heure est là. Vous voulez continuer ? »

**Permission micro refusée**
Refusée une fois par erreur, le navigateur ne redemande plus. L'utilisateur appuie sur
enregistrer, rien ne se passe, il conclut que l'app est cassée.
→ Détection de l'état de permission avant d'afficher le bouton. Écran d'explication en
langage courant avec la marche à suivre, et un bouton « Envoyer ces instructions à mon
aidant ».

**Micro coupé, casque Bluetooth capricieux, appareil trop loin**
Vingt minutes de silence enregistrées. Whisper produit du texte inventé à partir de rien —
c'est un comportement connu de Whisper sur les pistes silencieuses.
→ Contrôle du niveau sonore en temps réel avec retour visuel simple pendant
l'enregistrement. Si le niveau reste sous le seuil, alerte immédiate, pas après coup.
Détection du silence avant envoi à la transcription.

**Oubli d'arrêter l'enregistrement**
Deux heures de bruit de cuisine.
→ Arrêt automatique après une durée longue mais raisonnable, avec avertissement sonore et
visuel avant. Découpage automatique en segments côté serveur.

**Double appui, appui hésitant, tremblement**
Deux enregistrements créés, ou un enregistrement immédiatement annulé.
→ Anti-rebond sur les contrôles. Aucun bouton destructeur adjacent au bouton principal.

**Batterie épuisée en cours**
→ Voir écriture continue en local. La reprise doit fonctionner après un redémarrage complet
de l'appareil.

### 4.2 Réseau

**Connexion faible ou intermittente**
Maison de campagne, EHPAD, Wi-Fi partagé. L'upload d'un fichier audio de 20 minutes échoue
à 80 %.
→ Upload repris par morceaux, jamais recommencé de zéro. File d'attente persistante.
L'application reste utilisable pendant l'upload.

**Fermeture de l'app pendant l'envoi**
→ La file reprend à la réouverture. Statut visible et compréhensible : « En attente d'envoi
— vos pages sont conservées sur cet appareil. »

**Utilisateur qui croit avoir perdu son travail**
C'est la défaillance la plus coûteuse du produit, et elle est presque toujours une
défaillance de communication, pas de données.
→ Aucun état ambigu. Chaque page affiche toujours en clair où elle en est. Le mot
« conservé » doit apparaître dès que c'est vrai.

### 4.3 Transcription

**Voix faible, débit lent, accent régional, appareil dentaire**
Transcription truffée d'erreurs. Le narrateur se sent humilié.
→ Ne jamais présenter la transcription brute comme un résultat définitif. La formuler comme
une première version à corriger. L'audio original reste écoutable en un geste, toujours.

**Noms propres, lieux, patois, mots d'une autre langue**
« Kerlouan » devient « Quel Louand ». Un nom de grand-mère devient méconnaissable.
→ Dictionnaire personnel par utilisateur, alimenté par ses corrections. Une correction faite
une fois ne doit jamais être à refaire.

**Deux voix sur l'enregistrement**
L'aidant pose des questions, le narrateur répond. La transcription mélange tout.
→ Assumer ce cas plutôt que le combattre : mode « entretien » où les questions sont
identifiables et peuvent être masquées à la lecture.

**Télévision ou radio en fond**
→ Avertissement au premier enregistrement, une seule fois, sans culpabilisation.

### 4.4 L'amélioration du texte

C'est le risque principal du produit et il est silencieux : personne ne se plaint, les gens
arrêtent simplement d'utiliser l'app.

**L'IA réécrit au lieu de nettoyer**
Une phrase simple devient une phrase élégante. Le narrateur ne se reconnaît pas.
→ Prompt strictement contraint. Comparaison avant/après consultable. Retour à la version
originale toujours possible, en un geste, depuis la page elle-même.

**Lissage du parler régional ou populaire**
Le patois, les tournures anciennes, les expressions familiales sont effacés au nom de la
correction. C'est exactement ce qui avait de la valeur.
→ Consigne explicite de préservation. Ces marqueurs sont le patrimoine, pas des fautes.

**Correction d'une « erreur » volontaire**
Le narrateur dit « ma sœur Marie, enfin non, Marthe » — parce que c'est ainsi qu'il pense.
→ L'hésitation de contenu se conserve. Seule l'hésitation de diction se retire.

**Modification de faits, de dates, de noms**
L'IA « corrige » une date incohérente ou uniformise un nom.
→ Interdiction absolue. Aucune vérification factuelle, aucune harmonisation. Le récit
appartient au narrateur, y compris ses contradictions.

**Panne ou lenteur du service IA**
→ Le texte brut reste lisible et le livre reste complet sans amélioration. La fonctionnalité
est un confort, jamais un passage obligé.

### 4.5 Le narrateur lui-même

**Perte du fil d'une session à l'autre**
« Où j'en étais ? »
→ L'écran d'accueil rappelle la dernière page enregistrée et propose une suite. Jamais une
page blanche.

**Perte du mot de passe ou de l'accès à l'e-mail**
Cas extrêmement fréquent dans cette tranche d'âge, et souvent définitif.
→ Connexion par lien e-mail plutôt que mot de passe. Procédure de récupération passant par
l'aidant désigné à l'inscription. Prévoir dès le départ que l'aidant puisse être changé.

**Création de deux comptes en double**
→ Détection à l'inscription, fusion assistée plutôt que blocage.

**Substitution par l'aidant**
L'aidant, par gentillesse ou impatience, écrit à la place. Le livre devient le sien.
→ L'aidant n'a pas de droit d'écriture sur le contenu. Il aide techniquement, il n'écrit
pas. Ce garde-fou sera contesté ; il faut le tenir.

**Troubles cognitifs, récits contradictoires, répétitions**
Le même souvenir raconté trois fois avec trois versions.
→ Aucune détection de doublon, aucun signalement d'incohérence, aucune suggestion de
suppression. Trois versions du même souvenir sont trois pages légitimes. C'est à la famille
d'en décider, pas au produit.

### 4.6 Contenu sensible

Ce produit va recevoir des récits de guerre, de deuil, de violences subies, de secrets de
famille. C'est prévisible et c'est normal.

→ Aucune modération automatique du contenu, aucun filtrage, aucun jugement. Le traitement
IA nettoie la lisibilité et rien d'autre.
→ Un narrateur peut marquer une page comme privée : conservée, exclue du partage familial
et de l'export, jusqu'à décision contraire de sa part.
→ Aucune fonctionnalité de suppression définitive immédiate. Une page effacée sous le coup
de l'émotion doit être récupérable.

### 4.7 Famille et partage

**Lien d'invitation transféré**
Un lien envoyé à un enfant se retrouve dans une conversation de groupe.
→ Invitations nominatives, à usage unique, révocables. Liste des accès visible et
compréhensible par le narrateur.

**La famille veut corriger l'histoire**
« Ce n'est pas ce qui s'est passé. » « Papa se trompe d'année. »
→ Lecture seule, strictement. Éventuellement, à terme, des commentaires privés qui
n'altèrent jamais le texte.

**Désaccord familial sur le contenu**
→ Le narrateur seul décide de qui accède à quoi. Aucun mécanisme de contestation.

### 4.8 Après le décès du narrateur

Le cas n'est pas un cas limite : c'est une issue certaine du parcours produit, souvent à
court terme. Ne pas l'avoir prévu serait une faute.

→ Désignation d'un bénéficiaire à l'inscription, modifiable.
→ Le contenu ne disparaît jamais faute de paiement. Un abonnement interrompu bascule le
livre en lecture seule et export libre, jamais en suppression.
→ Export intégral (texte et audio) accessible en permanence, sans condition, y compris à
partir d'un compte inactif. L'audio de la voix a souvent plus de valeur que le texte.
→ Procédure de transmission simple, documentée, réalisable par une famille en deuil qui
n'a pas envie de se battre avec un logiciel.

### 4.9 Exploitation

**Coût de stockage audio**
Des heures d'enregistrement par utilisateur, conservées indéfiniment.
→ Modélisé dès le départ dans le prix. Compression sans perte de qualité de voix.
Jamais de suppression d'audio pour raison de coût.

**Abonnement interrompu**
→ Voir ci-dessus. La suppression de contenu pour non-paiement est exclue du produit.

**Export**
→ PDF imprimable et archive brute. Le narrateur doit pouvoir partir avec tout, à tout
moment, sans le demander à personne.

---

## 5. Règles produit non négociables

1. `rawText` et l'audio original ne sont jamais écrasés ni supprimés
2. Aucune suppression définitive immédiate, sur aucun objet
3. L'aidant aide, il n'écrit pas
4. L'IA nettoie la lisibilité, elle ne réécrit pas
5. Aucun état ambigu affiché à l'utilisateur
6. L'export intégral est toujours disponible, sans condition
7. Le produit ne juge, ne corrige et ne modère jamais le contenu du récit

---

## 6. Hors périmètre V1

- Correction ou vérification factuelle
- Suggestions de sujets générées par IA
- Collaboration en temps réel
- Impression et livraison d'un livre physique
- Application native iOS / Android
- Multilingue au-delà du français
