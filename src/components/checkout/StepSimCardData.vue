<template>
  <div class="wrapper">
    <section>
      <RadioButtonGroup
          ref="simTypeRef"
          label="SIM-Typ"
          name="simcards"
          :radio-options="radioOptions"
          v-model:selected-radio-option="selectedSimType"
      />
      <Banner
          v-if="selectedSimType === 'esim'"
          :banner-type="BannerType.Warning"
          title="Achtung"
          desc="Dein Telefon muss eSIM unterstützen"
      />
      <InputField
          :required="false"
          :input-type="InputType.CardName"
          v-model:user-input="cardName"
      />
    </section>
    <section>
      <InputField
          ref="phoneRef"
          :input-type="InputType.Phone"
          v-model:user-input="prevPhoneNumber"
          v-model:userError="prevPhoneNumberError"
      />
      <DropDown
          ref="providerRef"
          label="Bisheriger Anbieter"
          :options="providerOptions"
          :error="prevProviderError"
          v-model:selected-option-value="prevProvider"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
export interface Validatable {
  validate(): boolean
  scrollToError?: () => void
}

import DropDown, {type Option} from "@/components/DropDown.vue";
import {type Ref, ref} from "vue";
import RadioButtonGroup, {type RadioOption} from "@/components/RadioButtonGroup.vue";
import Banner from "@/components/Banner.vue";
import {BannerType} from "@/utils/BannerUtils.ts";
import InputField from "@/components/InputField.vue";
import {InputType} from "@/utils/InputUtils.ts";
import {useCheckoutStore} from "@/stores/checkoutStore.ts";
import {storeToRefs} from "pinia";

const checkoutStore = useCheckoutStore();

const {selectedSimType, cardName, prevPhoneNumber, prevProvider} = storeToRefs(checkoutStore)

const prevPhoneNumberError: Ref<string> = ref("");
const prevProviderError: Ref<string> = ref("");


const providerOptions: Ref<Option<string>[]> = ref([
  {label: 'A1', value: 'a1'},
  {label: 'Magenta', value: 'magenta'},
  {label: 'Drei (3)', value: 'drei'},

  {label: 'spusu', value: 'spusu'},
  {label: 'yesss!', value: 'yesss'},
  {label: 'HOT', value: 'hot'},
  {label: 'HoT fix', value: 'hot_fix'},

  {label: 'bob', value: 'bob'},
  {label: 'XOXO', value: 'xoxo'},
  {label: 'educom', value: 'educom'},
])

const radioOptions: Ref<RadioOption<string>[]> = ref([
  {label: "SIM Karte", value: 'sim', id: 'simcard'},
  {label: "eSIM", value: 'esim', id: 'esim'},
])
const phoneRef = ref<Validatable | null>(null)
const providerRef = ref<Validatable | null>(null)
const simTypeRef = ref<Validatable | null>(null)

function validate(): boolean {
  let valid = true
  let firstError: Validatable | null = null

  if (phoneRef.value && !phoneRef.value.validate()) {
    checkoutStore.trackValidationError('simcard', 'prevPhoneNumber')
    firstError ??= phoneRef.value
    valid = false
  }

  if (providerRef.value && !providerRef.value.validate()) {
    checkoutStore.trackValidationError('simcard', 'prevProvider')
    firstError ??= providerRef.value
    valid = false
  }

  if (simTypeRef.value && !simTypeRef.value.validate?.()) {
    checkoutStore.trackValidationError('simcard', 'selectedSimType')
    firstError ??= simTypeRef.value
    valid = false
  }

  firstError?.scrollToError?.()

  checkoutStore.setStepState('simcard', valid ? 'valid' : 'error')
  return valid
}



defineExpose({ validate })


</script>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 42px;
}

section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>