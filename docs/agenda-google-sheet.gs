/**
 * Agenda et inscriptions de la Guilde → Google Sheets
 * ===================================================
 *
 * LES ONGLETS
 * -----------
 * • « Événements »      : parties classiques (campagne, one-shot) et
 *                         événements hors partie (assemblée, atelier, festival…).
 * • « OS mensuelles »   : les soirées one-shot mensuelles.
 * • « Inscriptions OS » : inscriptions aux soirées mensuelles.
 * • « Inscriptions événements » : inscriptions aux lignes de l'onglet
 *                         « Événements ».
 * • « Archives »        : trace des dates passées — l'événement ou la soirée,
 *                         groupé par type puis par date. Pas les inscriptions.
 *
 * OUVRIR (ET FERMER) LES INSCRIPTIONS
 * -----------------------------------
 * Tout se joue dans la colonne « Places » des deux onglets d'agenda. Elle
 * propose une liste déroulante, sans interdire d'y taper autre chose :
 * • vide       : ni formulaire ni compteur sur le site, aucune ligne créée.
 * • un nombre  : inscriptions ouvertes ; le site décompte les places restantes
 *                et bascule tout seul sur « Complet » au dernier inscrit.
 * • « Complet » : inscriptions fermées à la main. Le site affiche « Complet »
 *                sans compteur, et refuse toute nouvelle inscription — utile
 *                pour une table remplie hors du site (sur place, au Discord).
 * La liste propose « Complet » et les quotas courants (2 à 12) ; n'importe quel
 * autre nombre reste accepté, Google se contente d'un avertissement.
 *
 * CE QUI SE RANGE TOUT SEUL
 * -------------------------
 * • Colonne « Statut » (K) de l'onglet « Événements » : « à venir » ou
 *   « terminé », calculé depuis la date. C'est une formule : elle se recalcule
 *   à l'ouverture du classeur, et ne part jamais sur le site.
 * • Chaque nuit (et par le menu « Guilde › Ranger »), le script :
 *   – reconstruit « Archives » à partir des lignes terminées des deux onglets
 *     d'agenda, groupées par type puis par date, chaque catégorie annoncée par
 *     un bandeau gris à cellules fusionnées ;
 *   – regroupe chaque registre d'inscriptions par soirée, dans l'ordre
 *     d'arrivée (premier arrivé, premier servi), avec le même bandeau entre
 *     deux soirées, et renumérote les rangs.
 * Rien n'est déplacé ni supprimé : les parties passées restent dans leur onglet
 * (le calendrier du site les affiche en pastilles grisées) et les inscriptions
 * restent dans leur registre — « Archives » n'en garde que le nombre.
 *
 * SAISIE À PLUSIEURS
 * ------------------
 * • La colonne « Type » est une liste déroulante : aucune faute possible.
 * • Chaque ligne se colore automatiquement selon son type, avec les mêmes
 *   couleurs que le site : la feuille se lit d'un coup d'œil.
 * • « Date » n'accepte qu'une vraie date ; « Places » se choisit dans une liste.
 * • Chaque en-tête porte une note d'aide au survol.
 * • Tout ce qui est tapé est corrigé à la validation : « 20h » → « 20h00 »,
 *   « 10/10/2026 » → « 2026-10-10 », espaces superflus retirés (voir `onEdit`).
 * • Une cellule laissée vide n'est jamais un problème : le site n'affiche tout
 *   simplement pas l'information, sans blanc ni « à préciser ».
 *
 * MISE EN PLACE (une seule fois)
 * ------------------------------
 * 1. Extensions › Apps Script. Effacez l'éditeur, collez ce fichier, Enregistrer.
 * 2. Choisissez `initialiser` dans la liste de la barre d'outils, puis Exécuter.
 *    Autorisez l'accès quand Google le demande.
 * 3. Déployer › Nouveau déploiement : Application Web, exécuter en tant que Moi,
 *    accès Tout le monde. Copiez l'URL (elle finit par /exec) et collez-la dans
 *    SHEET_ENDPOINT, en haut de src/data/sheet.js.
 *
 * Après toute modification de ce script : Déployer › Gérer les déploiements ›
 * Modifier › Nouvelle version. (`initialiser` et `onEdit` sont actifs dès
 * l'enregistrement, sans redéploiement.)
 *
 * VENANT D'UNE VERSION PRÉCÉDENTE
 * -------------------------------
 * L'ancien script déplaçait les inscriptions passées dans « Archives ». Le
 * nouvel onglet ne contient plus que les parties, et il est reconstruit à
 * chaque passage. `initialiser` met donc l'ancien de côté sous le nom
 * « Archives (inscriptions, AAAA-MM-JJ) » : rien n'est perdu, et vous pouvez le
 * supprimer une fois vérifié.
 */

const ONGLET_EVENEMENTS = 'Événements'
const ONGLET_MENSUELLES = 'OS mensuelles'
const ONGLET_INSCRIPTIONS_OS = 'Inscriptions OS'
const ONGLET_INSCRIPTIONS_EVENEMENTS = 'Inscriptions événements'
const ONGLET_ARCHIVES = 'Archives'

// Types de l'onglet « Événements ». Les soirées mensuelles ont leur propre
// onglet : elles ne figurent pas dans cette liste.
const TYPES = ['campagne', 'one-shot', 'événement']

