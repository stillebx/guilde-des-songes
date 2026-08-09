// Typographie française appliquée aux textes libres (feuille Google, gazette,
// données du site) : la ponctuation haute — : ; ! ? » — ne doit jamais se
// retrouver seule en début de ligne. On remplace donc l'espace qui la précède
// par une espace insécable, que le navigateur refuse de couper.
const INSECABLE = ' '

export function typo(texte) {
  return String(texte === null || texte === undefined ? '' : texte)
    .replace(/\s+([:;!?»])/g, INSECABLE + '$1')
    .replace(/(«)\s+/g, '$1' + INSECABLE)
}
