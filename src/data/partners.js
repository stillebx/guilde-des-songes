// Partenaires de la Guilde. Ajouter une entrée ici l'affiche sur la page Partenaires.
// La carte se lit : nom, puis adresse, puis courte description.
// `href` et `perk` sont optionnels (sans `href`, la carte n'est pas cliquable).
//
// Dans `text`, un `\n` force un retour à la ligne : la deuxième phrase part
// ainsi à la ligne plutôt que de s'accrocher à la fin de la première.
export const partners = [
  {
    icon: 'house',
    name: 'La Maison Phare',
    address: '1 allée du Roussillon, 21000 Dijon',
    text: "L'Annexe de la Maison Phare héberge les locaux de la Guilde.\nC'est ici que se tiennent la plupart des parties et des événements.",
    href: 'https://lamaisonphare.fr/',
  },
  {
    icon: 'pin',
    name: 'Espace Baudelaire',
    address: '27 avenue Charles Baudelaire, 21000 Dijon',
    text: "L'Espace accueille la Guilde chaque semaine.\nC'est aussi le lieu mensuel de nos soirées One Shot.",
    href: 'https://www.espacebaudelaire.fr/',
  },
  {
    icon: 'pawn',
    name: 'Jocade',
    address: '17 rue Piron, 21000 Dijon',
    text: "Jocade est un magasin de jeux de société indépendant.\nL'accueil y est chaleureux et tout le monde y trouve son bonheur.",
    perk: '−10 % pour les adhérent·es',
    href: 'https://boutique.jocade.net/',
  },
  {
    icon: 'beer',
    name: 'La Clepsydre',
    address: '6 boulevard de la Trémouille, 21000 Dijon',
    text: "La Clepsydre est un bar à jeux où la consommation permet de s'amuser dans un endroit cosy et convivial.",
    href: 'http://laclepsydre.fr/',
  },
  {
    icon: 'dice',
    name: 'Ludimania',
    address: 'Espace Tabourot des Accords, 21850 Saint-Apollinaire',
    text: "Ludimania est le festival de jeu de Saint-Apollinaire, près de Dijon.\nDeux jours gratuits chaque année, avec éditeurs et animations.",
    href: 'https://ludimania.fr/',
  },
  {
    // Ni boutique ni lieu : un duo d'auteurs. La ligne d'adresse dit la ville,
    // sans rue — c'est ce qui les rattache à la Guilde.
    icon: 'book',
    name: 'Tales of C.',
    address: 'Dijon',
    text: "Tales of C. est un duo d'auteurs dijonnais de scénarios lovecraftiens.\nLeurs textes sont ancrés dans l'Histoire, et leurs PDF en accès libre.",
    href: 'https://talesofc.fr/',
  },
]
