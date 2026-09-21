<script setup lang="ts">
import { useId } from 'vue'
import LeadTextField from '@/components/lead/LeadTextField.vue'
import PhoneField from '@/components/lead/PhoneField.vue'
import CommitmentCheck from '@/components/lead/CommitmentCheck.vue'
import LeadResume from '@/components/lead/LeadResume.vue'
import { useLeadForm } from '@/composables/useLeadForm'
import { startTimeframes } from '@/config/qualification'
import { form as copy } from '@/config/copy/landing'

const {
  values,
  errors,
  loading,
  summary,
  editing,
  showResume,
  resumeName,
  blur,
  input,
  countryChanged,
  fieldId,
  submit,
  resume,
} = useLeadForm(useId())
</script>

<template>
  <div class="lead-form">
    <LeadResume v-if="showResume" :name="resumeName" @resume="resume" @other="editing = true" />

    <form v-else class="lead-form__form" novalidate @submit.prevent="submit">
      <header class="lead-form__head">
        <p class="lead-form__step">{{ copy.step }}</p>
        <h2 class="lead-form__title">{{ copy.title }}</h2>
        <p class="lead-form__lead">{{ copy.lead }}</p>
      </header>

      <div class="lead-form__row">
        <LeadTextField
          :id="fieldId('firstName')"
          v-model="values.firstName"
          :label="copy.fields.firstName.label"
          :error="errors.firstName"
          type="text"
          name="given-name"
          autocomplete="given-name"
          autocapitalize="words"
          maxlength="60"
          :placeholder="copy.fields.firstName.placeholder"
          @blur="blur('firstName')"
          @input="input('firstName')"
        />
        <LeadTextField
          :id="fieldId('lastName')"
          v-model="values.lastName"
          :label="copy.fields.lastName.label"
          :error="errors.lastName"
          type="text"
          name="family-name"
          autocomplete="family-name"
          autocapitalize="words"
          maxlength="60"
          :placeholder="copy.fields.lastName.placeholder"
          @blur="blur('lastName')"
          @input="input('lastName')"
        />
      </div>

      <LeadTextField
        :id="fieldId('email')"
        v-model="values.email"
        :label="copy.fields.email.label"
        :error="errors.email"
        type="email"
        name="email"
        inputmode="email"
        autocomplete="email"
        autocapitalize="off"
        spellcheck="false"
        maxlength="120"
        :placeholder="copy.fields.email.placeholder"
        @blur="blur('email')"
        @input="input('email')"
      />
      <PhoneField
        :id="fieldId('phone')"
        v-model="values.phone"
        v-model:country="values.phoneCountry"
        :label="copy.fields.phone.label"
        :placeholder="copy.fields.phone.placeholder"
        :error="errors.phone"
        @blur="blur('phone')"
        @input="input('phone')"
        @country-change="countryChanged"
      />

      <div class="field" :class="{ 'field--invalid': errors.startTimeframe }">
        <label :for="fieldId('startTimeframe')">{{ copy.fields.startTimeframe.label }}</label>
        <div class="lead-form__select">
          <select
            :id="fieldId('startTimeframe')"
            v-model="values.startTimeframe"
            name="start-timeframe"
            required
            :class="{ 'is-empty': !values.startTimeframe }"
            :aria-invalid="!!errors.startTimeframe"
            :aria-describedby="`${fieldId('startTimeframe')}-error`"
            @blur="blur('startTimeframe')"
            @change="blur('startTimeframe')"
          >
            <option value="" disabled>{{ copy.fields.startTimeframe.placeholder }}</option>
            <option v-for="option in startTimeframes" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </div>
        <p :id="`${fieldId('startTimeframe')}-error`" class="field__error" aria-live="polite">
          {{ errors.startTimeframe }}
        </p>
      </div>

      <CommitmentCheck
        :id="fieldId('commitment')"
        v-model="values.commitment"
        :text="copy.commitment"
        :error="errors.commitment"
        @change="blur('commitment')"
      />

      <div class="lead-form__submit">
        <p class="lead-form__summary" role="alert">{{ summary }}</p>
        <button
          type="submit"
          class="btn btn--primary btn--lg btn--block"
          :class="{ 'is-loading': loading }"
          :aria-busy="loading"
          :disabled="loading"
        >
          <template v-if="loading">
            <i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
            {{ copy.submitting }}
          </template>
          <template v-else>
            {{ copy.submit }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </template>
        </button>
        <p class="lead-form__privacy">
          <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.privacy }}
        </p>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.lead-form {
  background: $paper;
  color: $ink;
  border-radius: $radius-md;
  padding: 1.5rem 1.25rem;
  box-shadow: $shadow-lg;

  @include from('sm') {
    padding: 2rem 1.9rem;
  }

  &__form {
    @include flex(column, stretch, flex-start, 0.95rem);
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.3rem);
    margin-bottom: 0.2rem;
  }

  &__step {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl);
  }

  &__lead {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.95rem 0.75rem;

    > .field {
      flex: 1 1 7.5rem;
    }
  }

  &__select {
    position: relative;

    // 16 px en el control: por debajo de eso iOS hace zoom al enfocar.
    select {
      font-size: 1rem;
      appearance: none;
      padding-right: 2.4rem;
      cursor: pointer;

      &.is-empty {
        color: $ink-muted;
      }
    }

    i {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.65rem;
      color: $ink-muted;
      pointer-events: none;
    }
  }

  .field__error:empty {
    margin-top: 0;
  }

  &__submit {
    @include flex(column, stretch, flex-start, 0.7rem);
    margin-top: 0.2rem;

    // Cargando se sigue leyendo: el disabled global lo dejaba casi invisible.
    .btn.is-loading {
      opacity: 0.8;
    }
  }

  &__summary {
    font-size: $text-sm;
    font-weight: 500;
    color: $danger;

    &:empty {
      display: none;
    }
  }

  &__privacy {
    font-size: $text-xs;
    // ink-soft y no muted: a este tamaño el gris claro no llega a 4.5:1 sobre papel.
    color: $ink-soft;
    text-align: center;

    i {
      margin-right: 0.3rem;
      font-size: 0.65rem;
    }
  }
}
</style>