// Code couleur du site : trait de la ligne, et fond très clair pour la lisibilité.
const COULEURS = {
  campagne: { trait: '#7c1226', fond: '#f3dfe4' },
  'one-shot': { trait: '#b01e33', fond: '#f9e3e6' },
  'événement': { trait: '#6f5566', fond: '#eee7ec' },
  mensuelle: { trait: '#d4586d', fond: '#fce7eb' },
}

// Colonne « Places ». La liste déroulante propose « Complet » et les quotas
// courants, mais la validation accepte n'importe quel autre nombre : la liste
// rend le geste rapide, elle ne l'enferme pas.
// Gris des bandeaux de séparation et des lignes déjà passées.
const GRIS_FOND = '#e7e2e2'
const GRIS_TRAIT = '#6b5b5e'

// Colonne « Statut » de l'onglet « Événements » : calculée, jamais publiée.
const STATUT_TERMINE = 'terminé'
const STATUT_A_VENIR = 'à venir'

const PLACES_COMPLET = 'Complet'
// Des chaînes, jamais des nombres : `requireValueInList` attend un tableau de
// chaînes. Le site lit indifféremment « 6 » et 6.
const PLACES_CHOIX = [PLACES_COMPLET, '2', '3', '4', '5', '6', '7', '8', '10', '12']

const AIDE_PLACES =
  'Vide = ni formulaire ni compteur sur le site. Un nombre = places ouvertes, ' +
  'le site décompte ce qu\'il reste. « Complet » = inscriptions fermées, le site ' +
  'affiche « Complet ». La liste déroulante n\'empêche pas de taper un autre nombre.'

const COLONNES_EVENEMENTS = [
  { nom: 'Date', largeur: 110, aide: "Date de la partie. Tapez 10/10/2026 : la colonne l'affiche en 2026-10-10." },
  { nom: 'Horaire', largeur: 130, aide: 'Ex. 20h00, ou 18h30 – 23h45. « 20h » et « 20:00 » sont corrigés tout seuls. Peut rester vide.' },
  { nom: 'Type', largeur: 120, aide: 'Liste déroulante. « événement » = hors partie (assemblée, atelier, festival…).' },
  { nom: 'Titre', largeur: 240, aide: 'Nom affiché sur la vignette du site.' },
  { nom: 'Jeu', largeur: 170, aide: 'Système ou univers. Laissez vide pour un événement hors partie.' },
  { nom: 'Lieu', largeur: 170, aide: 'Ex. « Espace Baudelaire ». Peut rester vide.' },
  { nom: 'MJ', largeur: 140, aide: 'Ex. « MJ : Marc ». Peut rester vide.' },
  { nom: 'Description', largeur: 380, aide: 'Deux ou trois phrases, affichées quand on ouvre la ligne sur le site.' },
  { nom: 'Places', largeur: 90, aide: AIDE_PLACES },
  { nom: 'Lien Discord', largeur: 240, aide: 'Salon de la partie : le bouton « S’inscrire » du site y renvoie. Utilisé seulement si « Places » est vide.' },
  {
    nom: 'Statut',
    largeur: 90,
    aide:
      'Calculé tout seul à partir de la date : « à venir » ou « terminé ». ' +
      'Colonne de travail, jamais publiée sur le site. Ne rien y écrire : la ' +
      'formule serait perdue (relancez « initialiser » pour la remettre).',
  },
]

const COLONNES_MENSUELLES = [
  { nom: 'Date', largeur: 110, aide: "Date de la soirée. Tapez 10/10/2026 : la colonne l'affiche en 2026-10-10." },
  { nom: 'Horaire', largeur: 140, aide: 'Ex. 18h30 – 23h45.' },
  { nom: 'Titre', largeur: 240, aide: 'Ex. « Soirée one-shot mensuelle ».' },
  { nom: 'Jeux', largeur: 170, aide: 'Jeux proposés ce soir-là. Ex. « Jeux variés ». Peut rester vide.' },
  { nom: 'Lieu', largeur: 170, aide: 'Ex. « Espace Baudelaire ».' },
  { nom: 'MJ', largeur: 140, aide: 'Peut rester vide.' },
  { nom: 'Description', largeur: 380, aide: 'Présentation de la soirée sur le site.' },
  { nom: 'Places', largeur: 90, aide: AIDE_PLACES },
]

// L'onglet « Archives » garde la trace des dates passées : l'événement ou la
// soirée, jamais le détail des inscriptions — celui-ci reste dans son registre.
const COLONNES_ARCHIVES = [
  { nom: 'Type', largeur: 130, aide: 'Campagne, one-shot, événement ou soirée mensuelle.' },
  { nom: 'Date', largeur: 110, aide: 'Date à laquelle la partie a eu lieu.' },
  { nom: 'Horaire', largeur: 130, aide: 'Horaire annoncé.' },
  { nom: 'Titre', largeur: 240, aide: 'Titre de la ligne d’agenda.' },
  { nom: 'Jeu', largeur: 170, aide: 'Jeu ou univers.' },
  { nom: 'Lieu', largeur: 170, aide: 'Lieu de la partie.' },
  { nom: 'MJ', largeur: 140, aide: 'Meneur·se de jeu.' },
  { nom: 'Places', largeur: 90, aide: 'Ce qui figurait dans la colonne « Places ».' },
  {
    nom: 'Inscrit·es',
    largeur: 90,
    aide: 'Nombre d’inscriptions enregistrées. Le détail reste dans l’onglet « Inscriptions » correspondant.',
  },
  { nom: 'Description', largeur: 380, aide: 'Description telle qu’elle a été publiée.' },
]

