# CLAUDE.md — Site vitrine La Guilde des Songes

Site vitrine statique de l'association de jeu de rôle « La Guilde des Songes » (Dijon).
Refonte de https://www.laguildedessonges.net/ — le contenu factuel (créneaux, adresses,
réseaux) vient de l'ancien site.

## Stack

- Vite + Vue 3 (`<script setup>`) + vue-router en **historique hash** (`#/agenda`) pour
  rester 100 % statique, sans réécriture serveur.
- `src/pages/` = une page par route (Home, Partners, Agenda, Gazette, GazetteIssue) ;
  `src/components/` = sections de l'accueil et briques partagées.
- Design tokens CSS dans `src/style.css` (`--bg`, `--accent`, `--band-height`…) — jamais
  de couleur en dur dans les composants.
- Police : Garamond partout (EB Garamond via Google Fonts dans `index.html`), titres en gras.
- Icônes : `IconGlyph.vue` (SVG au trait, y compris les logos Discord/Instagram/Facebook),
  toujours posées dans une pastille en creux (`--shadow-in-sm`).

## Contenu à mettre à jour

- **Agenda** : `src/data/events.js`. Les parties passées disparaissent automatiquement.
  Un one-shot avec `signup` affiche un bouton « S'inscrire » (lien Discord/formulaire) ;
  sans `signup`, la table est marquée fermée.
- **Gazette** : un fichier Markdown par numéro dans `src/gazette/` (front-matter
  `title` / `date` / `excerpt`). Déposer le fichier suffit : il est listé et publié.
- **Partenaires** : `src/data/partners.js`.
- **Réseaux et contact** : `src/socials.js` (partagé entête + pied de page).

## Commandes

- `npm run dev` — serveur de dev.
- `npm run build` — build statique dans `dist/` (déployable sur n'importe quel hébergeur statique).

## Publication

Hébergé sur GitHub Pages. Le workflow `.github/workflows/deploy.yml` reconstruit et
met en ligne le site à **chaque push sur `main`** — y compris les modifications faites
directement depuis l'interface web de GitHub (bouton crayon puis « Commit changes »).
Compter une à deux minutes ; l'avancement est visible dans l'onglet **Actions**.

`base: './'` dans `vite.config.js` : les chemins sont relatifs, le site fonctionne donc
aussi bien sur l'URL GitHub Pages que sur le domaine de la Guilde, sans réglage.

## Règles

- Tout le contenu est en français ; pas d'i18n.
- Vérifier la lisibilité à chaque modif : rien ne déborde ni ne se fait rogner, y compris en mobile (~375px).
- Commit/push uniquement quand l'utilisateur le demande ; travailler sur une branche dédiée puis merger sur main.
