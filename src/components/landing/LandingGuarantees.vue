<script setup lang="ts">
import { ref } from 'vue'
import { useReveal } from '@/composables/useReveal'
import { cld, cldSet } from '@/config/media'
import { guarantees } from '@/config/copy/landing'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" class="guarantees" aria-labelledby="guarantees-title">
    <div class="guarantees__inner">
      <figure class="guarantees__media reveal">
        <img
          :src="cld(guarantees.image.id, 900)"
          :srcset="cldSet(guarantees.image.id, [480, 720, 960, 1240])"
          sizes="(min-width: 1024px) 440px, 100vw"
          :alt="guarantees.image.alt"
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div class="guarantees__content">
        <header class="guarantees__head reveal">
          <p class="guarantees__eyebrow">{{ guarantees.eyebrow }}</p>
          <h2 id="guarantees-title" class="guarantees__title">{{ guarantees.title }}</h2>
        </header>

        <ul class="guarantees__list">
          <li
            v-for="(item, index) in guarantees.items"
            :key="item.title"
            class="guarantees__item reveal"
            :style="{ transitionDelay: `${index * 90}ms` }"
          >
            <span class="guarantees__icon" aria-hidden="true"><i :class="item.icon"></i></span>
            <div>
              <h3 class="guarantees__item-title">{{ item.title }}</h3>
              <p class="guarantees__item-text">{{ item.text }}</p>
            </div>
          </li>
        </ul>

        <p class="guarantees__proof reveal">{{ guarantees.proof }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.guarantees {
  background: $night;
  color: $on-night;
  padding-block: $space-section;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, $space-xl);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 5rem;
    }
  }

  &__media {
    overflow: hidden;
    border-radius: $radius-sm;
    aspect-ratio: 4 / 3;
    background: $night-soft;

    @include from('lg') {
      flex: 0 0 40%;
      aspect-ratio: 4 / 5;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    @include flex(column, stretch, flex-start, 2.4rem);
    min-width: 0;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 1rem);
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-glow;
  }

  &__title {
    @include display($display-md, 400);
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0);
    border-top: 1px solid $night-line;
  }

  &__item {
    @include flex(row, flex-start, flex-start, 1.1rem);
    padding-block: 1.4rem;
    border-bottom: 1px solid $night-line;
  }

  &__icon {
    flex: 0 0 2.5rem;
    height: 2.5rem;
    @include flex(row, center, center);
    border-radius: 50%;
    border: 1px solid rgba($accent-glow, 0.4);
    color: $accent-glow;
    font-size: 0.9rem;
  }

  &__item-title {
    @include display($text-lg, 500);
    margin-bottom: 0.3rem;
  }

  &__item-text {
    font-size: $text-sm;
    color: $on-night-soft;
  }

  &__proof {
    font-size: $text-sm;
    line-height: 1.7;
    color: $on-night-soft;
    padding-left: 1.1rem;
    border-left: 2px solid $accent-glow;
  }
}
</style>