const COLONNES_INSCRIPTIONS = [
  { nom: "Date de l'inscription", largeur: 150, aide: 'Rempli automatiquement par le site.' },
  { nom: "Heure de l'inscription", largeur: 150, aide: 'Rempli automatiquement par le site.' },
  { nom: 'Date', largeur: 140, aide: 'Date de la partie ou de l’événement concerné. Indispensable pour inscrire quelqu’un à la main.' },
  { nom: 'Intitulé', largeur: 240, aide: 'Titre exact de la ligne concernée. À remplir si deux choses ont lieu le même jour.' },
  { nom: 'Pseudo Discord', largeur: 180, aide: 'Pseudo de la personne inscrite.' },
  { nom: 'Rang', largeur: 70, aide: 'Ordre d’arrivée, calculé par le site.' },
]

/* ------------------------------------------------------------------ */
/*  Installation                                                       */
/* ------------------------------------------------------------------ */

/** À exécuter une fois : crée les trois onglets, les formats et les couleurs. */
function initialiser() {
  const classeur = SpreadsheetApp.getActiveSpreadsheet()

  const evenements = onglet(classeur, ONGLET_EVENEMENTS, COLONNES_EVENEMENTS)
  const mensuelles = onglet(classeur, ONGLET_MENSUELLES, COLONNES_MENSUELLES)
  const inscriptionsOS = onglet(classeur, ONGLET_INSCRIPTIONS_OS, COLONNES_INSCRIPTIONS)
  const inscriptionsEv = onglet(classeur, ONGLET_INSCRIPTIONS_EVENEMENTS, COLONNES_INSCRIPTIONS)
  mettreDeCoteAnciennesArchives(classeur)
  const archives = onglet(classeur, ONGLET_ARCHIVES, COLONNES_ARCHIVES)

  reglerEvenements(evenements)
  reglerMensuelles(mensuelles)
  colonneDate(inscriptionsOS, 3)
  colonneDate(inscriptionsEv, 3)
  colonneDate(archives, 2)

  installerArchivageQuotidien()

  if (evenements.getLastRow() < 2) {
    evenements.appendRow([
      '2026-09-19',
      '20h00',
      'one-shot',
      'One-shot Warhammer',
      'Warhammer Fantasy',
      'Espace Baudelaire',
      '',
      "Une histoire complète en une soirée dans le Vieux Monde. Aucune connaissance de l'univers requise.",
      '',
      '',
      '',
    ])
  }

  if (mensuelles.getLastRow() < 2) {
    mensuelles.appendRow([
      '2026-10-10',
      '18h30 – 23h45',
      'Soirée one-shot mensuelle',
      'Jeux variés',
      'Espace Baudelaire',
      '',
      'Une histoire complète en une soirée, ouverte à tout le monde : aucune expérience requise, tout le matériel est fourni.',
      12,
    ])
  }
}

/**
 * L'ancien script déplaçait les inscriptions passées dans « Archives ». Le
 * nouvel onglet, lui, est reconstruit à chaque passage : il écraserait ces
 * lignes, qui ne se trouvent alors plus nulle part. On renomme donc l'ancien
 * onglet au lieu de le vider — rien n'est perdu, et la feuille repart propre.
 */
function mettreDeCoteAnciennesArchives(classeur) {
  const feuille = classeur.getSheetByName(ONGLET_ARCHIVES)
  if (!feuille || feuille.getLastRow() < 2) return

  const premiere = texte(feuille.getRange(1, 1, 1, 1).getValues()[0][0])
  if (cleEntete(premiere) !== cleEntete(COLONNES_INSCRIPTIONS[0].nom)) return

  const horodatage = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')
  feuille.setName(`Archives (inscriptions, ${horodatage})`)
}

function onglet(classeur, nom, colonnes) {
  let feuille = classeur.getSheetByName(nom)
  if (!feuille) {
    feuille = classeur.insertSheet(nom)
    feuille.appendRow(colonnes.map((c) => c.nom))
  }

  const entete = feuille.getRange(1, 1, 1, colonnes.length)
  entete.setValues([colonnes.map((c) => c.nom)])
  entete.setFontWeight('bold').setBackground('#f4eeee').setNotes([colonnes.map((c) => c.aide)])
  feuille.setFrozenRows(1)
  colonnes.forEach((c, i) => feuille.setColumnWidth(i + 1, c.largeur))

  return feuille
}

function nbLignes(feuille) {
  return Math.max(feuille.getMaxRows() - 1, 500)
}

function colonneDate(feuille, colonne) {
  feuille
    .getRange(2, colonne, nbLignes(feuille), 1)
    .setNumberFormat('yyyy-mm-dd')
    .setHorizontalAlignment('left')
}

/**
 * Colonne « Places » : liste déroulante « Complet » + quotas courants, ouverte
 * à la saisie libre (`setAllowInvalid(true)`), sans quoi taper 9 ou 20 serait
 * refusé. Google affiche un simple avertissement sur une valeur hors liste ;
 * le site, lui, comprend indifféremment un nombre ou « Complet ».
 */
