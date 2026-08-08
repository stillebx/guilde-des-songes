# CLAUDE.md — Site vitrine La Guilde des Songes

Site vitrine statique de l'association de jeu de rôle « La Guilde des Songes » (Dijon).
Refonte de https://www.laguildedessonges.net/ — le contenu factuel (créneaux, adresses,
réseaux) vient de l'ancien site.

## Stack

- Vite + Vue 3 (`<script setup>`), page unique, pas de router.
- Une section = un composant dans `src/components/` (Header, Hero, About, Activities, Practical, Join, Footer).
- Design tokens CSS dans `src/style.css` (`--bg`, `--accent`…) — jamais de couleur en dur dans les composants.
- Police : Garamond partout (EB Garamond via Google Fonts dans `index.html`), titres en gras.

## Commandes

- `npm run dev` — serveur de dev.
- `npm run build` — build statique dans `dist/` (déployable sur n'importe quel hébergeur statique).

## Règles

- Tout le contenu est en français ; pas d'i18n.
- Vérifier la lisibilité à chaque modif : rien ne déborde ni ne se fait rogner, y compris en mobile (~375px).
- Commit/push uniquement quand l'utilisateur le demande ; travailler sur une branche dédiée puis merger sur main.
