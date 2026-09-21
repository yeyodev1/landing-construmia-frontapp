<script setup lang="ts">
import { computed } from 'vue'
import { useLeadStore } from '@/stores/lead'
import { whatsappLink } from '@/config/site'
import { scheduleCopy } from '@/config/copy/checkout'

/**
 * Para quien calificó y aún no paga: el calendario es un beneficio del pase premium.
 * El otro camino no pide nada: el asesor ya tiene el lead en el CRM y escribe él.
 */
const copy = scheduleCopy.choice
const leadStore = useLeadStore()

const phone = computed(() => leadStore.lead?.phoneE164 ?? '')
</script>

<template>
  <div class="choice">
    <article class="choice__premium" aria-labelledby="choice-premium">
      <header class="choice__premium-head">
        <span class="choice__badge">
          <i class="fa-solid fa-crown" aria-hidden="true"></i>
          {{ copy.premium.badge }}
        </span>
        <p class="choice__price">
          <strong>{{ copy.premium.price }}</strong>
          <span>{{ copy.premium.priceNote }}</span>
        </p>
      </header>

      <h2 id="choice-premium" class="choice__title">{{ copy.premium.title }}</h2>

      <ul class="choice__points">
        <li v-for="point in copy.premium.points" :key="point">
          <i class="fa-solid fa-check" aria-hidden="true"></i>
          {{ point }}
        </li>
      </ul>

      <RouterLink :to="{ name: 'Pay' }" class="btn btn--light btn--lg btn--block">
        {{ copy.premium.cta }}
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
      <p class="choice__note">{{ copy.premium.note }}</p>
    </article>

    <article class="choice__advisor" aria-labelledby="choice-advisor">
      <span class="choice__badge choice__badge--soft">
        <i class="fa-regular fa-clock" aria-hidden="true"></i>
        {{ copy.advisor.badge }}
      </span>
      <h2 id="choice-advisor" class="choice__advisor-title">{{ copy.advisor.title }}</h2>
      <p>{{ copy.advisor.text }}</p>
      <p v-if="phone" class="choice__channel">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        {{ copy.advisor.channel(phone) }}
      </p>
      <p class="choice__wa">
        {{ copy.advisor.whatsapp }}
        <a :href="whatsappLink(copy.advisor.whatsappMessage)" target="_blank" rel="noopener">
          {{ copy.advisor.whatsappAction }}
        </a>
      </p>
    </article>
  </div>
</template>

<style scoped lang="scss">
.choice {
  @include flex(column, stretch, flex-start, 1rem);
  margin-top: 2rem;

  &__premium {
    @include flex(column, stretch, flex-start, 1.1rem);
    position: relative;
    padding: 1.75rem 1.4rem;
    border-radius: $radius-lg;
    background: $night;
    color: $on-night-soft;
    box-shadow: $shadow-lg;
    // Filo cobre arriba: marca el camino recomendado sin gritar.
    border-top: 3px solid $accent-glow;

    @include from('md') {
      padding: 2.25rem 2.25rem 2rem;
    }
  }

  &__premium-head {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__badge {
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.4rem 0.8rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $night;
    background: $accent-glow;

    &--soft {
      align-self: flex-start;
      color: $ink-soft;
      background: $sand;
    }
  }

  &__price {
    @include flex(row, baseline, flex-start, 0.5rem);

    strong {
      @include display($display-sm, 500);
      color: $on-night;
    }

    span {
      font-size: $text-sm;
    }
  }

  &__title {
    @include display($text-xl);
    color: $on-night;
    max-width: 22ch;
  }

  &__points {
    @include flex(column, stretch, flex-start, 0.7rem);
    list-style: none;
    font-size: $text-sm;
    line-height: 1.5;

    li {
      @include flex(row, flex-start, flex-start, 0.7rem);
    }

    i {
      margin-top: 0.3rem;
      font-size: 0.75rem;
      color: $accent-glow;
    }
  }

  &__note {
    font-size: $text-xs;
    text-align: center;
    color: rgba($on-night, 0.55);
  }

  &__advisor {
    @include flex(column, stretch, flex-start, 0.75rem);
    padding: 1.5rem 1.4rem;
    border: 1px solid $line;
    border-radius: $radius-lg;
    background: $surface;
    font-size: $text-sm;
    line-height: 1.55;
    color: $ink-soft;

    @include from('md') {
      padding: 1.75rem 2.25rem;
    }
  }

  &__advisor-title {
    font-family: $font-principal;
    font-size: $text-lg;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;
  }

  &__channel {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 500;
    color: $ink;

    i {
      color: $success;
    }
  }

  &__wa a {
    font-weight: 600;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
