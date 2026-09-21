<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { bankLogo } from '@/config/site'
import { copyText } from '@/composables/useTransfer'
import { useToastStore } from '@/stores/toast'
import { transferCopy } from '@/config/copy/checkout'

interface BankAccount {
  bank: string
  type: string
  number: string
  domain: string
}

const props = defineProps<{
  account: BankAccount
  holder: string
  holderId: string
  selected?: boolean
}>()

const emit = defineEmits<{ copied: [bank: string] }>()

const copy = transferCopy.account
const toast = useToastStore()

const logoFailed = ref(false)
const logoUrl = computed(() => (logoFailed.value ? null : bankLogo(props.account.domain)))

// Qué dato se acaba de copiar, para el check del botón.
const justCopied = ref<'number' | 'id' | null>(null)
const announcement = ref('')
let resetTimer: number | undefined

async function copyValue(kind: 'number' | 'id') {
  const ok = await copyText(kind === 'number' ? props.account.number : props.holderId)
  if (!ok) {
    toast.error(copy.copyFailed)
    return
  }
  justCopied.value = kind
  announcement.value = kind === 'number' ? copy.copiedNumber : copy.copiedId
  if (kind === 'number') emit('copied', props.account.bank)

  window.clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => {
    justCopied.value = null
    announcement.value = ''
  }, 2000)
}

onBeforeUnmount(() => window.clearTimeout(resetTimer))
</script>

<template>
  <article class="account" :class="{ 'account--selected': selected }">
    <header class="account__head">
      <span class="account__logo">
        <img
          v-if="logoUrl"
          :src="logoUrl"
          alt=""
          width="40"
          height="40"
          loading="lazy"
          @error="logoFailed = true"
        />
        <i v-else class="fa-solid fa-building-columns" aria-hidden="true"></i>
      </span>
      <div class="account__bank">
        <h4 class="account__name">{{ account.bank }}</h4>
        <p class="account__type">{{ account.type }}</p>
      </div>
    </header>

    <div class="account__number-row">
      <div class="account__number-block">
        <span class="account__label">{{ copy.number }}</span>
        <span class="account__number">{{ account.number }}</span>
      </div>
      <button
        type="button"
        class="account__copy"
        :class="{ 'account__copy--done': justCopied === 'number' }"
        :aria-label="`${copy.copy}: ${copy.number} ${account.bank}`"
        @click="copyValue('number')"
      >
        <i :class="justCopied === 'number' ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true"></i>
        <span>{{ justCopied === 'number' ? copy.copied : copy.copy }}</span>
      </button>
    </div>

    <dl class="account__holder">
      <div class="account__pair">
        <dt class="account__label">{{ copy.holder }}</dt>
        <dd>{{ holder }}</dd>
      </div>
      <div class="account__pair">
        <dt class="account__label">{{ copy.holderId }}</dt>
        <dd class="account__id">
          {{ holderId }}
          <button
            type="button"
            class="account__copy-id"
            :class="{ 'account__copy-id--done': justCopied === 'id' }"
            :aria-label="copy.copyId"
            @click="copyValue('id')"
          >
            <i :class="justCopied === 'id' ? 'fa-solid fa-check' : 'fa-regular fa-copy'" aria-hidden="true"></i>
          </button>
        </dd>
      </div>
    </dl>

    <span class="visually-hidden" role="status" aria-live="polite">{{ announcement }}</span>
  </article>
</template>

<style scoped lang="scss">
.account {
  @include card;
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1.1rem;
  transition:
    border-color 0.25s $ease,
    box-shadow 0.25s $ease;

  &--selected {
    border-color: $accent;
    box-shadow: 0 0 0 1px $accent;
  }

  &__head {
    @include flex(row, center, flex-start, 0.75rem);
  }

  &__logo {
    @include flex(row, center, center);
    flex: 0 0 2.5rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    overflow: hidden;
    background: $sand;
    color: $accent-deep;
    font-size: 0.95rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__bank {
    min-width: 0;
  }

  &__name {
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 600;
    line-height: 1.25;
  }

  &__type {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__label {
    display: block;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__number-row {
    @include flex(row, flex-end, space-between, 0.75rem);
    padding-block: 0.8rem;
    border-block: 1px solid $line;
  }

  &__number-block {
    min-width: 0;
  }

  &__number {
    display: block;
    font-size: 1.12rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    font-variant-numeric: tabular-nums;
    color: $ink;
    overflow-wrap: anywhere;
  }

  &__copy {
    @include flex(row, center, center, 0.4rem);
    flex: 0 0 auto;
    min-height: 2.5rem;
    min-width: 5.9rem;
    padding: 0 0.95rem;
    border: 1px solid $ink;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.04em;
    transition:
      background-color 0.2s $ease,
      color 0.2s $ease,
      border-color 0.2s $ease,
      transform 0.15s $ease;

    @media (hover: hover) {
      &:hover {
        background: $ink;
        color: $surface;
      }
    }

    &:active {
      transform: scale(0.97);
    }

    &--done,
    &--done:hover {
      background: $success-bg;
      border-color: $success;
      color: darken($success, 12);
    }
  }

  &__holder {
    @include flex(row, flex-start, flex-start, 1.25rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__pair {
    min-width: 0;
  }

  &__id {
    @include flex(row, center, flex-start, 0.15rem);
    font-variant-numeric: tabular-nums;
  }

  &__copy-id {
    @include flex(row, center, center);
    width: 2rem;
    height: 2rem;
    margin-block: -0.4rem;
    border-radius: 50%;
    color: $ink-muted;
    font-size: 0.8rem;
    transition:
      color 0.2s $ease,
      background-color 0.2s $ease;

    @media (hover: hover) {
      &:hover {
        color: $ink;
        background: $sand;
      }
    }

    &--done {
      color: $success;
    }
  }
}
</style>