function colonnePlaces(feuille, colonne, lignes) {
  feuille
    .getRange(2, colonne, lignes, 1)
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(PLACES_CHOIX, true)
        .setAllowInvalid(true)
        .setHelpText(AIDE_PLACES)
        .build(),
    )
    .setHorizontalAlignment('left')
}

/**
 * Colonne « Statut » : « à venir » ou « terminé », selon la date de la ligne.
 * C'est une formule, pas une valeur écrite par le script : elle se recalcule
 * toute seule à chaque ouverture du classeur, sans attendre l'archivage de la
 * nuit. Une ligne sans date reste vide plutôt que d'annoncer « terminé ».
 *
 * La formule s'écrit en anglais quelle que soit la langue du classeur : Google
 * l'affiche traduite (`IF` → `SI`, `TODAY` → `AUJOURDHUI`).
 */
function colonneStatut(feuille, colonne, lignes) {
  // RC1 = la colonne A de la même ligne : une seule formule pour toute la
  // colonne, que Google recale ligne par ligne.
  const formule = `=IF(RC1="","",IF(RC1<TODAY(),"${STATUT_TERMINE}","${STATUT_A_VENIR}"))`

  feuille
    .getRange(2, colonne, lignes, 1)
    .setFormulaR1C1(formule)
    .setHorizontalAlignment('left')
}

function reglerEvenements(feuille) {
  const lignes = nbLignes(feuille)
  colonneDate(feuille, 1)

  feuille
    .getRange(2, 3, lignes, 1)
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(TYPES, true)
        .setAllowInvalid(false)
        .setHelpText('campagne, one-shot ou événement.')
        .build(),
    )

  colonnePlaces(feuille, 9, lignes)
  colonneStatut(feuille, 11, lignes)

  feuille.getRange(2, 8, lignes, 1).setWrap(true)

  // Chaque ligne prend la couleur de son type — même code que sur le site.
  const zone = feuille.getRange(2, 1, lignes, COLONNES_EVENEMENTS.length)
  const regles = TYPES.map((type) =>
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=$C2="${type}"`)
      .setBackground(COULEURS[type].fond)
      .setFontColor(COULEURS[type].trait)
      .setRanges([zone])
      .build(),
  )

  // Une ligne passée s'efface visuellement : elle reste lisible, mais ne tire
  // plus l'œil au milieu des dates à venir. Règle posée après celles des types,
  // donc prioritaire sur la couleur de fond.
  regles.unshift(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=$K2="${STATUT_TERMINE}"`)
      .setBackground(GRIS_FOND)
      .setFontColor(GRIS_TRAIT)
      .setItalic(true)
      .setRanges([zone])
      .build(),
  )

  feuille.setConditionalFormatRules(regles)
}

function reglerMensuelles(feuille) {
  const lignes = nbLignes(feuille)
  colonneDate(feuille, 1)

  colonnePlaces(feuille, 8, lignes)

  feuille.getRange(2, 7, lignes, 1).setWrap(true)

  // Onglet entier à la couleur des soirées mensuelles, dès qu'une date est là.
  const zone = feuille.getRange(2, 1, lignes, COLONNES_MENSUELLES.length)
  feuille.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$A2<>""')
      .setBackground(COULEURS.mensuelle.fond)
      .setFontColor(COULEURS.mensuelle.trait)
      .setRanges([zone])
      .build(),
  ])
}

/* ------------------------------------------------------------------ */
/*  Archivage des soirées passées                                      */
/* ------------------------------------------------------------------ */

/**
 * Remet à jour ce qui découle des dates passées. Rien n'est déplacé ni
 * supprimé : les deux onglets d'agenda gardent leur historique (le calendrier
 * du site y puise ses pastilles grisées), et les inscriptions restent dans leur
 * registre. Le travail consiste à ranger.
 *
 * 1. « Archives » est reconstruit de zéro à partir des lignes terminées des
 *    onglets « Événements » et « OS mensuelles », regroupées par type puis par
 *    date. Reconstruire plutôt qu'ajouter évite tout doublon : relancer
 *    l'archivage deux fois de suite donne exactement le même onglet.
 * 2. Chaque registre d'inscriptions est regroupé par soirée, dans l'ordre
 *    d'arrivée des inscriptions.
 *
 * Tourne chaque nuit, et à la demande par le menu « Guilde ».
 */
function archiver() {
  reconstruireArchives()
  regrouperRegistre(ONGLET_INSCRIPTIONS_OS)
  regrouperRegistre(ONGLET_INSCRIPTIONS_EVENEMENTS)
}

// Ordre des catégories dans « Archives », et intitulé de leur bandeau.
const CATEGORIES_ARCHIVES = [
  { type: 'campagne', titre: 'Campagnes' },
  { type: 'one-shot', titre: 'Soirées one-shot' },
  { type: 'événement', titre: 'Événements' },
  { type: 'mensuelle', titre: 'Soirées mensuelles' },
]

/**
 * Reconstruit l'onglet « Archives » : une ligne par date passée, groupée par
 * catégorie. Le détail des inscriptions n'y figure pas — seulement leur
 * nombre ; les noms restent dans l'onglet « Inscriptions » correspondant.
 */
