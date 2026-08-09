// Gazette rôlistique : un fichier Markdown par numéro dans `src/gazette/`.
// Déposer un nouveau .md suffit — il est repéré, trié et publié automatiquement.
//
// Chaque fichier commence par un front-matter :
//   ---
//   title: Numéro 1 — La rentrée des songes
//   date: 2026-08-01
//   excerpt: Une phrase de résumé affichée dans la liste.
//   pdf: /gazette/2026-08.pdf     (optionnel)
//   ---
//
// `pdf` : si un PDF du numéro est déposé dans `public/gazette/`, le bouton
// « Télécharger le numéro » le sert directement. Sans lui, le bouton passe par
// l'impression du navigateur (« Enregistrer au format PDF »).
import { marked } from 'marked'
import { typo } from '../typographie.js'

const files = import.meta.glob('../gazette/*.md', { query: '?raw', import: 'default', eager: true })

// Front-matter minimal : `clé: valeur` ligne par ligne entre deux `---`.
function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }

  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':')
    if (sep === -1) continue
    meta[line.slice(0, sep).trim()] = line.slice(sep + 1).trim()
  }
  return { meta, body: match[2] }
}

export const issues = Object.entries(files)
  .map(([path, raw]) => {
    const { meta, body } = parseFrontMatter(raw)
    return {
      // Le nom du fichier sert d'URL : `2026-08-gazette.md` → /gazette/2026-08-gazette
      slug: path.split('/').pop().replace(/\.md$/, ''),
      title: meta.title || 'Numéro sans titre',
      date: meta.date || '',
      excerpt: meta.excerpt || '',
      pdf: meta.pdf || '',
      // Typographie appliquée au texte seul : les balises restent intactes.
      html: marked
        .parse(body)
        .split(/(<[^>]*>)/)
        .map((morceau) => (morceau.startsWith('<') ? morceau : typo(morceau)))
        .join(''),
    }
  })
  // Plus récent en premier
  .sort((a, b) => b.date.localeCompare(a.date))

export function findIssue(slug) {
  return issues.find((issue) => issue.slug === slug)
}
