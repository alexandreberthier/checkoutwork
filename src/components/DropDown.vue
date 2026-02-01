<template>
  <div
      class="dropdown-wrapper"
      tabindex="0"
      @keydown="onKeydown"
  >
    <p class="label">{{label}}</p>
    <button
        class="selected"
        @click="toggleOptions"
        type="button"
    >
      <span>{{ selectedOption }}</span>
      <img :src="getImage('ic_chevron_down.png')" alt="">
    </button>
    <div v-if="error" class="error">
      <img :src="getImage('ic_error.png')" alt="">
      <p> {{ error }}</p>
    </div>
    <div v-if="showOptions" class="options">
      <button
          v-for="(option, index) in options"
          :key="index"
          type="button"
          class="option"
          :class="{ selected: index === activeIndex }"
          @click="selectOption(option)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>


<script generic="T" setup lang="ts">

import {getImage} from "@/utils/ImageUtils.ts";
import {computed, type ModelRef, type Ref, ref} from "vue";

export interface Option<T> {
  label: string,
  value: T
}

const {options, label} = defineProps<{
  options: Option<T>[];
  label: string;
}>()

const showOptions: Ref<boolean> = ref(false)
const activeIndex: Ref<number> = ref(-1)

const selectedOptionValue: ModelRef<T | undefined> = defineModel('selectedOptionValue')
const error: ModelRef<string | undefined> = defineModel('error')

function selectOption(option: Option<T>) {
  selectedOptionValue.value = option.value
  showOptions.value = false;
}

function toggleOptions(): void {
  showOptions.value = !showOptions.value
  activeIndex.value = showOptions.value ? 0 : -1
}

const selectedOption = computed(() => {
  const option = options.find(
      option => option.value === selectedOptionValue.value
  )

  return option ? option.label : 'Bitte auswählen'
})

function onKeydown(event: KeyboardEvent) {
  if (!showOptions.value) {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      showOptions.value = true
      activeIndex.value = 0
      event.preventDefault()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      activeIndex.value =
          (activeIndex.value + 1) % options.length
      event.preventDefault()
      break

    case 'ArrowUp':
      activeIndex.value =
          (activeIndex.value - 1 + options.length) % options.length
      event.preventDefault()
      break

    case 'Enter': {
      const option = options[activeIndex.value]

      if (option) {
        selectOption(option)
      }

      event.preventDefault()
      break
    }


    case 'Escape':
      showOptions.value = false
      activeIndex.value = -1
      event.preventDefault()
      break
  }
}

function validate(): boolean {
  if (!selectedOptionValue.value) {
    error.value = 'Bitte auswählen'
    return false
  }

  error.value = undefined
  return true
}

defineExpose({
  validate
})



</script>

<style scoped>

.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 4px;
  z-index: 2;

  .label {
    font-size: 16px;
    font-weight: bold;
  }

  .error {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 18px;
      height: 18px;
    }

    p {
      color: red;
      font-size: 14px;
    }
  }

  .selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px;
    border-radius: 4px;
    background: none;
    border: 1px solid gray;
    font-size: 16px;
    cursor: pointer;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px 8px;
    border-radius: 4px;
    border: 1px solid gray;
    position: absolute;
    left: 0;
    top: 105%;
    width: 100%;
    background: white;
    max-height: 220px;
    overflow-y: auto;

    .option {
      background: white;
      border: none;
      display: flex;
      padding: 8px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;

      &.selected {
        background: lightgray;
      }

      &:hover {
        background: lightgray;
      }
    }
  }
}

</style>