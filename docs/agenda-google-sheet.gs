/**
 * Agenda et inscriptions de la Guilde → Google Sheets
 * ===================================================
 *
 * LES ONGLETS
 * -----------
 * • « Événements »      : parties classiques (campagne, one-shot, solo) et
 *                         événements hors partie (assemblée, atelier, festival…).
 * • « OS mensuelles »   : les soirées one-shot mensuelles.
 * • « Inscriptions OS » : inscriptions aux soirées mensuelles.
 * • « Inscriptions événements » : inscriptions aux lignes de l'onglet
 *                         « Événements ».
 * • « Archives »        : inscriptions des dates passées, rangées par bloc.
 *
 * OUVRIR LES INSCRIPTIONS
 * -----------------------
 * Une seule règle, valable pour les deux onglets d'agenda : renseigner la
 * colonne « Places ». Le site affiche alors le formulaire et le compteur de
 * places restantes, et les inscriptions arrivent dans le registre correspondant.
 * Colonne « Places » vide : ni formulaire ni compteur, et aucune ligne créée.
 *
 * SAISIE À PLUSIEURS
 * ------------------
 * • La colonne « Type » est une liste déroulante : aucune faute possible.
 * • Chaque ligne se colore automatiquement selon son type, avec les mêmes
 *   couleurs que le site : la feuille se lit d'un coup d'œil.
 * • « Date » et « Places » n'acceptent qu'une vraie date / un entier positif.
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
 */

const ONGLET_EVENEMENTS = 'Événements'
const ONGLET_MENSUELLES = 'OS mensuelles'
const ONGLET_INSCRIPTIONS_OS = 'Inscriptions OS'
const ONGLET_INSCRIPTIONS_EVENEMENTS = 'Inscriptions événements'
const ONGLET_ARCHIVES = 'Archives'

// Types de l'onglet « Événements ». Les soirées mensuelles ont leur propre
// onglet : elles ne figurent pas dans cette liste.
const TYPES = ['campagne', 'one-shot', 'solo', 'événement']

// Code couleur du site : trait de la ligne, et fond très clair pour la lisibilité.
const COULEURS = {
  campagne: { trait: '#7c1226', fond: '#f3dfe4' },
  'one-shot': { trait: '#b01e33', fond: '#f9e3e6' },
  solo: { trait: '#9c3550', fond: '#f5e4e9' },
  'événement': { trait: '#6f5566', fond: '#eee7ec' },
  mensuelle: { trait: '#d4586d', fond: '#fce7eb' },
}

const COLONNES_EVENEMENTS = [
  { nom: 'Date', largeur: 110, aide: "Date de la partie. Tapez 10/10/2026 : la colonne l'affiche en 2026-10-10." },
  { nom: 'Horaire', largeur: 130, aide: 'Ex. 20h00, ou 18h30 – 23h45. « 20h » et « 20:00 » sont corrigés tout seuls. Peut rester vide.' },
  { nom: 'Type', largeur: 120, aide: 'Liste déroulante. « événement » = hors partie (assemblée, atelier, festival…).' },
  { nom: 'Titre', largeur: 240, aide: 'Nom affiché sur la vignette du site.' },
  { nom: 'Jeu', largeur: 170, aide: 'Système ou univers. Laissez vide pour un événement hors partie.' },
  { nom: 'Lieu', largeur: 170, aide: 'Ex. « Espace Baudelaire ». Peut rester vide.' },
  { nom: 'MJ', largeur: 140, aide: 'Ex. « MJ : Marc ». Peut rester vide.' },
  { nom: 'Description', largeur: 380, aide: 'Deux ou trois phrases, affichées quand on ouvre la ligne sur le site.' },
  { nom: 'Places', largeur: 80, aide: 'Nombre de places pour ouvrir les inscriptions sur le site. VIDE ou 0 = pas de formulaire ni de compteur affichés.' },
  { nom: 'Lien Discord', largeur: 240, aide: 'Salon de la partie : le bouton « S’inscrire » du site y renvoie. Utilisé seulement si « Places » est vide.' },
]

