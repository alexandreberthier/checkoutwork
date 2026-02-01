<template>
  <label class="checkbox">
    <input
        type="checkbox"
        v-model="checked"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
}>()

const checked = defineModel<boolean>('checked', { required: true })

function validate(): boolean {
  return checked.value === true
}

defineExpose({ validate })
</script>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
</style>
