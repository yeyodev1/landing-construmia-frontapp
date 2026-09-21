<script setup lang="ts">
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import ActivityToasts from '@/components/social/ActivityToasts.vue'
import { headerCopy } from '@/config/copy/shell'
</script>

<template>
  <div class="app">
    <a href="#contenido" class="app__skip">{{ headerCopy.skipLink }}</a>
    <TheHeader />
    <main id="contenido" class="app__main" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
    <!-- Avisos de actividad abajo a la izquierda; los toasts del embudo, abajo a la derecha. -->
    <ActivityToasts />
    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    &:focus {
      outline: none;
    }
  }

  // Para teclado: aparece solo al recibir foco y salta el header.
  &__skip {
    position: fixed;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 400;
    padding: 0.65rem 1rem;
    background: $ink;
    color: $paper;
    font-size: $text-sm;
    font-weight: 600;
    border-radius: $radius-sm;
    transform: translateY(-160%);
    transition: transform 0.2s $ease;

    &:focus-visible {
      transform: none;
    }
  }
}
</style>