const COLONNES_MENSUELLES = [
  { nom: 'Date', largeur: 110, aide: "Date de la soirée. Tapez 10/10/2026 : la colonne l'affiche en 2026-10-10." },
  { nom: 'Horaire', largeur: 140, aide: 'Ex. 18h30 – 23h45.' },
  { nom: 'Titre', largeur: 240, aide: 'Ex. « Soirée one-shot mensuelle ».' },
  { nom: 'Jeux', largeur: 170, aide: 'Jeux proposés ce soir-là. Ex. « Jeux variés ». Peut rester vide.' },
  { nom: 'Lieu', largeur: 170, aide: 'Ex. « Espace Baudelaire ».' },
  { nom: 'MJ', largeur: 140, aide: 'Peut rester vide.' },
  { nom: 'Description', largeur: 380, aide: 'Présentation de la soirée sur le site.' },
  { nom: 'Places', largeur: 80, aide: 'Nombre total de places. Le site affiche ce qu’il reste et bloque quand c’est complet.' },
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
  const archives = onglet(classeur, ONGLET_ARCHIVES, COLONNES_INSCRIPTIONS)

  reglerEvenements(evenements)
  reglerMensuelles(mensuelles)
  colonneDate(inscriptionsOS, 3)
  colonneDate(inscriptionsEv, 3)
  colonneDate(archives, 3)

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

function reglerEvenements(feuille) {
  const lignes = nbLignes(feuille)
  colonneDate(feuille, 1)

  feuille
    .getRange(2, 3, lignes, 1)
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(TYPES, true)
        .setAllowInvalid(false)
        .setHelpText('campagne, one-shot, solo ou événement.')
        .build(),
    )

  feuille
    .getRange(2, 9, lignes, 1)
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireNumberGreaterThanOrEqualTo(0)
        .setAllowInvalid(false)
        .setHelpText('Nombre de places (vide ou 0 = pas d’inscription par le site).')
        .build(),
    )

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
  feuille.setConditionalFormatRules(regles)
}

function reglerMensuelles(feuille) {
  const lignes = nbLignes(feuille)
  colonneDate(feuille, 1)

  feuille
    .getRange(2, 8, lignes, 1)
    .setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireNumberGreaterThanOrEqualTo(0)
        .setAllowInvalid(false)
        .setHelpText('Nombre de places, entier positif.')
        .build(),
    )

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
 * Déplace vers l'onglet « Archives » les inscriptions dont la date est passée,
 * regroupées par soirée et séparées par un bandeau : l'onglet « Inscriptions »
 * ne contient donc que les soirées à venir.
 *
 * Les soirées elles-mêmes restent dans « OS mensuelles » et « Événements » :
 * le calendrier du site garde ainsi son historique, en pastilles grisées.
 */
function archiver() {
  archiverRegistre(ONGLET_INSCRIPTIONS_OS, 'Soirée')
  archiverRegistre(ONGLET_INSCRIPTIONS_EVENEMENTS, 'Événement')
}

