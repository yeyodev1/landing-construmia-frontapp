<script setup lang="ts">
import { site } from '@/config/site'
import { footerCopy } from '@/config/copy/shell'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <img class="footer__logo" :src="site.logo" :alt="site.name" width="315" height="213" loading="lazy" />
        <p class="footer__tagline">{{ footerCopy.tagline }}</p>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">{{ footerCopy.processTitle }}</h2>
        <p class="footer__note">{{ footerCopy.process }}</p>
      </div>

      <address class="footer__col">
        <h2 class="footer__heading">{{ footerCopy.contactTitle }}</h2>
        <a class="footer__link" :href="`mailto:${site.email}`" :aria-label="`${footerCopy.emailLabel} ${site.email}`">
          <i class="fa-regular fa-envelope" aria-hidden="true"></i>
          <span>{{ site.email }}</span>
        </a>
        <a
          class="footer__link"
          :href="site.social.instagram"
          target="_blank"
          rel="noopener"
          :aria-label="footerCopy.instagramLabel"
        >
          <i class="fa-brands fa-instagram" aria-hidden="true"></i>
          <span>{{ site.social.instagramHandle }}</span>
        </a>
      </address>
    </div>

    <div class="footer__bar">
      <p class="footer__disclaimer">{{ footerCopy.activityDisclaimer }}</p>
      <div class="footer__legal">
        <p>© {{ year }} {{ site.legalName }} · {{ footerCopy.place }}. {{ footerCopy.rights }}</p>
        <p>
          {{ footerCopy.credit }}
          <a :href="footerCopy.creditUrl" target="_blank" rel="noopener">{{ footerCopy.creditName }}</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
// Footer claro a propósito: el logo (cobre y grafito) solo se lee bien sobre papel,
// y las vistas suelen cerrar con una sección oscura que ya hace de remate.
.footer {
  margin-top: auto;
  background: $sand;
  border-top: 1px solid $line;
  color: $ink-soft;

  &__inner {
    @include container(1280px);
    @include flex(column, flex-start, flex-start, 2.25rem);
    padding-block: 3rem 2.5rem;

    @include from('md') {
      flex-direction: row;
      justify-content: space-between;
      gap: 3rem;
      padding-block: 4rem 3rem;
    }
  }

  &__brand {
    @include flex(column, flex-start, flex-start, 1.1rem);

    @include from('md') {
      flex: 1 1 0;
      max-width: 24rem;
    }
  }

  &__logo {
    height: 72px;
    width: auto;
  }

  &__tagline {
    @include display($text-lg, 400);
    line-height: 1.3;
    color: $ink;
    max-width: 22ch;
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.5rem);
    font-style: normal;
    font-size: $text-sm;

    @include from('md') {
      flex: 0 1 17rem;
    }
  }

  &__heading {
    @include eyebrow;
    margin-bottom: 0.5rem;
  }

  &__note {
    max-width: 34ch;
    line-height: 1.6;
  }

  &__disclaimer {
    max-width: 72ch;
    line-height: 1.55;
  }

  &__legal {
    @include flex(column, flex-start, flex-start, 0.35rem);

    @include from('md') {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__link {
    @include flex(row, center, flex-start, 0.7rem);
    // Con el gap de la columna cada línea deja 40 px de zona táctil.
    min-height: 2rem;
    color: $ink;
    font-weight: 500;
    @include transition(color);

    i {
      width: 1rem;
      text-align: center;
      color: $accent;
    }

    span {
      background: linear-gradient(currentColor, currentColor) no-repeat 0 100% / 0 1px;
      transition: background-size 0.3s $ease;
    }

    @media (hover: hover) {
      &:hover {
        color: $accent-deep;

        span {
          background-size: 100% 1px;
        }
      }
    }
  }

  &__bar {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 0.9rem);
    padding-block: 1.25rem;
    // En móvil la barra fija del CTA ocupa el borde de abajo: aire para que no tape la línea legal.
    padding-bottom: calc(5.5rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;
    font-size: $text-xs;
    color: $ink-soft;

    @include from('md') {
      padding-bottom: calc(1.25rem + env(safe-area-inset-bottom));
    }

    a {
      color: $ink;
      font-weight: 600;
      @include transition(color);

      @media (hover: hover) {
        &:hover {
          color: $accent-deep;
        }
      }
    }
  }
}
</style>
