<template>
  <div class="input-wrapper">
    <label :for="inputConfiguration.name">
      {{ inputConfiguration.label }}
    </label>

    <input
        ref="inputRef"
        :id="inputConfiguration.name"
        :name="inputConfiguration.name"
        :type="inputConfiguration.type"
        :autocomplete="inputConfiguration.autocomplete"
        :placeholder="inputConfiguration.placeholder"
        :class="{ 'inp-error': userError }"
        @input="onInput"
        v-model="userInput"
        @blur="validate"
    >

    <div v-if="userError" class="error">
      <img :src="getImage('ic_error.png')" alt="">
      <p> {{ userError }}</p>
    </div>
  </div>
</template>


<script setup generic="T" lang="ts">

import {computed, type ComputedRef, type ModelRef, useTemplateRef} from "vue";
import {type InputConfig, inputSettings, InputType} from "@/utils/InputUtils.ts";
import {getImage} from "@/utils/ImageUtils.ts";

const userInput: ModelRef<string | undefined> = defineModel('userInput')
const userError: ModelRef<string | undefined> = defineModel('userError')

const {inputType = InputType.Text, required = true} = defineProps<{
  inputType: InputType
  required?: boolean
}>()

const inputConfiguration: ComputedRef<InputConfig> = computed(() => {
  return inputSettings[inputType]
})

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

function validate(): boolean {
  const value = userInput.value ?? ''

  if (!required && value.trim().length === 0) {
    userError.value = undefined
    return true
  }

  const validationFunction = inputConfiguration.value.validationFunction

  if (!validationFunction) {
    userError.value = undefined
    return true
  }

  const isValid = validationFunction(value)

  userError.value = isValid
      ? undefined
      : inputConfiguration.value.errorText

  return isValid
}

function focus(): void {
  inputRef.value?.focus()
}

function onInput() {
  userError.value = undefined
}


defineExpose({
  validate,
  focus
})
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  label {
    font-size: 16px;
    font-weight: bold;
  }

  input {
    padding: 12px 16px;
    border-radius: 4px;
    background: none;
    border: 1px solid gray;
    font-size: 16px;

    &.inp-error {
      border: 2px solid red;
    }

    &:focus {
      outline: 1px solid blue;

    }
  }

  .error {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 20px;
      height: 20px;
    }

    p {
      color: red;
      font-size: 14px;
    }
  }
}

</style>