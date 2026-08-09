// Réseaux et contact de la Guilde — partagés entre l'entête et le pied de page.

// L'adresse de contact n'est jamais écrite en clair : ni dans le HTML livré,
// ni dans un `mailto:` du code source. Elle est recomposée à l'exécution, au
// moment où quelqu'un veut réellement écrire. Les robots collecteurs, qui
// lisent le HTML sans exécuter le JavaScript, n'ont rien à récolter.
const USER = ['laguilde', 'dessonges'].join('')
const DOMAIN = ['gmail', 'com'].join('.')

export function contactAddress() {
  return `${USER}@${DOMAIN}`
}

export function contactHref(subject = '') {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${contactAddress()}${query}`
}

export function openContact(subject = '') {
  window.location.href = contactHref(subject)
}

export const socials = [
  { icon: 'discord', label: 'Rejoindre le Discord', href: 'https://discord.gg/F8aghJ2Mpv' },
  { icon: 'instagram', label: 'Instagram @songesjdr', href: 'https://www.instagram.com/songesjdr/' },
  { icon: 'facebook', label: 'Page Facebook', href: 'https://www.facebook.com/laguildedessonges' },
  // Pas de `href` : l'adresse est assemblée au clic (voir openContact).
  { icon: 'mail', label: 'Écrire à la Guilde', mail: true },
]
