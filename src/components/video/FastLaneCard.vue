<script setup lang="ts">
import { videoCopy } from '@/config/copy/video'

const copy = videoCopy.fastLane
</script>

<template>
  <aside class="fast" aria-labelledby="fast-title">
    <p class="fast__seal">
      <i class="fa-solid fa-bolt" aria-hidden="true"></i>
      {{ copy.seal }}
    </p>

    <h2 id="fast-title" class="fast__title">{{ copy.title }}</h2>
    <p class="fast__lead">{{ copy.lead }}</p>

    <div class="fast__skipped">
      <p class="fast__caption">{{ copy.skippedTitle }}</p>
      <ol class="fast__steps">
        <li v-for="(item, i) in copy.skipped" :key="item" class="fast__step">
          <span class="fast__num" aria-hidden="true">{{ i + 1 }}</span>
          <!-- <s> le dice también al lector de pantalla que el paso queda eliminado. -->
          <s class="fast__struck">{{ item }}</s>
        </li>
      </ol>
    </div>

    <div class="fast__price">
      <div class="fast__price-text">
        <p class="fast__caption">{{ copy.priceLabel }}</p>
        <p class="fast__note">{{ copy.priceNote }}</p>
      </div>
      <p class="fast__amount">{{ copy.price }}</p>
    </div>

    <p class="fast__discount">
      <i class="fa-solid fa-tag" aria-hidden="true"></i>
      <span>{{ copy.discount }}</span>
    </p>

    <RouterLink :to="{ name: 'Pay' }" class="btn btn--primary btn--lg btn--block fast__cta">
      {{ copy.cta }}
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </RouterLink>
  </aside>
</template>

<style scoped lang="scss">
.fast {
  position: relative;
  @include flex(column, stretch, flex-start, 0);
  padding: 2.1rem 1.25rem 1.5rem;
  // Cobre sobre la noche: el único bloque de la página con borde de color.
  border: 1px solid rgba($accent-glow, 0.55);
  border-radius: $radius-md;
  background: linear-gradient(180deg, rgba($accent, 0.12), rgba($accent, 0.03) 55%);

  @include from('md') {
    padding: 2.4rem 2rem 2rem;
  }

  // El sello va montado sobre el borde, como la pestaña de una carpeta de planos.
  &__seal {
    position: absolute;
    top: 0;
    left: 1.25rem;
    transform: translateY(-50%);
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.32rem 0.8rem;
    background: $night;
    border: 1px solid rgba($accent-glow, 0.55);
    border-radius: $radius-pill;
    @include eyebrow;
    font-size: 0.66rem;
    color: $accent-glow;
    white-space: nowrap;

    @include from('md') {
      left: 2rem;
    }

    i {
      font-size: 0.62rem;
    }
  }

  &__title {
    @include display($text-xl, 500);
    color: $on-night;
  }

  &__lead {
    margin-top: 0.55rem;
    font-size: $text-sm;
    color: $on-night-soft;
  }

  &__caption {
    @include eyebrow;
    font-size: 0.66rem;
    color: rgba($on-night, 0.5);
  }

  &__skipped {
    margin-top: 1.4rem;
    padding-top: 1.2rem;
    border-top: 1px solid $night-line;
  }

  &__steps {
    @include flex(column, stretch, flex-start, 0.55rem);
    margin-top: 0.8rem;
    list-style: none;
  }

  &__step {
    @include flex(row, baseline, flex-start, 0.75rem);
    font-size: $text-sm;
    line-height: 1.4;
  }

  &__num {
    flex: none;
    width: 1rem;
    font-size: 0.7rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: rgba($on-night, 0.38);
  }

  &__struck {
    color: rgba($on-night, 0.5);
    text-decoration: line-through;
    text-decoration-color: $accent-glow;
    text-decoration-thickness: 1px;
  }

  &__price {
    @include flex(row, flex-end, space-between, 1rem);
    margin-top: 1.4rem;
    padding-top: 1.2rem;
    border-top: 1px solid $night-line;
  }

  &__price-text {
    min-width: 0;
  }

  &__note {
    margin-top: 0.4rem;
    font-size: 0.8rem;
    line-height: 1.45;
    color: $on-night-soft;
    max-width: 26ch;
  }

  &__amount {
    flex: none;
    @include display($display-md, 400);
    font-variant-numeric: lining-nums;
    line-height: 0.85;
    color: $accent-glow;
  }

  &__discount {
    @include flex(row, baseline, flex-start, 0.6rem);
    margin-top: 1.1rem;
    font-size: 0.8rem;
    line-height: 1.5;
    color: $on-night-soft;

    i {
      flex: none;
      font-size: 0.72rem;
      color: $accent-glow;
    }
  }

  &__cta {
    margin-top: 1.5rem;
    border-radius: $radius-sm;
    padding-inline: 1.1rem;
    justify-content: space-between;
    text-align: left;
  }
}
</style>
