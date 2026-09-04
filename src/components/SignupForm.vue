<script setup>
// Inscription aux soirées one-shot mensuelles : ouvertes à tout le monde, donc
// pas de validation par un MJ — le pseudo Discord suffit.
//
// L'inscription part dans la feuille Google qui pilote l'agenda : elle y est
// horodatée, numérotée, et le nombre de places restantes s'en déduit
// (voir docs/agenda-google-sheet.gs et src/data/sheet.js).
//
// Tant que la feuille n'est pas configurée, le formulaire prépare un message
// pré-rempli vers la boîte mail de la Guilde : l'inscription fonctionne, mais
// l'envoi reste manuel.
import { computed, ref } from 'vue'
import { contactHref } from '../socials.js'
import { SHEET_ENDPOINT, postInscription } from '../data/sheet.js'

const props = defineProps({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '' },
})

// Prévient la page pour qu'elle relise les places restantes.
const emit = defineEmits(['inscrit'])

const pseudo = ref('')
const sent = ref(false)
const sending = ref(false)
const error = ref('')
// `true` quand l'inscription est partie toute seule ; `false` en repli mail,
// où il reste à l'utilisateur à envoyer le message.
const registered = ref(false)
// Rang d'arrivée et places restantes renvoyés par la feuille, quand ils sont lisibles.
const rang = ref(0)
const restantes = ref(null)

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

// « 1re position », « 2e position »… — l'abréviation de « premier » est
// irrégulière en français.
const positionLabel = computed(() => (rang.value === 1 ? '1re' : `${rang.value}e`))

const readableDate = computed(() => {
  const [y, m, d] = props.date.split('-').map(Number)
  return dateFormat.format(new Date(y, m - 1, d))
})

async function submit() {
  const name = pseudo.value.trim()
  if (!name) return

  const when = `${readableDate.value}${props.time ? ` à ${props.time}` : ''}`

  // Sans feuille configurée : message pré-rempli vers la Guilde.
  if (!SHEET_ENDPOINT) {
    const subject = `Inscription — ${props.title} (${readableDate.value})`
    const body =
      `Bonjour,\n\nJe m'inscris à la soirée « ${props.title} » du ${when}.\n\n` +
      `Pseudo ou prénom : ${name}\n\nMerci !`
    window.location.href = `${contactHref(subject)}&body=${encodeURIComponent(body)}`
    registered.value = false
    sent.value = true
    return
  }

  sending.value = true
  error.value = ''

  const resultat = await postInscription({
    soiree: props.title,
    dateSoiree: props.date,
    horaire: props.time,
    pseudo: name,
  })

  sending.value = false

  if (resultat.complet) {
    error.value = "Cette soirée vient d'afficher complet. Écrivez-nous sur le Discord."
    emit('inscrit')
    return
  }

  if (!resultat.ok) {
    error.value = "L'inscription n'a pas pu être envoyée. Réessayez ou passez par le Discord."
    return
  }

  rang.value = resultat.rang || 0
  restantes.value = typeof resultat.restantes === 'number' ? resultat.restantes : null
  registered.value = true
  sent.value = true
  emit('inscrit')
}
</script>

<template>
  <form v-if="!sent" class="signup" @submit.prevent="submit">
    <!-- Pseudo Discord de préférence : c'est lui qui évite de compter deux fois
         la même personne si elle se signale aussi sur le serveur. Mais un
         prénom suffit — la soirée mensuelle est ouverte à qui n'a pas Discord,
         et l'obliger à créer un compte pour s'inscrire le ferait fuir. -->
    <label class="signup__label" :for="`pseudo-${date}`">
      Pseudo Discord, ou prénom
    </label>
    <div class="signup__row">
      <input
        :id="`pseudo-${date}`"
        v-model="pseudo"
        class="signup__input"
        type="text"
        placeholder="votre pseudo Discord, ou votre prénom"
        required
      />
      <button class="btn btn--primary signup__btn" type="submit" :disabled="sending">
        {{ sending ? 'Envoi…' : "Je m'inscris" }}
      </button>
    </div>
    <p v-if="error" class="signup__error">{{ error }}</p>
  </form>

  <p v-else class="signup__done">
    <template v-if="registered">
      <span class="signup__badge">Inscription enregistrée</span>
      <template v-if="rang">
        Vous êtes inscrit·e en <strong>{{ positionLabel }} position</strong> pour
        <strong>{{ title }}</strong><template v-if="restantes !== null">, il reste
        {{ restantes }} place{{ restantes > 1 ? 's' : '' }}</template>. À bientôt&nbsp;!
      </template>
      <template v-else>
        À bientôt pour <strong>{{ title }}</strong>&nbsp;! Retrouvez les détails sur le
        Discord de la Guilde.
      </template>
    </template>
    <template v-else>
      <span class="signup__badge">Message prêt</span>
      Votre inscription à <strong>{{ title }}</strong> est prête&nbsp;: il ne reste qu'à
      envoyer le message qui vient de s'ouvrir.
    </template>
  </p>
</template>

<style scoped>
.signup {
  display: grid;
  gap: 0.4rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-in-sm);
  text-align: left;
}

.signup__label {
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.signup__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.signup__input {
  flex: 1 1 180px;
  min-width: 0;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 999px;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 1rem;
  box-shadow: var(--shadow-in-sm);
}

.signup__input:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.signup__btn {
  flex: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
}

.signup__error {
  color: var(--accent-strong);
  font-size: 0.95rem;
}

.signup__done {
  padding: 1rem 1.1rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-in-sm);
  color: var(--text-muted);
  font-size: 1rem;
  text-align: left;
}

/* Statut de l'inscription, dans le ton des pastilles du site */
.signup__badge {
  display: inline-block;
  margin-right: 0.5rem;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  background: linear-gradient(145deg, var(--accent), var(--accent-strong));
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}
</style>
