<script setup>
// Inscription aux soirées one-shot mensuelles : ouvertes à tout le monde, donc
// pas de validation par un MJ — le pseudo Discord suffit.
//
// Le site est statique : c'est un service externe qui reçoit l'inscription.
// Deux modes, dans cet ordre :
//
// 1. DISCORD_WEBHOOK — recommandé. Créer un webhook dans le salon des soirées
//    mensuelles (Paramètres du salon › Intégrations › Créer un webhook) et
//    coller son URL ci-dessous : chaque inscription y tombe automatiquement.
//    À savoir : l'URL est visible dans le code du site publié ; en cas de spam,
//    il suffit de supprimer le webhook et d'en créer un autre.
// 2. SIGNUP_ENDPOINT — un service de formulaire (Formspree, Netlify Forms…)
//    si vous préférez une liste hors Discord.
//
// Sans configuration, le formulaire prépare un message pré-rempli vers la boîte
// mail de la Guilde : l'inscription fonctionne, mais l'envoi reste manuel.
import { computed, ref } from 'vue'

const DISCORD_WEBHOOK = ''
const SIGNUP_ENDPOINT = ''
const CONTACT_EMAIL = 'laguildedessonges@gmail.com'

const props = defineProps({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '' },
})

const pseudo = ref('')
const sent = ref(false)
const sending = ref(false)
const error = ref('')
// `true` quand l'inscription est partie toute seule ; `false` en repli mail,
// où il reste à l'utilisateur à envoyer le message.
const registered = ref(false)

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const readableDate = computed(() => {
  const [y, m, d] = props.date.split('-').map(Number)
  return dateFormat.format(new Date(y, m - 1, d))
})

async function submit() {
  const name = pseudo.value.trim()
  if (!name) return

  const when = `${readableDate.value}${props.time ? ` à ${props.time}` : ''}`

  if (!DISCORD_WEBHOOK && !SIGNUP_ENDPOINT) {
    const subject = `Inscription — ${props.title} (${readableDate.value})`
    const body =
      `Bonjour,\n\nJe m'inscris à la soirée « ${props.title} » du ${when}.\n\n` +
      `Pseudo Discord : ${name}\n\nMerci !`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    registered.value = false
    sent.value = true
    return
  }

  sending.value = true
  error.value = ''
  try {
    const [url, payload] = DISCORD_WEBHOOK
      ? [
          DISCORD_WEBHOOK,
          {
            content:
              `**Nouvelle inscription**\nSoirée : ${props.title}\n` +
              `Date : ${when}\nPseudo Discord : ${name}`,
          },
        ]
      : [SIGNUP_ENDPOINT, { soiree: props.title, date: props.date, pseudo: name }]

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('envoi impossible')
    registered.value = true
    sent.value = true
  } catch {
    error.value = "L'inscription n'a pas pu être envoyée. Réessayez ou passez par le Discord."
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <form v-if="!sent" class="signup" @submit.prevent="submit">
    <label class="signup__label" :for="`pseudo-${date}`">Pseudo Discord</label>
    <div class="signup__row">
      <input
        :id="`pseudo-${date}`"
        v-model="pseudo"
        class="signup__input"
        type="text"
        placeholder="votre pseudo"
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
      À bientôt pour <strong>{{ title }}</strong>&nbsp;! Retrouvez les détails sur le
      Discord de la Guilde.
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
