<script setup lang="ts">
import { ref } from 'vue'
import VisitIntro from '@/components/pay/VisitIntro.vue'
import VisitDetails from '@/components/pay/VisitDetails.vue'
import PayMethodTabs from '@/components/pay/PayMethodTabs.vue'
import PayphoneBox from '@/components/pay/PayphoneBox.vue'
import BankTransfer from '@/components/pay/BankTransfer.vue'
import { cld, cldSet } from '@/config/media'
import { payCopy as copy } from '@/config/copy/checkout'

const PHOTO = 'fotos-reales/obra-en-proceso/real-obra-02'

const method = ref<'card' | 'transfer'>('card')
const tabs = ref<InstanceType<typeof PayMethodTabs> | null>(null)
</script>

<template>
  <div class="pay">
    <div class="pay__aside">
      <section class="pay__intro" aria-labelledby="pay-title">
        <figure class="pay__photo">
          <img
            :src="cld(PHOTO, 1200)"
            :srcset="cldSet(PHOTO, [480, 800, 1200])"
            sizes="(min-width: 1024px) 50vw, 100vw"
            :alt="copy.imageAlt"
            width="1194"
            height="1280"
            fetchpriority="high"
          />
        </figure>
        <div class="pay__block">
          <VisitIntro title-id="pay-title" />
        </div>
      </section>

      <section class="pay__details" aria-labelledby="pay-includes">
        <div class="pay__block">
          <VisitDetails title-id="pay-includes" />
        </div>
      </section>
    </div>

    <section class="pay__checkout" aria-labelledby="pay-method">
      <div class="pay__block pay__block--checkout">
        <h2 id="pay-method" class="pay__method-title">{{ copy.methodTitle }}</h2>
        <PayMethodTabs ref="tabs" v-model="method" class="pay__tabs" />

        <!-- v-show y no v-if: cambiar de pestaña no crea otra orden ni pierde el comprobante elegido. -->
        <div
          v-show="method === 'card'"
          id="pay-panel-card"
          class="pay__panel"
          role="tabpanel"
          aria-labelledby="pay-tab-card"
        >
          <PayphoneBox @use-transfer="tabs?.activate('transfer', true)" />
        </div>
        <div
          v-show="method === 'transfer'"
          id="pay-panel-transfer"
          class="pay__panel"
          role="tabpanel"
          aria-labelledby="pay-tab-transfer"
        >
          <BankTransfer />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
// Móvil: resumen → pago → detalle. Escritorio: resumen y detalle a la izquierda, pago a la derecha.
.pay {
  display: flex;
  flex-direction: column;
  flex: 1;

  @include from('lg') {
    flex-direction: row;
  }

  // En móvil la columna izquierda se "disuelve" para que el pago quede entre sus dos bloques.
  &__aside {
    display: contents;

    @include from('lg') {
      display: flex;
      flex-direction: column;
      flex: 1 1 50%;
      min-width: 0;
      background: $night;
    }
  }

  &__intro,
  &__details {
    background: $night;
  }

  &__intro {
    order: 1;
  }

  &__checkout {
    order: 2;
    flex: 1 1 50%;
    min-width: 0;
    background: $paper;
  }

  &__details {
    order: 3;
  }

  &__block {
    width: 100%;
    max-width: 35rem;
    margin-inline: auto;
    padding: 1.75rem 1.25rem 2.25rem;

    @include from('md') {
      padding: 2.25rem 2rem 2.75rem;
    }

    // Cada mitad se alinea contra el eje central de la página.
    @include from('lg') {
      margin-right: 0;
      padding: 2.5rem 3.5rem 2.5rem 2rem;
    }

    &--checkout {
      padding-block: 2rem 3rem;

      @include from('lg') {
        margin-inline: 0 auto;
        padding: 3rem 2rem 4rem 3.5rem;
      }
    }
  }

  &__details &__block {
    padding-top: 2.5rem;

    @include from('lg') {
      padding-top: 0;
      padding-bottom: 4rem;
    }
  }

  &__photo {
    position: relative;
    height: clamp(11rem, 46vw, 19rem);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 88%;
    }

    // La foto se funde con el panel: no se lee como una tarjeta pegada encima.
    &::after {
      content: '';
      position: absolute;
      inset: 40% 0 0;
      background: linear-gradient(to bottom, rgba($night, 0), $night);
    }

    @include from('lg') {
      height: clamp(15rem, 38vh, 24rem);
    }
  }

  &__method-title {
    @include display($display-sm);
  }

  &__tabs {
    margin-top: 1.25rem;
  }

  &__panel {
    margin-top: 1.75rem;
  }
}
</style>
