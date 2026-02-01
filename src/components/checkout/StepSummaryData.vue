<template>
  <div class="wrapper">
    <p class="summary">
      Bitte überprüfe deine Angaben sorgfältig.
    </p>

    <Checkbox
        ref="confirmRef"
        label="Ich bestätige die Richtigkeit aller Angaben"
        v-model:checked="confirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '@/components/Checkbox.vue'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { storeToRefs } from 'pinia'

export interface Validatable {
  validate(): boolean
  scrollToError?: () => void
}


const checkoutStore = useCheckoutStore()
const { confirmed } = storeToRefs(checkoutStore)

const confirmRef = ref<Validatable | null>(null)

function validate(): boolean {
  const valid = confirmRef.value?.validate() ?? false

  if (!valid) {
    checkoutStore.trackValidationError('summary', 'confirmed')
    confirmRef.value?.scrollToError?.()
  }

  checkoutStore.setStepState('summary', valid ? 'valid' : 'error')

  if (valid) {
    checkoutStore.finishCheckout() // ⏱ Dauer wird gespeichert
  }

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

.summary {
  font-size: 14px;
}
</style>
