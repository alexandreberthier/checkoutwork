<template>
  <div class="wrapper">
    <RadioButtonGroup
        ref="paymentRef"
        label="Zahlungsart"
        :radio-options="paymentOptions"
        v-model:selected-radio-option="paymentMethod"
    />

    <section v-if="paymentMethod === 'creditcard'">
      <InputField
          :input-type="InputType.Text"
          ref="ccNumberRef"
          label="Kartennummer"
          v-model:user-input="ccNumber"
      />

      <InputField
          :input-type="InputType.Text"
          ref="ccCvcRef"
          label="CVC"
          v-model:user-input="ccCvc"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import RadioButtonGroup from '@/components/RadioButtonGroup.vue'
import InputField from '@/components/InputField.vue'
import {useCheckoutStore} from '@/stores/checkoutStore'
import {storeToRefs} from 'pinia'
import {InputType} from "@/utils/InputUtils.ts";

export interface Validatable {
  validate(): boolean
  scrollToError?: () => void
}

const checkoutStore = useCheckoutStore()
const { paymentMethod, ccNumber, ccCvc } = storeToRefs(checkoutStore)

const paymentRef = ref<Validatable | null>(null)
const ccNumberRef = ref<Validatable | null>(null)
const ccCvcRef = ref<Validatable | null>(null)

const paymentOptions = [
  { label: 'Kreditkarte', value: 'creditcard', id: 'cc' },
  { label: 'PayPal', value: 'paypal', id: 'pp' }
]

function validate(): boolean {
  let valid = true
  let firstError: Validatable | null = null

  if (!paymentRef.value?.validate()) {
    checkoutStore.trackValidationError('payment', 'paymentMethod')
    firstError ??= paymentRef.value
    valid = false
  }

  if (paymentMethod.value === 'creditcard') {
    if (!ccNumberRef.value?.validate()) {
      checkoutStore.trackValidationError('payment', 'ccNumber')
      firstError ??= ccNumberRef.value
      valid = false
    }

    if (!ccCvcRef.value?.validate()) {
      checkoutStore.trackValidationError('payment', 'ccCvc')
      firstError ??= ccCvcRef.value
      valid = false
    }
  }

  firstError?.scrollToError?.()

  checkoutStore.setStepState('payment', valid ? 'valid' : 'error')
  return valid
}


defineExpose({ validate })
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
