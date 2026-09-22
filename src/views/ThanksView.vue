<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { cld, cldSet, media } from '@/config/media'
import { site, whatsappLink } from '@/config/site'
import { thanksCopy } from '@/config/copy/checkout'

const route = useRoute()

// real-piscina-03: casa de dos pisos terminada, con piscina y jardín.
const PHOTO = media.reales.piscinas[2] ?? media.renderToReality.real

const isTransfer = computed(() => route.query.motivo === 'transferencia')
const transfer = thanksCopy.transfer
const notQualified = thanksCopy.notQualified
const imageAlt = computed(() => (isTransfer.value ? transfer.imageAlt : notQualified.imageAlt))
</script>

<template>
  <section class="thanks" aria-labelledby="thanks-title">
    <figure class="thanks__photo">
      <img
        :src="cld(PHOTO, 1200)"
        :srcset="cldSet(PHOTO, [480, 800, 1200])"
        sizes="(min-width: 1024px) 45vw, 100vw"
        :alt="imageAlt"
        width="1242"
        height="1536"
        fetchpriority="high"
      />
    </figure>

    <div class="thanks__body">
      <!-- Cierre tras reportar una transferencia. -->
      <template v-if="isTransfer">
        <p class="thanks__eyebrow"><i class="fa-solid fa-check" aria-hidden="true"></i>{{ transfer.eyebrow }}</p>
        <h1 id="thanks-title" class="thanks__title">{{ transfer.title }}</h1>
        <p class="thanks__lead">{{ transfer.lead }}</p>

        <h2 class="thanks__subhead">{{ transfer.stepsTitle }}</h2>
        <ol class="thanks__steps">
          <li v-for="(step, index) in transfer.steps" :key="step" class="thanks__step">
            <span class="thanks__index" aria-hidden="true">0{{ index + 1 }}</span>
            {{ step }}
          </li>
        </ol>

        <div class="thanks__actions">
          <a class="btn btn--dark btn--lg" :href="whatsappLink(transfer.whatsappMessage)" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            {{ transfer.whatsapp }}
          </a>
        </div>
      </template>

      <!-- Por defecto: quien hoy no califica. Honesto, sin cerrar la puerta. -->
      <template v-else>
        <p class="thanks__eyebrow">{{ notQualified.eyebrow }}</p>
        <h1 id="thanks-title" class="thanks__title">{{ notQualified.title }}</h1>
        <p class="thanks__lead">{{ notQualified.lead }}</p>

        <h2 class="thanks__subhead">{{ notQualified.forTitle }}</h2>
        <ul class="thanks__for">
          <li v-for="item in notQualified.forItems" :key="item">
            <i class="fa-solid fa-minus" aria-hidden="true"></i>
            <span>{{ item }}</span>
          </li>
        </ul>
        <p class="thanks__aside">{{ notQualified.aside }}</p>

        <div class="thanks__door">
          <h2 class="thanks__door-title">{{ notQualified.doorTitle }}</h2>
          <p>{{ notQualified.doorText }}</p>
          <div class="thanks__actions">
            <a class="btn btn--dark" :href="site.social.instagram" target="_blank" rel="noopener">
              <i class="fa-brands fa-instagram" aria-hidden="true"></i>
              {{ notQualified.instagram }}
              <span class="thanks__handle">{{ site.social.instagramHandle }}</span>
            </a>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Móvil: foto arriba a sangre y texto debajo. Escritorio: texto a la izquierda, foto a toda la altura a la derecha.
.thanks {
  @include flex(column, stretch, flex-start, 0);
  flex: 1;
  background: $paper;

  @include from('lg') {
    flex-direction: row-reverse;
    min-height: calc(100vh - 72px);
  }

  &__photo {
    height: clamp(13rem, 58vw, 22rem);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 40%;
    }

    @include from('lg') {
      flex: 0 0 45%;
      height: auto;
    }
  }

  &__body {
    @include flex(column, flex-start, center, 0);
    width: 100%;
    max-width: 40rem;
    margin-inline: auto;
    padding: 2.5rem 1.25rem 3.5rem;

    @include from('md') {
      padding: 3.5rem 2rem 4.5rem;
    }

    @include from('lg') {
      flex: 1 1 55%;
      max-width: none;
      padding: 4rem clamp(2rem, 6vw, 6rem);
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.55rem);
  }

  &__title {
    @include display($display-md);
    max-width: 16ch;
    margin-top: 0.9rem;
  }

  &__lead {
    max-width: 34rem;
    margin-top: 1.1rem;
    font-size: $text-lg;
    line-height: 1.5;
    color: $ink-soft;
  }

  &__subhead {
    @include eyebrow;
    width: 100%;
    max-width: 34rem;
    margin-top: 2.5rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid $line;
    line-height: 1.5;
  }

  &__steps,
  &__for {
    width: 100%;
    max-width: 34rem;
    list-style: none;
  }

  &__step {
    @include flex(row, baseline, flex-start, 1rem);
    padding-block: 1rem;
    border-bottom: 1px solid $line;
    color: $ink;
  }

  &__index {
    flex: 0 0 1.6rem;
    font-family: $font-display;
    color: $accent;
    font-variant-numeric: tabular-nums;
  }

  &__for li {
    @include flex(row, baseline, flex-start, 0.8rem);
    padding-block: 0.7rem;
    color: $ink;

    i {
      flex: 0 0 auto;
      font-size: 0.7rem;
      color: $accent;
    }
  }

  &__aside {
    max-width: 34rem;
    margin-top: 1rem;
    font-size: $text-sm;
    color: $ink-muted;
  }

  // La puerta abierta: separada por una regla, no metida en una tarjeta.
  &__door {
    width: 100%;
    max-width: 34rem;
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid $ink;
    color: $ink-soft;
  }

  &__door-title {
    @include display($text-xl);
    margin-bottom: 0.5rem;
    color: $ink;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    margin-top: 1.75rem;

    @include until('sm') {
      flex-direction: column;
      align-items: stretch;
      width: 100%;
    }
  }

  &__handle {
    font-weight: 400;
    opacity: 0.7;
  }
}
</style>
