<script setup lang="ts">
import { useId } from 'vue'
import LeadTextField from '@/components/lead/LeadTextField.vue'
import PhoneField from '@/components/lead/PhoneField.vue'
import CommitmentCheck from '@/components/lead/CommitmentCheck.vue'
import LeadResume from '@/components/lead/LeadResume.vue'
import LeadSelectField from '@/components/lead/LeadSelectField.vue'
import { useLeadForm } from '@/composables/useLeadForm'
import { projectStages, servicesNeeded, startTimeframes } from '@/config/qualification'
import { form as copy, projectTypeQuestion } from '@/config/copy/landing'

const props = defineProps<{
  /** Elegido en el paso 1 del modal: se envía y no se vuelve a preguntar. */
  projectType?: string
  /** Dentro del modal: sin tarjeta ni encabezado propios, los pone el diálogo. */
  bare?: boolean
}>()

const {
  values,
  errors,
  loading,
  summary,
  editing,
  phoneOk,
  showResume,
  resumeName,
  asksProjectType,
  asksService,
  blur,
  input,
  countryChanged,
  fieldId,
  submit,
  resume,
} = useLeadForm(useId(), { projectType: () => props.projectType })
</script>

<template>
  <div class="lead-form" :class="{ 'lead-form--bare': bare }">
    <LeadResume v-if="showResume" :name="resumeName" @resume="resume" @other="editing = true" />

    <form v-else class="lead-form__form" novalidate @submit.prevent="submit">
      <header v-if="!bare" class="lead-form__head">
        <p class="lead-form__step">{{ copy.step }}</p>
        <h2 class="lead-form__title">{{ copy.title }}</h2>
        <p class="lead-form__lead">{{ copy.lead }}</p>
      </header>

      <LeadSelectField
        v-if="asksProjectType"
        :id="fieldId('projectType')"
        v-model="values.projectType"
        name="project-type"
        :label="copy.fields.projectType.label"
        :placeholder="copy.fields.projectType.placeholder"
        :options="projectTypeQuestion.options"
        :error="errors.projectType"
        @blur="blur('projectType')"
      />

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
        :valid="phoneOk?.international"
        @blur="blur('phone')"
        @input="input('phone')"
        @country-change="countryChanged"
      />

      <LeadSelectField
        :id="fieldId('projectStage')"
        v-model="values.projectStage"
        name="project-stage"
        :label="copy.fields.projectStage.label"
        :placeholder="copy.fields.projectStage.placeholder"
        :options="projectStages"
        :error="errors.projectStage"
        @blur="blur('projectStage')"
      />
      <LeadSelectField
        v-if="asksService"
        :id="fieldId('serviceNeeded')"
        v-model="values.serviceNeeded"
        name="service-needed"
        :label="copy.fields.serviceNeeded.label"
        :placeholder="copy.fields.serviceNeeded.placeholder"
        :options="servicesNeeded"
        :error="errors.serviceNeeded"
        @blur="blur('serviceNeeded')"
      />

      <LeadSelectField
        :id="fieldId('startTimeframe')"
        v-model="values.startTimeframe"
        name="start-timeframe"
        :label="copy.fields.startTimeframe.label"
        :placeholder="copy.fields.startTimeframe.placeholder"
        :options="startTimeframes"
        :error="errors.startTimeframe"
        @blur="blur('startTimeframe')"
      />

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

  &--bare {
    background: none;
    border-radius: 0;
    padding: 0;
    box-shadow: none;

    @include from('sm') {
      padding: 0;
    }
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
