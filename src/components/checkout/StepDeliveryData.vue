<template>
  <div class="wrapper">
    <section>
      <InputField
          :input-type="InputType.Address"
          ref="streetRef"
          label="Straße"
          v-model:user-input="street"
      />

      <InputField
          :input-type="InputType.PostalCode"
          ref="zipRef"
          label="PLZ"
          v-model:user-input="zip"
      />

      <DropDown
          ref="countryRef"
          label="Land"
          :options="countryOptions"
          v-model:selected-option-value="country"
      />
    </section>

    <Checkbox
        v-model:checked="differentBilling"
        label="Rechnungsadresse ist unterschiedlich"
    />

    <section v-if="differentBilling">
      <InputField
          :input-type="InputType.Address"
          ref="billingStreetRef"
          label="Rechnungsstraße"
          v-model:user-input="billingStreet"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import InputField from '@/components/InputField.vue'
import DropDown from '@/components/DropDown.vue'
import Checkbox from '@/components/Checkbox.vue'
import {useCheckoutStore} from '@/stores/checkoutStore'
import {storeToRefs} from 'pinia'
import {InputType} from "@/utils/InputUtils.ts";

export interface Validatable {
  validate(): boolean
  scrollToError?: () => void
}

const checkoutStore = useCheckoutStore()
const {
  street,
  zip,
  country,
  differentBilling,
  billingStreet
} = storeToRefs(checkoutStore)

const streetRef = ref<Validatable | null>(null)
const zipRef = ref<Validatable | null>(null)
const countryRef = ref<Validatable | null>(null)
const billingStreetRef = ref<Validatable | null>(null)

const countryOptions = [
  { label: 'Österreich', value: 'AT' },
  { label: 'Deutschland', value: 'DE' }
]

function validate(): boolean {
  let valid = true

  if (!streetRef.value?.validate()) valid = false
  if (!zipRef.value?.validate()) valid = false
  if (!countryRef.value?.validate()) valid = false

  if (differentBilling.value) {
    if (!billingStreetRef.value?.validate()) valid = false
  }

  checkoutStore.setStepState('delivery', valid ? 'valid' : 'error')
  return valid
}

defineExpose({ validate })
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
