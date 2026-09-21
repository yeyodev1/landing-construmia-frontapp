<script setup lang="ts">
import { useBookingEmbed } from '@/composables/useBookingEmbed'
import { whatsappLink } from '@/config/site'
import { scheduleCopy as copy } from '@/config/copy/checkout'

const { iframeId, src, loaded, slow, onLoad } = useBookingEmbed()

// Siete columnas por cinco semanas: se arman con flex-wrap, no con grid.
const days = 35
</script>

<template>
  <div class="booking" :aria-busy="!loaded">
    <div v-if="!loaded" class="booking__skeleton" aria-hidden="true">
      <div class="booking__bar">
        <span class="booking__bone booking__bone--month"></span>
        <span class="booking__arrows">
          <span class="booking__bone booking__bone--dot"></span>
          <span class="booking__bone booking__bone--dot"></span>
        </span>
      </div>
      <div class="booking__days">
        <span v-for="day in days" :key="day" class="booking__day">
          <span class="booking__bone booking__bone--day"></span>
        </span>
      </div>
      <span class="booking__bone booking__bone--line"></span>
      <span class="booking__bone booking__bone--slot"></span>
      <span class="booking__bone booking__bone--slot"></span>
      <span class="booking__bone booking__bone--slot"></span>
    </div>

    <p class="visually-hidden" role="status" aria-live="polite">
      {{ loaded ? '' : copy.calendarLoading }}
    </p>

    <iframe
      :id="iframeId"
      class="booking__frame"
      :class="{ 'booking__frame--ready': loaded }"
      :src="src"
      :title="copy.calendarTitle"
      width="100%"
      scrolling="no"
      allow="payment"
      @load="onLoad"
    ></iframe>

    <p class="booking__help" :class="{ 'booking__help--slow': slow }">
      <span>{{ copy.calendarHelp }}</span>
      <a :href="whatsappLink(copy.calendarHelpMessage)" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        {{ copy.calendarHelpAction }}
      </a>
    </p>
  </div>
</template>

<style scoped lang="scss">
.booking {
  position: relative;
  min-height: 45rem;

  @include from('md') {
    min-height: 42rem;
  }

  // El skeleton ocupa el lugar del iframe mientras LeadConnector responde.
  &__skeleton {
    @include flex(column, stretch, flex-start, 1rem);
    position: absolute;
    inset: 0 0 auto;
    padding: 1.5rem 1.25rem;
    border: 1px solid $line;
    border-radius: 14px;
    background: $surface;
  }

  &__bar {
    @include flex(row, center, space-between, 1rem);
    margin-bottom: 0.5rem;
  }

  &__arrows {
    @include flex(row, center, flex-end, 0.5rem);
  }

  &__days {
    display: flex;
    flex-wrap: wrap;
    row-gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  &__day {
    @include flex(row, center, center);
    flex: 0 0 calc(100% / 7);
  }

  &__bone {
    display: block;
    border-radius: $radius-sm;
    background: linear-gradient(100deg, $sand 40%, lighten($sand, 3) 50%, $sand 60%);
    background-size: 220% 100%;
    animation: booking-shimmer 1.6s linear infinite;

    @include reduced-motion {
      animation: none;
    }

    &--month {
      width: 9rem;
      height: 1.4rem;
    }

    &--dot {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    &--day {
      width: 2.1rem;
      height: 2.1rem;
      border-radius: 50%;
    }

    &--line {
      width: 45%;
      height: 1rem;
    }

    &--slot {
      height: 3rem;
      border-radius: $radius-pill;
    }
  }

  // Sin borde y a todo el ancho; form_embed.js le ajusta el alto al contenido.
  &__frame {
    display: block;
    width: 100%;
    min-height: 45rem;
    border: none;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.4s $ease;

    @include from('md') {
      min-height: 42rem;
    }

    &--ready {
      opacity: 1;
    }
  }

  &__help {
    @include flex(row, center, center, 0.35rem 0.75rem);
    flex-wrap: wrap;
    margin-top: 1rem;
    text-align: center;
    font-size: $text-sm;
    color: $ink-muted;
    transition: color 0.3s $ease;

    a {
      @include flex(row, center, center, 0.4rem);
      min-height: 2.75rem;
      font-weight: 600;
      color: $accent-deep;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    // Si tarda demasiado, la salida por WhatsApp se vuelve visible sin gritar.
    &--slow {
      color: $ink;
    }
  }
}

@keyframes booking-shimmer {
  to {
    background-position: -220% 0;
  }
}
</style>
