// Agenda des parties. Pour ajouter une partie : une entrée ici, la plus proche en premier.
//
// date    : format ISO (YYYY-MM-DD) — sert au tri et au filtrage des parties passées.
// time    : horaire libre affiché tel quel.
// kind    : 'one-shot' | 'campagne' | 'solo' — pilote la pastille de type.
// signup  : lien du salon Discord de la partie — le bouton « S'inscrire » y renvoie,
//           c'est là que le MJ annonce sa table et valide les joueur·ses.
//           Sans `signup` ni `form`, la carte est marquée « Table fermée ».
// form    : `true` pour les soirées one-shot mensuelles, ouvertes à tout le monde :
//           le bouton déplie un formulaire (pseudo Discord), sans validation d'un MJ.
// seats   : texte libre sur les places (optionnel), ex. '4 places'.
export const events = [
  // Soirées one-shot mensuelles — ouvertes à tout le monde, inscription par le
  // formulaire du bloc dédié en bas de l'agenda.
  {
    date: '2026-10-10',
    time: '18h30 – 23h45',
    kind: 'one-shot',
    title: 'Soirée one-shot mensuelle',
    game: 'Jeux variés',
    place: 'Espace Baudelaire',
    text: "Une histoire complète en une soirée, ouverte à tout le monde : aucune expérience requise, tout le matériel est fourni.",
    form: true,
  },
  {
    date: '2026-11-21',
    time: '18h30 – 23h45',
    kind: 'one-shot',
    title: 'Soirée one-shot mensuelle',
    game: 'Jeux variés',
    place: 'Espace Baudelaire',
    text: "Une histoire complète en une soirée, ouverte à tout le monde : aucune expérience requise, tout le matériel est fourni.",
    form: true,
  },
  {
    date: '2026-12-12',
    time: '18h30 – 23h45',
    kind: 'one-shot',
    title: 'Soirée one-shot mensuelle',
    game: 'Jeux variés',
    place: 'Espace Baudelaire',
    text: "Une histoire complète en une soirée, ouverte à tout le monde : aucune expérience requise, tout le matériel est fourni.",
    form: true,
  },
  {
    date: '2026-09-12',
    time: '20h00',
    kind: 'campagne',
    title: 'Campagne L5R — séance 4',
    game: 'La Légende des Cinq Anneaux',
    place: 'Annexe Maison Phare',
    gm: 'MJ : à préciser',
    text: 'Table fermée : la campagne suit son cours avec les mêmes joueur·ses.',
  },
  {
    date: '2026-09-19',
    time: '20h00',
    kind: 'one-shot',
    title: 'One-shot Warhammer',
    game: 'Warhammer Fantasy',
    place: 'Espace Baudelaire',
    gm: 'MJ : à préciser',
    seats: '4 places',
    text: "Une histoire complète en une soirée dans le Vieux Monde. Aucune connaissance de l'univers requise.",
    signup: 'https://discord.gg/F8aghJ2Mpv',
  },
]

export const KIND_LABELS = {
  'one-shot': 'One-shot',
  campagne: 'Campagne',
  solo: 'Partie solo',
}
