<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { headerCopy, stepByRoute } from '@/config/copy/shell'
import { useLeadModal } from '@/composables/useLeadModal'

/**
 * Header de embudo, no de sitio web: sin menú, porque cada enlace es una salida.
 * En la landing ofrece el único camino (el registro en modal); en el resto dice en qué paso va la persona.
 */
const route = useRoute()
const { open } = useLeadModal()
const isHome = computed(() => route.name === 'Home')
const scrolled = ref(false)

const progress = computed(() => stepByRoute[String(route.name)] ?? null)

const steps = computed(() =>
  headerCopy.steps.map((step, index) => ({
    ...step,
    number: String(index + 1).padStart(2, '0'),
    done: !!progress.value && index < progress.value.done,
    current: progress.value?.current === index,
  })),
)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="headerCopy.homeLabel">
        <img :src="site.logo" :alt="site.name" width="315" height="213" />
      </RouterLink>

      <ol v-if="progress" class="steps" :aria-label="headerCopy.progressLabel">
        <li
          v-for="step in steps"
          :key="step.key"
          class="steps__item"
          :class="{ 'steps__item--done': step.done, 'steps__item--current': step.current }"
          :aria-current="step.current ? 'step' : undefined"
        >
          <span class="steps__body">
            <span class="steps__number" aria-hidden="true">{{ step.number }}</span>
            <span class="steps__label">{{ step.label }}</span>
            <span v-if="step.done" class="visually-hidden">({{ headerCopy.doneLabel }})</span>
          </span>
        </li>
      </ol>

      <button
        v-else-if="isHome"
        type="button"
        class="btn btn--dark header__cta"
        aria-haspopup="dialog"
        @click="open('cta')"
      >
        {{ headerCopy.cta }}
      </button>
      <RouterLink
        v-else
        :to="{ name: 'Home', hash: headerCopy.ctaTarget }"
        class="btn btn--dark header__cta"
      >
        {{ headerCopy.cta }}
      </RouterLink>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $paper;
  border-bottom: 1px solid transparent;
  transition:
    background-color 0.3s $ease,
    border-color 0.3s $ease;

  // Arriba del todo el header es papel liso; al bajar se vuelve un velo sobre las fotos.
  &--scrolled {
    background: rgba($paper, 0.84);
    backdrop-filter: saturate(1.4) blur(12px);
    -webkit-backdrop-filter: saturate(1.4) blur(12px);
    border-color: $line;
  }

  &__inner {
    @include container(1280px);
    @include flex(row, center, space-between, 1rem);
    min-height: 60px;
    padding-block: 0.6rem;

    @include from('md') {
      min-height: 72px;
    }
  }

  &__logo {
    flex: none;
    display: flex;
    border-radius: 4px;

    img {
      height: 44px;
      width: auto;

      @include from('md') {
        height: 52px;
      }
    }
  }

  &__cta {
    padding: 0.6rem 1.15rem;
    font-size: 0.74rem;
    white-space: nowrap;

    @include from('md') {
      padding: 0.7rem 1.4rem;
      font-size: 0.78rem;
    }
  }
}

.steps {
  @include flex(row, center, flex-end, 0);
  list-style: none;
  min-width: 0;

  &__item {
    @include flex(row, center, flex-start, 0);
    font-size: 0.66rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $ink-muted;
    white-space: nowrap;
    transition: color 0.3s $ease;

    @include from('md') {
      font-size: 0.7rem;
    }

    // Regla entre pasos: una línea de plano, no una flecha.
    & + & {
      margin-left: 0.5rem;

      &::before {
        content: '';
        width: 0.9rem;
        height: 1px;
        margin-right: 0.5rem;
        background: $line;

        @include from('sm') {
          width: 1.6rem;
          margin-right: 0.9rem;
        }
      }

      @include from('sm') {
        margin-left: 0.9rem;
      }
    }

    &--done {
      color: $accent-deep;

      & + .steps__item::before {
        background: $accent;
      }
    }

    &--current {
      color: $ink;
    }
  }

  &__body {
    @include flex(row, baseline, flex-start, 0.4rem);
    position: relative;
    padding-block: 0.4rem;

    // Subrayado de cobre solo bajo el paso en curso.
    &::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 1.5px;
      background: $accent;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.4s $ease;
    }

    .steps__item--current &::after {
      transform: scaleX(1);
    }
  }

  &__number {
    font-family: $font-display;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0;
    font-variant-numeric: lining-nums;
  }

  // En móvil solo el paso actual lleva nombre a la vista; el resto queda en su número,
  // pero el lector de pantalla sigue leyendo los tres nombres.
  &__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);

    @mixin shown {
      position: static;
      width: auto;
      height: auto;
      overflow: visible;
      clip-path: none;
    }

    .steps__item--current & {
      @include shown;
    }

    @include from('sm') {
      @include shown;
    }
  }
}
</style>
