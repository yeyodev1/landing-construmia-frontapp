<script setup lang="ts">
import BankAccountCard from '@/components/pay/BankAccountCard.vue'
import ReceiptUpload from '@/components/pay/ReceiptUpload.vue'
import { useTransfer } from '@/composables/useTransfer'
import { bankTransfer } from '@/config/site'
import { transferCopy as copy } from '@/config/copy/checkout'

const {
  bank,
  file,
  previewUrl,
  isPdf,
  bankError,
  fileError,
  submitError,
  submitting,
  selectBank,
  selectFile,
  clearFile,
  submit,
} = useTransfer()

// Quien copia el número de una cuenta casi seguro transfiere a esa: se le ahorra un toque.
function onCopied(name: string) {
  if (!bank.value) selectBank(name)
}
</script>

<template>
  <section class="transfer" aria-labelledby="transfer-title">
    <header>
      <h3 id="transfer-title" class="transfer__title">{{ copy.title }}</h3>
      <p class="transfer__subtitle">{{ copy.subtitle }}</p>
    </header>

    <div class="transfer__step">
      <h4 class="transfer__step-title"><span>01</span>{{ copy.steps.accounts }}</h4>
      <div class="transfer__accounts">
        <BankAccountCard
          v-for="account in bankTransfer.accounts"
          :key="account.number"
          :account="account"
          :holder="bankTransfer.holder"
          :holder-id="bankTransfer.holderId"
          :selected="bank === account.bank"
          @copied="onCopied"
        />
      </div>
    </div>

    <form class="transfer__form" novalidate @submit.prevent="submit">
      <fieldset class="transfer__step transfer__fieldset" :aria-invalid="!!bankError">
        <legend class="transfer__step-title"><span>02</span>{{ copy.steps.bank }}</legend>
        <div class="transfer__banks">
          <label
            v-for="account in bankTransfer.accounts"
            :key="account.number"
            class="transfer__bank"
            :class="{ 'transfer__bank--on': bank === account.bank }"
          >
            <input
              class="visually-hidden"
              type="radio"
              name="transfer-bank"
              :value="account.bank"
              :checked="bank === account.bank"
              :disabled="submitting"
              @change="selectBank(account.bank)"
            />
            <i class="fa-solid fa-check transfer__bank-check" aria-hidden="true"></i>
            {{ account.bank }}
          </label>
        </div>
        <p class="transfer__error" role="alert">{{ bankError }}</p>
      </fieldset>

      <div class="transfer__step">
        <h4 class="transfer__step-title"><span>03</span>{{ copy.steps.receipt }}</h4>
        <ReceiptUpload
          :file="file"
          :preview-url="previewUrl"
          :is-pdf="isPdf"
          :error="fileError"
          :disabled="submitting"
          @select="selectFile"
          @clear="clearFile"
        />
      </div>

      <p v-if="submitError" class="transfer__submit-error" role="alert">
        <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        {{ submitError }}
      </p>

      <button type="submit" class="btn btn--primary btn--lg btn--block" :disabled="submitting">
        <i v-if="submitting" class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
        {{ submitting ? copy.submitting : copy.submit }}
      </button>
      <p class="transfer__after">{{ copy.after }}</p>
    </form>
  </section>
</template>

<style scoped lang="scss">
.transfer {
  @include flex(column, stretch, flex-start, 1.75rem);

  &__title {
    @include display($text-xl);
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__step {
    @include flex(column, stretch, flex-start, 0.9rem);
    min-width: 0;
  }

  &__fieldset {
    border: none;
  }

  &__step-title {
    @include flex(row, baseline, flex-start, 0.7rem);
    width: 100%;
    padding: 0 0 0.7rem;
    border-bottom: 1px solid $line;
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.3;
    color: $ink;

    span {
      font-family: $font-display;
      font-size: $text-base;
      font-weight: 500;
      color: $accent;
      font-variant-numeric: tabular-nums;
    }
  }

  // legend no participa del gap del fieldset: el aire se pone a mano.
  legend#{&}__step-title {
    margin-bottom: 0.9rem;
  }

  &__accounts {
    @include flex-cards(15.5rem, 0.75rem);
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.75rem);
  }

  &__banks {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__bank {
    @include flex(row, center, center, 0);
    min-height: 2.75rem;
    margin: 0;
    padding: 0 1.05rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    cursor: pointer;
    transition:
      border-color 0.2s $ease,
      background-color 0.2s $ease,
      color 0.2s $ease,
      transform 0.15s $ease;

    @media (hover: hover) {
      &:hover {
        border-color: $ink-muted;
      }
    }

    &:active {
      transform: scale(0.97);
    }

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--on {
      border-color: $ink;
      background: $ink;
      color: $surface;
    }
  }

  // El check entra creciendo desde cero: la píldora se ensancha sin saltar.
  &__bank-check {
    width: 0;
    opacity: 0;
    font-size: 0.7rem;
    transition:
      width 0.2s $ease,
      margin 0.2s $ease,
      opacity 0.2s $ease;
  }

  &__bank--on &__bank-check {
    width: 0.8rem;
    margin-right: 0.45rem;
    opacity: 1;
  }

  &__error {
    min-height: 1.1rem;
    margin-top: 0.4rem;
    font-size: 0.76rem;
    color: $danger;
  }

  &__submit-error {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.8rem 1rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    font-size: $text-sm;
    color: darken($danger, 12);

    i {
      padding-top: 0.25rem;
    }
  }

  &__after {
    margin-top: -0.9rem;
    text-align: center;
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