function archiverRegistre(registre, intitulePrefixe) {
  const classeur = SpreadsheetApp.getActiveSpreadsheet()
  const source = classeur.getSheetByName(registre)
  if (!source || source.getLastRow() < 2) return

  const archives = onglet(classeur, ONGLET_ARCHIVES, COLONNES_INSCRIPTIONS)
  const aujourdhui = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')

  const valeurs = source.getDataRange().getValues()
  const entetes = valeurs[0]
  const colonneDateSoiree = entetes.indexOf('Date')
  if (colonneDateSoiree === -1) return

  // Regroupe les lignes passées par date de soirée, en gardant l'ordre.
  const passees = {}
  const aGarder = []

  valeurs.slice(1).forEach(function (ligne) {
    const date = versDateIso(ligne[colonneDateSoiree])
    const estFinDeSoiree = String(ligne[0]).indexOf('—') === 0

    if (date && date < aujourdhui) {
      if (!passees[date]) passees[date] = []
      if (!estFinDeSoiree) passees[date].push(ligne)
    } else {
      aGarder.push(ligne)
    }
  })

  const dates = Object.keys(passees).sort()
  if (!dates.length) return

  dates.forEach(function (date) {
    const inscrits = passees[date]
    const intitule = inscrits.length ? String(inscrits[0][3] || '') : ''

    // Bandeau de séparation entre deux soirées archivées.
    archives.appendRow([
      `— ${intitulePrefixe} du ${date}`,
      intitule,
      date,
      intitule,
      `${inscrits.length} inscrit·e${inscrits.length > 1 ? 's' : ''}`,
      '',
    ])
    archives
      .getRange(archives.getLastRow(), 1, 1, COLONNES_INSCRIPTIONS.length)
      .setBackground(COULEURS.mensuelle.trait)
      .setFontColor('#ffffff')
      .setFontWeight('bold')

    inscrits.forEach(function (ligne) {
      archives.appendRow(ligne)
    })

    archives.appendRow(['', '', '', '', '', ''])
  })

  // Réécrit l'onglet des inscriptions avec les seules soirées à venir.
  source.getRange(2, 1, source.getMaxRows() - 1, COLONNES_INSCRIPTIONS.length).clearContent().clearFormat()
  if (aGarder.length) {
    source.getRange(2, 1, aGarder.length, COLONNES_INSCRIPTIONS.length).setValues(aGarder)
  }
  colonneDate(source, 3)
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
    .addItem('Archiver les soirées passées', 'archiver')
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
    if ([4, 5, 6, 7, 8, 10].includes(colonne)) return ecrire(e.range, String(valeur).trim())
  }

  if (nom === ONGLET_MENSUELLES) {
    if (colonne === 1) return ecrire(e.range, versDateIso(valeur))
    if (colonne === 2) return ecrire(e.range, normaliserHoraire(valeur))
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

/** « One Shot », « oneshot », « OS », « evenement » → un type de la liste. */
function normaliserType(valeur) {
  const t = simplifier(valeur).replace(/[\s_]+/g, '-')

  if (/^campagne/.test(t)) return 'campagne'
  if (/^solo/.test(t)) return 'solo'
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
    // Les lignes de fin de soirée ne sont pas des inscriptions.
    if (texte(champ(i, "Date de l'inscription")).indexOf('—') === 0) return false
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
        return {
          date: date,
          horaire: normaliserHoraire(champ(l, 'Horaire') || ''),
          type: normaliserType(champ(l, 'Type') || ''),
          titre: titre,
          jeu: texte(champ(l, 'Jeu')),
          lieu: texte(champ(l, 'Lieu')),
          mj: texte(champ(l, 'MJ')),
          description: texte(champ(l, 'Description')),
          places: Number(champ(l, 'Places')) || 0,
          lien: texte(champ(l, 'Lien Discord')),
          inscrits: compterInscrits(inscriptionsEv, date, titre),
        }
      })

    const mensuelles = lignes(ONGLET_MENSUELLES)
      .filter((l) => versDateIso(champ(l, 'Date')) && texte(champ(l, 'Titre')))
      .map((l) => {
        const date = versDateIso(champ(l, 'Date'))
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
          places: Number(champ(l, 'Places')) || 0,
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
    const titre = texte(donnees.soiree)

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

    const places = Number(champ(source, 'Places')) || 0
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

    // Quota atteint : on referme le bloc par une ligne de fin. Les inscriptions
    // de la soirée suivante repartent donc visuellement d'un rang 1 (le rang est
    // de toute façon calculé par soirée, jamais en continu sur l'année).
    if (rang >= places) {
      ligneDeFin(registre, dateSoiree, titre, places)
    }

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

/** Barre de séparation en fin de soirée, quand toutes les places sont prises. */
function ligneDeFin(registre, date, intitule, places) {
  const feuille = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(registre)
  feuille.appendRow([
    '— complet —',
    '',
    date,
    intitule,
    `${places} / ${places} places`,
    '',
  ])

  feuille
    .getRange(feuille.getLastRow(), 1, 1, COLONNES_INSCRIPTIONS.length)
    .setBackground(COULEURS.mensuelle.trait)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
}

function reponse(objet) {
  return ContentService.createTextOutput(JSON.stringify(objet)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
