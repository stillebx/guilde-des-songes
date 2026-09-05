// Documents de la vie communautaire, listés sur la page Ressources.
//
// Même principe que la gazette : déposer le fichier dans `src/documents/`
// suffit. Vite le repère au build et le bouton « Télécharger » apparaît tout
// seul ; tant qu'il n'est pas là, la vignette annonce le document au lieu
// d'offrir un lien mort. L'extension n'a pas d'importance (.pdf, .png, .jpg…),
// seul le nom du fichier compte.
//   icon    : nom d'une icône d'IconGlyph.vue.
//   name    : titre affiché sur la vignette.
//   etat    : mention en haut de la vignette, à côté de la pastille.
//   text    : à quoi sert le document, deux ou trois phrases.
//   fichier : nom du fichier attendu dans `src/documents/`, sans son extension.
const entrees = [
  {
    icon: 'handshake',
    name: 'La charte pour de bonnes parties',
    etat: 'En préparation',
    // La mention « En préparation » et le bouton disent déjà que le document
    // s'écrit : le texte n'a plus qu'à dire ce qu'on y trouvera.
    text:
      "Ce que la Guilde attend autour de la table, joueur·ses comme meneur·ses : " +
      'respect des personnes et bonne tenue des parties.',
    fichier: 'charte-pour-de-bonnes-parties',
  },
  {
    icon: 'page',
    name: "Le flyer de l'association",
    etat: 'Affiche',
    text:
      "L'affiche de la Guilde, à imprimer ou à faire circuler : cotisation, " +
      'soirées one-shot mensuelles et créneaux des locaux.',
    fichier: 'flyer-guilde-des-songes',
  },
]

// Tout ce qui est déposé dans `src/documents/`, quelle que soit l'extension.
const fichiers = import.meta.glob('../documents/*', {
  query: '?url',
  import: 'default',
  eager: true,
})

// `flyer-guilde-des-songes` → l'URL du fichier déposé et son nom complet, ou
// rien du tout si personne ne l'a encore déposé.
function trouver(nom) {
  const entree = Object.entries(fichiers).find(([chemin]) => {
    const base = chemin.split('/').pop()
    return base.replace(/\.[^.]+$/, '') === nom
  })
  if (!entree) return {}
  return { url: entree[1], nomFichier: entree[0].split('/').pop() }
}

export const ressources = entrees.map((entree) => ({ ...entree, ...trouver(entree.fichier) }))
