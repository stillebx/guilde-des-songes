// Les parties de l'agenda viennent de la feuille Google (voir src/data/sheet.js) :
// c'est la seule source. Cette liste reste vide — une partie écrite ici
// s'afficherait le temps que la feuille réponde, puis disparaîtrait, comme si le
// site annonçait des tables qui n'existent pas.
//
// Elle sert de secours si la feuille devient injoignable : y écrire une partie
// suit la même forme qu'une ligne de la feuille.
//   date   : ISO (YYYY-MM-DD) — sert au tri et au filtrage des parties passées.
//   time   : horaire libre, affiché tel quel.
//   kind   : une clé de KIND_LABELS ci-dessous — pilote couleur et libellé.
//   places : nombre de places ; au-delà de 0, le compteur s'affiche.
//   complet: `true` pour une table fermée sans compteur — l'équivalent du
//            « Complet » de la colonne « Places » de la feuille.
//   signup : lien du salon Discord. Présent, il l'emporte sur le formulaire
//            du site : le compteur s'affiche, l'inscription se fait là-bas.
export const events = []

export const KIND_LABELS = {
  'one-shot': 'One-shot',
  campagne: 'Campagne',
  mensuelle: 'Soirée mensuelle',
  evenement: 'Événement',
}
