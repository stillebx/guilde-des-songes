<script setup>
import { ref } from 'vue'
import IconGlyph from './IconGlyph.vue'
import { socials } from '../socials.js'

const links = [
  { href: '#qui-sommes-nous', label: 'Qui sommes-nous' },
  { href: '#activites', label: 'Nos parties' },
  { href: '#infos-pratiques', label: 'Infos pratiques' },
  { href: '#rejoindre', label: 'Nous rejoindre' },
]

const menuOpen = ref(false)
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a href="#" class="header__brand">
        <img class="header__logo" src="/logo-guilde.png" alt="" />
        La Guilde des Songes
      </a>

      <nav class="header__nav" :class="{ 'header__nav--open': menuOpen }" aria-label="Navigation principale">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="header__link"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </a>
        <div class="header__nav-socials">
          <a
            v-for="social in socials"
            :key="social.icon"
            class="social-btn"
            :href="social.href"
            :aria-label="social.label"
            :title="social.label"
            :target="social.href.startsWith('http') ? '_blank' : undefined"
            :rel="social.href.startsWith('http') ? 'noopener' : undefined"
            @click="menuOpen = false"
          >
            <IconGlyph :name="social.icon" />
          </a>
        </div>
      </nav>

      <div class="header__actions">
        <div class="header__socials">
          <a
            v-for="social in socials"
            :key="social.icon"
            class="social-btn"
            :href="social.href"
            :aria-label="social.label"
            :title="social.label"
            :target="social.href.startsWith('http') ? '_blank' : undefined"
            :rel="social.href.startsWith('http') ? 'noopener' : undefined"
          >
            <IconGlyph :name="social.icon" />
          </a>
        </div>

        <button
          class="header__burger"
          :aria-expanded="menuOpen"
          aria-label="Ouvrir le menu"
          @click="menuOpen = !menuOpen"
        >
          ☰
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  box-shadow: 0 6px 18px var(--shadow-dark);
}

/* Les groupes occupent toute la bande : l'espace libre aère logo, menus et pastilles */
.header__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--band-gap);
  min-height: var(--band-height);
}

.header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text);
  text-decoration: none;
  white-space: nowrap;
}

.header__logo {
  height: 60px;
  width: auto;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  min-width: 0;
}

.header__link {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.header__link:hover {
  color: var(--accent);
}

.header__nav-socials {
  display: none;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header__socials {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header__burger {
  display: none;
  background: var(--bg);
  border: none;
  border-radius: 10px;
  color: var(--accent);
  font-size: 1.2rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  box-shadow: var(--shadow-out-sm);
}

.header__burger[aria-expanded='true'] {
  box-shadow: var(--shadow-in-sm);
}

@media (max-width: 1080px) {
  .header__inner {
    justify-content: space-between;
  }

  .header__nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: var(--bg);
    box-shadow: 0 10px 22px var(--shadow-dark);
    padding: 0.5rem 1.5rem 1.25rem;
  }

  .header__nav--open {
    display: flex;
  }

  .header__link {
    padding: 0.7rem 0;
  }

  /* En mobile, les réseaux vivent dans le menu déroulant */
  .header__nav-socials {
    display: flex;
    gap: 0.9rem;
    padding-top: 0.9rem;
  }

  .header__socials {
    display: none;
  }

  .header__burger {
    display: block;
  }
}
</style>
