// Documents de la vie communautaire, listés sur la page Ressources.
//
// Pour publier un document : déposer le fichier dans `public/documents/`, puis
// ajouter (ou compléter) son entrée ici.
//   icon    : nom d'une icône d'IconGlyph.vue.
//   name    : titre affiché sur la vignette.
//   text    : à quoi sert le document, deux ou trois phrases.
//   fichier : chemin depuis la racine du site — le bouton « Télécharger »
//             n'apparaît que s'il est renseigné. Sans lui, la vignette annonce
//             le document « à paraître » : un document en cours d'écriture a sa
//             place ici, il dit à quoi s'attendre.
//   etat    : mention affichée à la place de la date, en haut de la vignette.
export const ressources = [
  {
    icon: 'handshake',
    name: 'La charte du bon joueur',
    etat: 'En préparation',
    text:
      "Ce que la Guilde attend autour de la table, joueur·ses comme meneur·ses : " +
      'respect des personnes, sécurité émotionnelle et bonne tenue des parties. ' +
      'Le document est en cours de rédaction ; il sera publié ici.',
  },
  {
    icon: 'screen',
    name: "Le flyer de l'association",
    etat: 'Affiche',
    text:
      "L'affiche de la Guilde, à imprimer ou à faire circuler : accueil de tous " +
      'niveaux, cotisation, soirées one-shot mensuelles, créneaux des locaux et ' +
      'adresse de l’Annexe de la Maison Phare.',
    // Le fichier n'est pas encore dans le dépôt. Déposer l'affiche dans
    // `public/documents/` sous ce nom (.png, .jpg ou .pdf, au choix — le chemin
    // doit juste correspondre), puis décommenter la ligne ci-dessous : le
    // bouton « Télécharger » apparaît alors tout seul.
    // fichier: '/documents/flyer-guilde-des-songes.png',
  },
]