function reconstruireArchives() {
  const classeur = SpreadsheetApp.getActiveSpreadsheet()
  const archives = onglet(classeur, ONGLET_ARCHIVES, COLONNES_ARCHIVES)
  const aujourdhui = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')

  const inscriptionsEv = lignes(ONGLET_INSCRIPTIONS_EVENEMENTS)
  const inscriptionsOS = lignes(ONGLET_INSCRIPTIONS_OS)

  const passees = []

  lignes(ONGLET_EVENEMENTS).forEach(function (l) {
    const date = versDateIso(champ(l, 'Date'))
    const titre = texte(champ(l, 'Titre'))
    if (!date || !titre || !estTerminee(l, date, aujourdhui)) return

    passees.push([
      normaliserType(champ(l, 'Type') || ''),
      date,
      normaliserHoraire(champ(l, 'Horaire') || ''),
      titre,
      texte(champ(l, 'Jeu')),
      texte(champ(l, 'Lieu')),
      texte(champ(l, 'MJ')),
      texte(champ(l, 'Places')),
      compterInscrits(inscriptionsEv, date, titre),
      texte(champ(l, 'Description')),
    ])
  })

  lignes(ONGLET_MENSUELLES).forEach(function (l) {
    const date = versDateIso(champ(l, 'Date'))
    const titre = texte(champ(l, 'Titre'))
    if (!date || !titre || date >= aujourdhui) return

    passees.push([
      'mensuelle',
      date,
      normaliserHoraire(champ(l, 'Horaire') || ''),
      titre,
      texte(champ(l, 'Jeux')),
      texte(champ(l, 'Lieu')),
      texte(champ(l, 'MJ')),
      texte(champ(l, 'Places')),
      compterInscrits(inscriptionsOS, date, titre),
      texte(champ(l, 'Description')),
    ])
  })

  viderSous(archives, COLONNES_ARCHIVES.length)

  CATEGORIES_ARCHIVES.forEach(function (categorie) {
    // Plus récent en premier : on cherche presque toujours la dernière fois.
    const bloc = passees
      .filter((ligne) => ligne[0] === categorie.type)
      .sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0))

    if (!bloc.length) return

    bandeau(archives, `${categorie.titre} — ${bloc.length}`, COLONNES_ARCHIVES.length)
    garantirLignes(archives, archives.getLastRow() + bloc.length)
    archives.getRange(archives.getLastRow() + 1, 1, bloc.length, COLONNES_ARCHIVES.length).setValues(bloc)
  })

  colonneDate(archives, 2)
  archives.getRange(2, 10, nbLignes(archives), 1).setWrap(true)
}

/**
 * Range un registre d'inscriptions : un bloc par soirée (même date, même
 * intitulé), les blocs du plus ancien au plus récent, et à l'intérieur les
 * inscriptions dans leur ordre d'arrivée — premier arrivé, premier servi.
 * Le rang est renuméroté pour coller à cet ordre.
 *
 * Les bandeaux d'une exécution précédente sont relus comme tels et refaits :
 * la fonction peut tourner autant de fois qu'on veut.
 */
function regrouperRegistre(nomOnglet) {
  const classeur = SpreadsheetApp.getActiveSpreadsheet()
  const feuille = classeur.getSheetByName(nomOnglet)
  if (!feuille || feuille.getLastRow() < 2) return

  const inscriptions = lignes(nomOnglet).filter(function (i) {
    if (estBandeau(champ(i, "Date de l'inscription"))) return false
    return versDateIso(champ(i, 'Date')) || texte(champ(i, 'Pseudo Discord'))
  })

  if (!inscriptions.length) return

  // Une soirée = une date + un intitulé. Les deux registres peuvent contenir
  // deux lignes le même jour : l'intitulé les distingue.
  const blocs = {}
  const ordre = []

  inscriptions.forEach(function (i) {
    const date = versDateIso(champ(i, 'Date'))
    const intitule = texte(champ(i, 'Intitulé'))
    const cle = `${date}\u0000${intitule.toLowerCase()}`

    if (!blocs[cle]) {
      blocs[cle] = { date: date, intitule: intitule, lignes: [] }
      ordre.push(cle)
    }
    blocs[cle].lignes.push(i)
  })

  ordre.sort(function (a, b) {
    return blocs[a].date < blocs[b].date ? -1 : blocs[a].date > blocs[b].date ? 1 : 0
  })

  viderSous(feuille, COLONNES_INSCRIPTIONS.length)

  ordre.forEach(function (cle) {
    const bloc = blocs[cle]
    const rangees = bloc.lignes
      .slice()
      .sort((a, b) => (horodatage(a) < horodatage(b) ? -1 : horodatage(a) > horodatage(b) ? 1 : 0))
      .map((i, index) => [
        texte(champ(i, "Date de l'inscription")),
        texte(champ(i, "Heure de l'inscription")),
        bloc.date,
        bloc.intitule,
        texte(champ(i, 'Pseudo Discord')),
        index + 1,
      ])

    const nom = bloc.intitule || 'Sans intitulé'
    bandeau(
      feuille,
      `${nom} — ${bloc.date} — ${rangees.length} inscrit·e${rangees.length > 1 ? 's' : ''}`,
      COLONNES_INSCRIPTIONS.length,
    )
    garantirLignes(feuille, feuille.getLastRow() + rangees.length)
    feuille.getRange(feuille.getLastRow() + 1, 1, rangees.length, COLONNES_INSCRIPTIONS.length).setValues(rangees)
  })

  colonneDate(feuille, 3)
}

