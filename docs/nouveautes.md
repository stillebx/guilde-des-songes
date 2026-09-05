# Nouveautés du site

Ce que le site sait faire de plus, dans l'ordre inverse des dates. Le mode
d'emploi au quotidien (où changer quel contenu) est dans `CLAUDE.md`, à la
racine du dépôt.

---

## Septembre 2026

### Témoignages d'adhérents — 5 septembre

Nouvelle section sur la page d'accueil, entre « Infos pratiques » et « Nous
rejoindre », avec les témoignages de Flex, Jonathan et Elisa. Chaque témoignage
est une carte : bulle de conversation, nom et rôle à gauche, citation à droite.
Une entrée « Témoignages » a été ajoutée au déroulant « Accueil » de la barre de
navigation.

Les témoignages sont présentés en une seule colonne : ils sont de longueurs très
inégales, et côte à côte les plus courts auraient laissé de grands vides. Sous
700 px, l'identité passe au-dessus de la citation.

**Pour en ajouter un** : ouvrir `src/components/TestimonialsSection.vue` et
compléter la liste `testimonials` (`name`, `role`, `quote`).

### Inscriptions et feuille Google — 4 septembre

Grosse série de changements sur le classeur qui pilote l'agenda.

- **Colonne « Statut »** (colonne A de l'onglet « Événements ») : remplie toute
  seule à partir de la date — « à venir » ou « terminé ». Elle se met à jour à
  l'ouverture du classeur, dès qu'une date change, et chaque nuit. C'est une
  colonne de travail, jamais publiée sur le site : inutile d'y écrire.
- **Colonne « Places » libre** : vide = ni formulaire ni compteur sur le site ;
  un nombre ouvre les inscriptions et le site décompte ce qu'il reste ;
  « Complet » les ferme. La liste déroulante propose les valeurs courantes sans
  interdire les autres.
- **Le compteur de places ne dépend plus du formulaire** : le nombre de places
  restantes s'affiche même quand l'inscription se fait sur Discord.
- **Les « Intéressé·e » de Discord valent inscription** : c'est la convention à
  la Guilde. Le script relève les pseudos des personnes intéressées par
  l'événement Discord et les ajoute au registre, marqués « Origine : Discord ».
  Ces lignes sont gérées par le script — ne pas les modifier à la main.
- **Le formulaire du site accepte un prénom autant qu'un pseudo Discord** : pas
  besoin de créer un compte Discord pour s'inscrire. Un pseudo identique à celui
  de Discord évite simplement de compter la personne deux fois.
- **Mention de conservation des données** sous le formulaire d'inscription.
- **Archives** : rangement par type, remplies dès l'installation ; les deux
  agendas se classent seuls par date ; les inscriptions sont groupées par soirée.
- **Menu « Guilde »** dans le classeur : *Ranger : archives et inscriptions*,
  *Relever les inscrits Discord*, *Vérifier le lien avec Discord*.

Le script complet et son mode d'emploi sont dans `docs/agenda-google-sheet.gs`.

---

## Août 2026

### Agenda

- L'agenda est **piloté par la feuille Google** : c'est elle la source, plus de
  parties fantômes écrites en dur dans le site.
- **Fenêtre de détails** au clic sur une partie, vignettes étiquetées par type
  (campagne, one-shot, soirée mensuelle, événement), typographie française
  (espaces insécables devant `: ; ! ?`).
- Les inscriptions passent **aussi par l'agenda**, en plus du Discord.

### Contenu

- **Essai gratuit de trois séances** annoncé dans « Nous rejoindre ».
- Les **jeux de plateau** remplacent les parties solo dans « Nos parties ».
- **La Maison Phare** rejoint les partenaires ; lien direct vers le site de
  l'Espace Baudelaire.
- Partenaires présentés en **vignettes 2×2**, larges et basses.
- Gazette : le numéro de démonstration est retiré, remplacé par
  « Été 2026 — à paraître ».

### Affichage

- **Thème clair / sombre**, avec un sélecteur dans la barre.
- **Mobile** : brume allégée pour rester lisible, sélecteur de thème dans la
  barre plutôt que dans le menu, pied de page allégé.
- **Pied de page** : logos de la Côte-d'Or et de la Ville de Dijon à côté de
  celui de la Guilde, sur une ligne discrète.

### Publication

- **Mise en ligne automatique** : le workflow GitHub Actions reconstruit et
  publie le site à chaque push sur `main`, y compris les modifications faites
  depuis l'interface web de GitHub. Compter une à deux minutes ; l'avancement est
  visible dans l'onglet **Actions**.
- Côté GitHub, **Settings → Pages → Source doit rester « GitHub Actions »**.
  Réglé sur « Deploy from a branch », la page reste blanche.
- **URL propres** (`/agenda`, et non `#/agenda`). Le chemin de publication est
  fixé par `BASE_PATH` dans le workflow : `/guilde-des-songes/` sur GitHub Pages,
  `/` sur un domaine servi à la racine.
