<template>
  <div class="wrapper">
    <section>
      <InputField
          :input-type="InputType.FirstName"
          ref="firstNameRef"
          label="Vorname"
          v-model:user-input="firstName"
      />

      <InputField
          :input-type="InputType.LastName"
          ref="lastNameRef"
          label="Nachname"
          v-model:user-input="lastName"
      />
    </section>

    <section>
      <InputField
          :input-type="InputType.Email"
          ref="emailRef"
          label="E-Mail"
          v-model:user-input="email"
      />

      <Checkbox
          ref="termsRef"
          label="Ich akzeptiere die AGB"
          v-model:checked="acceptedTerms"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import InputField from '@/components/InputField.vue'
import {useCheckoutStore} from '@/stores/checkoutStore'
import {storeToRefs} from 'pinia'
import {InputType} from "@/utils/InputUtils.ts";
import Checkbox from "@/components/Checkbox.vue";

export interface Validatable {
  validate(): boolean
  scrollToError?: () => void
}

const checkoutStore = useCheckoutStore()
const { firstName, lastName, email, acceptedTerms } = storeToRefs(checkoutStore)

const firstNameRef = ref<Validatable | null>(null)
const lastNameRef = ref<Validatable | null>(null)
const emailRef = ref<Validatable | null>(null)
const termsRef = ref<Validatable | null>(null)

function validate(): boolean {
  let valid = true
  let firstError: Validatable | null = null

  if (!firstNameRef.value?.validate()) {
    checkoutStore.trackValidationError('personal', 'firstName')
    firstError ??= firstNameRef.value
    valid = false
  }

  if (!lastNameRef.value?.validate()) {
    checkoutStore.trackValidationError('personal', 'lastName')
    firstError ??= lastNameRef.value
    valid = false
  }

  if (!emailRef.value?.validate()) {
    checkoutStore.trackValidationError('personal', 'email')
    firstError ??= emailRef.value
    valid = false
  }

  if (!termsRef.value?.validate()) {
    checkoutStore.trackValidationError('personal', 'acceptedTerms')
    firstError ??= termsRef.value
    valid = false
  }

  firstError?.scrollToError?.()

  checkoutStore.setStepState('personal', valid ? 'valid' : 'error')
  return valid
}


defineExpose({ validate })
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