/** Date + heure d'inscription, en une clé triable. Une ligne saisie à la main
 *  sans horodatage passe en fin de bloc plutôt qu'en tête. */
function horodatage(inscription) {
  const jour = versDateIso(champ(inscription, "Date de l'inscription")) || '9999-12-31'
  const heure = texte(champ(inscription, "Heure de l'inscription")) || '99:99:99'
  return `${jour} ${heure}`
}

/** Ligne de séparation : cellules fusionnées, fond gris, texte en gras. */
function bandeau(feuille, intitule, nbColonnes) {
  feuille.appendRow([intitule])

  feuille
    .getRange(feuille.getLastRow(), 1, 1, nbColonnes)
    .merge()
    .setBackground(GRIS_FOND)
    .setFontColor(GRIS_TRAIT)
    .setFontWeight('bold')
    .setHorizontalAlignment('left')
}

/**
 * Reconnaît une ligne de séparation — bandeau d'un passage précédent, ou
 * ancienne ligne « — complet — ». Le tiret cadratin ne se tape pas par accident
 * dans une colonne de date ou de pseudo : il suffit à les distinguer.
 */
function estBandeau(valeur) {
  return texte(valeur).indexOf('—') !== -1
}

/** Ajoute des lignes à la feuille si le bloc à écrire dépasse sa hauteur. */
function garantirLignes(feuille, jusqua) {
  const manquantes = jusqua - feuille.getMaxRows()
  if (manquantes > 0) feuille.insertRowsAfter(feuille.getMaxRows(), manquantes)
}

/** Vide tout ce qui suit l'en-tête, fusions comprises. */
function viderSous(feuille, nbColonnes) {
  const hauteur = feuille.getMaxRows() - 1
  if (hauteur < 1) return

  const zone = feuille.getRange(2, 1, hauteur, nbColonnes)
  zone.breakApart()
  zone.clearContent().clearFormat()
}

/**
 * Ligne d'agenda déjà passée ? On lit d'abord la colonne « Statut », remplie
 * par formule ; si elle manque (feuille ancienne, colonne effacée), la date
 * tranche seule.
 */
function estTerminee(ligne, date, aujourdhui) {
  const statut = simplifier(champ(ligne, 'Statut'))
  if (statut) return statut === simplifier(STATUT_TERMINE)
  return date < aujourdhui
}

/** Programme l'archivage chaque nuit, sans doublonner le déclencheur. */
function installerArchivageQuotidien() {
  ScriptApp.getProjectTriggers().forEach(function (declencheur) {
    if (declencheur.getHandlerFunction() === 'archiver') ScriptApp.deleteTrigger(declencheur)
  })
  ScriptApp.newTrigger('archiver').timeBased().everyDays(1).atHour(4).create()
}

/** Menu « Guilde » dans la feuille, pour archiver à la demande. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Guilde')
    .addItem('Ranger : archives et inscriptions', 'archiver')
    .addToUi()
}

/* ------------------------------------------------------------------ */
/*  Correction automatique à la saisie                                 */
/* ------------------------------------------------------------------ */

/** Déclencheur simple : rien à installer, actif dès l'enregistrement. */
function onEdit(e) {
  const feuille = e.range.getSheet()
  const nom = feuille.getName()
  if (e.range.getRow() === 1) return

  const colonne = e.range.getColumn()
  const valeur = e.range.getValue()
  if (valeur === '' || valeur === null) return

  if (nom === ONGLET_EVENEMENTS) {
    if (colonne === 1) return ecrire(e.range, versDateIso(valeur))
    if (colonne === 2) return ecrire(e.range, normaliserHoraire(valeur))
    if (colonne === 3) return ecrire(e.range, normaliserType(valeur))
    if (colonne === 9) return ecrire(e.range, normaliserPlaces(valeur))
    if ([4, 5, 6, 7, 8, 10].includes(colonne)) return ecrire(e.range, String(valeur).trim())
  }

  if (nom === ONGLET_MENSUELLES) {
    if (colonne === 1) return ecrire(e.range, versDateIso(valeur))
    if (colonne === 2) return ecrire(e.range, normaliserHoraire(valeur))
    if (colonne === 8) return ecrire(e.range, normaliserPlaces(valeur))
    if ([3, 4, 5, 6, 7].includes(colonne)) return ecrire(e.range, String(valeur).trim())
  }

  if (nom === ONGLET_INSCRIPTIONS_OS || nom === ONGLET_INSCRIPTIONS_EVENEMENTS) {
    if (colonne === 3) return ecrire(e.range, versDateIso(valeur))
    if ([4, 5].includes(colonne)) return ecrire(e.range, String(valeur).trim())
  }
}

function ecrire(cellule, valeur) {
  if (String(cellule.getValue()) !== String(valeur)) cellule.setValue(valeur)
}

