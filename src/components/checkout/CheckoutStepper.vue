<template>
  <div class="stepper">
    <div class="progress-line">
      <div
          class="progress-line-fill"
          :style="{ width: progressWidth }"
      />
    </div>

    <div class="steps">
      <div
          v-for="(step, index) in steps"
          :key="step.key"
          class="step"
          :class="[
          stepState[step.key],
          { active: currentStep === step.key }
        ]"
      >
        <div class="circle">
          <span v-if="stepState[step.key] === 'valid'">✓</span>
          <span v-else-if="stepState[step.key] === 'error'">!</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="label">{{ step.label }}</span>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import type { CheckoutStep, StepState } from '@/stores/checkoutStore'
import { computed } from 'vue'

const props = defineProps<{
  currentStep: CheckoutStep
  stepState: Record<CheckoutStep, StepState>
}>()

const steps = [
  { key: 'simcard', label: 'SIM' },
  { key: 'personal', label: 'Persönlich' },
  { key: 'delivery', label: 'Lieferung' },
  { key: 'payment', label: 'Zahlung' },
  { key: 'summary', label: 'Übersicht' }
] as const

const currentIndex = computed(() =>
    steps.findIndex(s => s.key === props.currentStep)
)

const progressWidth = computed(() => {
  const percent = (currentIndex.value / (steps.length - 1)) * 100
  return `${percent}%`
})
</script>


<style scoped>
.stepper {
  position: relative;
  padding-top: 16px;
}

.progress-line {
  position: absolute;
  top: 28px;
  left: 20px;
  right: 20px;
  height: 2px;
  background: #ddd;
}

.progress-line-fill {
  height: 100%;
  background: #2563eb;
  transition: width 0.3s ease;
}

.steps {
  display: flex;
  justify-content: space-between;

}

.step {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  min-width: 60px;
  z-index: 2;
}

.step.active {
  opacity: 1;
}

.circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step.valid .circle {
  border-color: green;
  color: green;
}

.step.error .circle {
  border-color: red;
  color: red;
}

.step.active:not(.error):not(.valid) .circle {
  border-color: #2563eb;
  color: #2563eb;
}


.label {
  font-size: 12px;
  white-space: nowrap;
}


</style>
