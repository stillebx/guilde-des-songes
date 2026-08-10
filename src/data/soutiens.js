// Collectivités qui soutiennent la Guilde : leurs logos apparaissent en discret
// au bas du pied de page.
//
// Pour ajouter un soutien : déposer son logo dans `public/soutiens/`, puis
// décommenter (ou ajouter) son entrée ici. Une liste vide n'affiche pas la ligne
// du tout — c'est l'état actuel, tant que les fichiers ne sont pas là.
//   src      : chemin depuis la racine du site (le build ajoute le sous-dossier).
//   alt      : nom de la collectivité — lu par les lecteurs d'écran.
//   href     : site officiel (optionnel) ; sans lui, le logo n'est pas cliquable.
//   inverser : `true` pour un logo monochrome noir, illisible sur fond sombre —
//              le thème sombre l'inverse alors en blanc. À laisser de côté pour
//              un logo en couleurs, que l'inversion abîmerait.
// Les deux fichiers viennent des chartes graphiques officielles, en version
// monochrome noire : cotedor.fr/charte-graphique et dijon.fr/pack-logos-ville-de-dijon.
export const soutiens = [
  {
    src: '/soutiens/cote-dor.png',
    alt: "Département de la Côte-d'Or",
    href: 'https://www.cotedor.fr/',
    inverser: true,
  },
  {
    src: '/soutiens/ville-de-dijon.png',
    alt: 'Ville de Dijon',
    href: 'https://www.dijon.fr/',
    inverser: true,
  },
]