/** Sans accents ni majuscules : sert à reconnaître les variantes de saisie. */
function simplifier(texte) {
  return String(texte)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Cellule « Places » → ce que le site attend : un nombre de places, et le
 * drapeau « complet ». Trois cas seulement :
 *   vide (ou 0)  → { places: 0, complet: false }  : ni formulaire ni compteur
 *   un nombre    → { places: n, complet: false }  : inscriptions ouvertes
 *   « Complet »  → { places: 0, complet: true }   : fermées, et le site le dit
 * « COMPLET », « complet !» sont reconnus de la même façon ; « complètement »,
 * non — ce n'est pas le mot.
 */
function placesDe(valeur) {
  // `\b` : « complet », « complet !», mais pas « complètement » ni un mot
  // qui commencerait par ces lettres.
  if (/^complet\b/.test(simplifier(valeur))) {
    return { places: 0, complet: true }
  }
  return { places: Number(valeur) || 0, complet: false }
}

/** « complet », « COMPLET !», « Complet » → « Complet ». Le reste est inchangé. */
function normaliserPlaces(valeur) {
  return placesDe(valeur).complet ? PLACES_COMPLET : valeur
}

/** « One Shot », « oneshot », « OS », « evenement » → un type de la liste. */
function normaliserType(valeur) {
  const t = simplifier(valeur).replace(/[\s_]+/g, '-')

  if (/^campagne/.test(t)) return 'campagne'
  // La Guilde ne propose plus de partie solo : une ligne restée sur ce type
  // retombe sur « one-shot » (défaut ci-dessous), que le site sait nommer.
  if (/^(evenement|event)/.test(t)) return 'événement'
  if (/^(one-shot|oneshot|os)$/.test(t)) return 'one-shot'
  return TYPES.indexOf(t) !== -1 ? t : 'one-shot'
}

/**
 * « 20h », « 20:00 », « 20 h 00 » → « 20h00 ».
 * « 18h30-23h45 », « 18:30 à 23:45 » → « 18h30 – 23h45 ».
 */
function normaliserHoraire(valeur) {
  if (valeur instanceof Date) {
    const fuseau = Session.getScriptTimeZone()
    return Utilities.formatDate(valeur, fuseau, 'HH') + 'h' + Utilities.formatDate(valeur, fuseau, 'mm')
  }

  const texte = String(valeur).trim()
  const heures = texte.match(/(\d{1,2})\s*[h:]\s*(\d{2})?/g)
  if (!heures) return texte

  const formatees = heures.map((h) => {
    const m = h.match(/(\d{1,2})\s*[h:]\s*(\d{2})?/)
    return `${String(Number(m[1])).padStart(2, '0')}h${m[2] || '00'}`
  })

  return formatees.length > 1 ? `${formatees[0]} – ${formatees[1]}` : formatees[0]
}

/** Dates saisies en texte (10/10/2026) ou en date Google → AAAA-MM-JJ. */
function versDateIso(valeur) {
  if (valeur instanceof Date) {
    return Utilities.formatDate(valeur, Session.getScriptTimeZone(), 'yyyy-MM-dd')
  }

  const texte = String(valeur || '').trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(texte)) return texte

  const m = texte.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/)
  if (m) {
    const annee = m[3].length === 2 ? `20${m[3]}` : m[3]
    return `${annee}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`
  }

  return texte
}

/* ------------------------------------------------------------------ */
/*  Service lu par le site                                             */
/* ------------------------------------------------------------------ */

/**
 * Clé d'en-tête tolérante : sans accents, sans majuscules, sans pluriel.
 * « Jeux », « Jeu », « JEU » donnent tous « jeu » ; « Places » donne « place ».
 * Une colonne renommée au pluriel continue donc d'être lue.
 */
function cleEntete(nom) {
  // Pluriel retiré, en « s » comme en « x » : « jeux » → « jeu ».
  return simplifier(nom).replace(/[sx]$/, '')
}

/**
 * Lignes d'un onglet sous forme d'objets. Chaque valeur est accessible par
 * l'intitulé exact de la colonne ET par sa clé tolérante.
 */
function lignes(nomOnglet) {
  const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nomOnglet)
  if (!feuille || feuille.getLastRow() < 2) return []

  const valeurs = feuille.getDataRange().getValues()
  const entetes = valeurs[0].map((e) => String(e).trim())

  return valeurs.slice(1).map((ligne) => {
    const objet = {}
    entetes.forEach((entete, i) => {
      objet[entete] = ligne[i]
      objet[cleEntete(entete)] = ligne[i]
    })
    return objet
  })
}

/** Valeur d'une colonne, quel que soit l'accent, la casse ou le pluriel. */
function champ(ligne, nom) {
  const valeur = ligne[nom]
  return valeur === undefined ? ligne[cleEntete(nom)] : valeur
}

function texte(valeur) {
  return String(valeur === null || valeur === undefined ? '' : valeur).trim()
}

/**
 * Inscriptions correspondant à une ligne d'agenda : même date, et même intitulé
 * dès que celui-ci est renseigné — utile si deux choses ont lieu le même jour.
 */
function compterInscrits(inscriptions, date, titre) {
  return inscriptions.filter(function (i) {
    // Les bandeaux de séparation ne sont pas des inscriptions.
    if (estBandeau(champ(i, "Date de l'inscription"))) return false
    if (versDateIso(champ(i, 'Date')) !== date) return false
    const intitule = texte(champ(i, 'Intitulé'))
    return !intitule || intitule.toLowerCase() === String(titre).toLowerCase()
  }).length
}

