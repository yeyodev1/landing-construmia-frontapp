<script setup lang="ts">
import { payCopy as copy } from '@/config/copy/checkout'

// El id del título lo usa la vista para etiquetar la sección.
defineProps<{ titleId: string }>()
</script>

<template>
  <div class="intro">
    <p class="intro__eyebrow"><i class="fa-solid fa-bolt" aria-hidden="true"></i>{{ copy.eyebrow }}</p>
    <h1 :id="titleId" class="intro__title">{{ copy.title }}</h1>
    <p class="intro__lead">{{ copy.lead }}</p>
    <div class="intro__price">
      <span class="intro__amount">{{ copy.price.amount }}</span>
      <span class="intro__price-text">
        <strong>{{ copy.price.label }}</strong>
        {{ copy.price.note }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Va siempre sobre el panel oscuro de /pago.
.intro {
  color: $on-night-soft;

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.55rem);
    color: $accent-glow;
  }

  &__title {
    @include display($display-md);
    margin-top: 0.8rem;
    color: $on-night;
  }

  &__lead {
    margin-top: 1rem;
    max-width: 30rem;
    font-size: $text-lg;
    line-height: 1.5;
  }

  &__price {
    @include flex(row, center, flex-start, 1.1rem);
    margin-top: 1.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid $night-line;
  }

  &__amount {
    @include display($display-lg, 400);
    line-height: 0.9;
    color: $on-night;
    font-variant-numeric: lining-nums;
  }

  &__price-text {
    font-size: $text-sm;
    line-height: 1.45;

    strong {
      display: block;
      font-weight: 600;
      color: $on-night;
    }
  }
}
</style>
