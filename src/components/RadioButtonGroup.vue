<template>
  <div class="radio-wrapper">
    <p class="radio-label">{{label}}</p>
    <div class="radio-group">
      <div
          tabindex="0"
          v-for="(option, index) in radioOptions"
          :key="option.id"
          :class="['radio', {'selected' : option.value === selectedRadioOption}]"
          @click="selectOption(option.value)"
          @keydown.prevent.enter="selectOption(option.value)"
      >
        <label :for="option.id">
          {{ option.label }}
        </label>

        <input
            tabindex="-1"
            ref="radioRef"
            type="radio"
            :id="option.id"
            :name="groupName"
            :value="option.value"
            v-model="selectedRadioOption"
        >
      </div>
    </div>
  </div>
</template>


<script generic="T extends string | number" setup lang="ts">
import type { ModelRef } from 'vue'

export interface RadioOption<T extends string | number> {
  label: string
  value: T
  id: string
}

const props = defineProps<{
  radioOptions: RadioOption<T>[]
  label: string
  name?: string
}>()

const selectedRadioOption: ModelRef<T> =
    defineModel('selectedRadioOption', { required: true })

function selectOption(value: T) {
  selectedRadioOption.value = value
}

const groupName = props.name ?? 'radio-group'

function validate(): boolean {
  return selectedRadioOption.value !== undefined
}

defineExpose({
  validate
})

</script>


<style scoped>

.radio-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .radio-label {
    font-weight: bold;
    font-size: 16px;
  }

  .radio-group {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

    .radio {
      padding: 16px;
      border: 1px solid gray;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      align-items: center;

      &.selected {
        border: 1px solid blue;
      }

      label, input {
        cursor: pointer;
      }

      input {
        transform: scale(1.3);
      }
    }

  }
}


</style>