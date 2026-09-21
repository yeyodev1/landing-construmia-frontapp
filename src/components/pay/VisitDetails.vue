<script setup lang="ts">
import { payCopy as copy } from '@/config/copy/checkout'

defineProps<{ titleId: string }>()
</script>

<template>
  <div class="details">
    <h2 :id="titleId" class="details__subhead">{{ copy.includesTitle }}</h2>
    <ol class="details__includes">
      <li v-for="(item, index) in copy.includes" :key="item.title" class="details__include">
        <span class="details__index" aria-hidden="true">0{{ index + 1 }}</span>
        <div>
          <h3 class="details__include-title">{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </li>
    </ol>

    <h2 class="details__subhead">{{ copy.ledger.title }}</h2>
    <dl>
      <div v-for="row in copy.ledger.rows" :key="row.label" class="details__row">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value }}</dd>
      </div>
      <div class="details__row details__row--total">
        <dt>{{ copy.ledger.total.label }}</dt>
        <dd>{{ copy.ledger.total.value }}</dd>
      </div>
    </dl>

    <div class="details__fast">
      <h2 class="details__fast-title">{{ copy.fastTrack.title }}</h2>
      <p>{{ copy.fastTrack.text }}</p>
      <ul class="details__skipped">
        <li v-for="step in copy.fastTrack.skipped" :key="step">{{ step }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Va siempre sobre el panel oscuro de /pago.
.details {
  color: $on-night-soft;
  font-size: $text-sm;

  &__subhead {
    @include eyebrow;
    margin-top: 2.5rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid $night-line;
    color: $accent-glow;
    line-height: 1.5;

    &:first-child {
      margin-top: 0;
    }
  }

  &__includes {
    list-style: none;
  }

  &__include {
    @include flex(row, flex-start, flex-start, 1.1rem);
    padding-block: 1.1rem;
    border-bottom: 1px solid $night-line;
  }

  &__index {
    flex: 0 0 1.6rem;
    font-family: $font-display;
    font-size: $text-base;
    color: $accent-glow;
    font-variant-numeric: tabular-nums;
  }

  &__include-title {
    margin-bottom: 0.25rem;
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 600;
    color: $on-night;
  }

  &__row {
    @include flex(row, baseline, space-between, 1.5rem);
    padding-block: 0.8rem;
    border-bottom: 1px solid $night-line;

    dd {
      flex: 0 0 auto;
      color: $on-night;
      font-variant-numeric: tabular-nums;
    }

    &--total {
      border-bottom: none;
      color: $on-night;

      dd {
        font-family: $font-display;
        font-size: $text-xl;
        color: $accent-glow;
      }
    }
  }

  &__fast {
    margin-top: 2rem;
    padding: 1.4rem;
    border: 1px solid rgba($accent-glow, 0.35);
    border-radius: 14px;
  }

  &__fast-title {
    @include display($text-lg);
    margin-bottom: 0.4rem;
    color: $on-night;
  }

  &__skipped {
    @include flex(column, stretch, flex-start, 0.35rem);
    margin-top: 0.8rem;
    list-style: none;

    li {
      text-decoration: line-through;
      text-decoration-color: rgba($accent-glow, 0.7);
    }
  }
}
</style>
