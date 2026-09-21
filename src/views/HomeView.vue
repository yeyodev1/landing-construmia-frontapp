<script setup lang="ts">
import LandingHero from '@/components/landing/LandingHero.vue'
import LandingProblem from '@/components/landing/LandingProblem.vue'
import LandingStory from '@/components/landing/LandingStory.vue'
import LandingMethod from '@/components/landing/LandingMethod.vue'
import LandingReality from '@/components/landing/LandingReality.vue'
import LandingGallery from '@/components/landing/LandingGallery.vue'
import LandingFit from '@/components/landing/LandingFit.vue'
import LandingStart from '@/components/landing/LandingStart.vue'
import LandingGuarantees from '@/components/landing/LandingGuarantees.vue'
import LandingFaq from '@/components/landing/LandingFaq.vue'
import LandingFinalCta from '@/components/landing/LandingFinalCta.vue'
import LandingStickyCta from '@/components/landing/LandingStickyCta.vue'
</script>

<template>
  <!-- Ritmo: noche, papel, arena, noche... Cada sección termina en un CTA que baja a #registro. -->
  <div class="home">
    <LandingHero />
    <LandingProblem />
    <LandingStory />
    <LandingMethod />
    <LandingReality />
    <LandingGallery />
    <LandingFit />
    <LandingStart />
    <LandingGuarantees />
    <LandingFaq />
    <LandingFinalCta />
    <LandingStickyCta />
  </div>
</template>