/** Agenda complet (parties, événements, soirées mensuelles) + inscriptions. */
function doGet() {
  try {
    const inscriptionsEv = lignes(ONGLET_INSCRIPTIONS_EVENEMENTS)
    const inscriptionsOS = lignes(ONGLET_INSCRIPTIONS_OS)

    const parties = lignes(ONGLET_EVENEMENTS)
      .filter((l) => versDateIso(champ(l, 'Date')) && texte(champ(l, 'Titre')))
      .map((l) => {
        const date = versDateIso(champ(l, 'Date'))
        const titre = texte(champ(l, 'Titre'))
        const places = placesDe(champ(l, 'Places'))
        return {
          date: date,
          horaire: normaliserHoraire(champ(l, 'Horaire') || ''),
          type: normaliserType(champ(l, 'Type') || ''),
          titre: titre,
          jeu: texte(champ(l, 'Jeu')),
          lieu: texte(champ(l, 'Lieu')),
          mj: texte(champ(l, 'MJ')),
          description: texte(champ(l, 'Description')),
          places: places.places,
          complet: places.complet,
          lien: texte(champ(l, 'Lien Discord')),
          inscrits: compterInscrits(inscriptionsEv, date, titre),
        }
      })

    const mensuelles = lignes(ONGLET_MENSUELLES)
      .filter((l) => versDateIso(champ(l, 'Date')) && texte(champ(l, 'Titre')))
      .map((l) => {
        const date = versDateIso(champ(l, 'Date'))
        const places = placesDe(champ(l, 'Places'))
        return {
          date: date,
          horaire: normaliserHoraire(champ(l, 'Horaire') || ''),
          type: 'mensuelle',
          titre: texte(champ(l, 'Titre')),
          // « Jeux » pour les soirées mensuelles, « Jeu » si la feuille garde
          // l'ancien intitulé : les deux sont acceptés.
          jeu: texte(champ(l, 'Jeu')),
          lieu: texte(champ(l, 'Lieu')),
          mj: texte(champ(l, 'MJ')),
          description: texte(champ(l, 'Description')),
          places: places.places,
          complet: places.complet,
          lien: '',
          inscrits: compterInscrits(inscriptionsOS, date, texte(champ(l, 'Titre'))),
        }
      })

    return reponse({ ok: true, evenements: parties.concat(mensuelles) })
  } catch (erreur) {
    return reponse({ ok: false, erreur: String(erreur) })
  }
}

/** Enregistre une inscription à une soirée mensuelle, si elle n'est pas complète. */
function doPost(e) {
  // Un seul traitement à la fois : deux inscriptions simultanées ne peuvent pas
  // se retrouver sur la même ligne, recevoir le même rang, ni dépasser le quota.
  const verrou = LockService.getScriptLock()
  verrou.waitLock(20000)

  try {
    const donnees = JSON.parse(e.postData.contents)
    const dateSoiree = versDateIso(donnees.dateSoiree)
    const pseudo = texte(donnees.pseudo)

    if (!dateSoiree || !pseudo) {
      return reponse({ ok: false, erreur: 'inscription incomplète' })
    }

    // La ligne concernée est cherchée d'abord parmi les soirées mensuelles,
    // puis parmi les événements : chacune a son propre registre d'inscriptions.
    let titre = texte(donnees.soiree)

    let source = lignes(ONGLET_MENSUELLES).find((l) => versDateIso(champ(l, 'Date')) === dateSoiree)
    let registre = ONGLET_INSCRIPTIONS_OS

    if (!source) {
      source = lignes(ONGLET_EVENEMENTS).find(
        (l) =>
          versDateIso(champ(l, 'Date')) === dateSoiree &&
          (!titre || texte(champ(l, 'Titre')).toLowerCase() === titre.toLowerCase()),
      )
      registre = ONGLET_INSCRIPTIONS_EVENEMENTS
    }

    if (!source) return reponse({ ok: false, erreur: 'aucune ligne à cette date' })

    // C'est l'intitulé qui regroupe les inscriptions dans le registre : si le
    // site ne l'a pas transmis, on le reprend de la ligne d'agenda trouvée.
    if (!titre) titre = texte(champ(source, 'Titre'))

    const quota = placesDe(champ(source, 'Places'))

    // « Complet » posé à la main dans la feuille : on refuse comme si le quota
    // était atteint, même si le registre compte moins d'inscrits.
    if (quota.complet) return reponse({ ok: false, complet: true, restantes: 0 })

    const places = quota.places
    if (!places) return reponse({ ok: false, erreur: 'inscriptions fermées' })

    const inscrits = lignes(registre).filter(
      (i) => versDateIso(champ(i, 'Date')) === dateSoiree,
    )

    if (inscrits.length >= places) {
      return reponse({ ok: false, complet: true, restantes: 0 })
    }

    const maintenant = new Date()
    const fuseau = Session.getScriptTimeZone()
    const rang = inscrits.length + 1

    // L'onglet n'existe que si la fonction « Places » est utilisée : on le crée
    // au premier inscrit plutôt que de laisser une feuille vide.
    onglet(SpreadsheetApp.getActiveSpreadsheet(), registre, COLONNES_INSCRIPTIONS).appendRow([
      Utilities.formatDate(maintenant, fuseau, 'dd/MM/yyyy'),
      Utilities.formatDate(maintenant, fuseau, 'HH:mm:ss'),
      dateSoiree,
      titre,
      pseudo,
      rang,
    ])

    return reponse({
      ok: true,
      rang: rang,
      restantes: places ? Math.max(0, places - rang) : null,
    })
  } catch (erreur) {
    return reponse({ ok: false, erreur: String(erreur) })
  } finally {
    verrou.releaseLock()
  }
}

function reponse(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
