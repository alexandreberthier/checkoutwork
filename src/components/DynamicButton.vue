<template>
  <component
      :is="path ? 'router-link' : 'button'"
      v-bind="mergedProps"
      :class="[buttonType]"
  >
    <span>{{text}}</span>
    <img :src="getImage('ic_chevron_right_white.png')" alt="">
  </component>
</template>

<script setup lang="ts">

import {getImage} from "@/utils/ImageUtils.ts";
import {computed, useAttrs} from "vue";
import {ButtonType} from "@/utils/ButtonType.ts";

const attrs = useAttrs()

const {buttonType = ButtonType.Primary, text,path} = defineProps<{
  buttonType: ButtonType
  text: string
  path?: string;
}>()

const mergedProps = computed(() => {
  return {
    ...attrs,
    ...(path ? { to: { name: path } } : {})
  }
})
</script>

<style scoped>

button, a {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 4px;
  border-radius: 4px;
  border: none;
  background: darkslategray;
  padding: 12px 16px;
  width: 100%;

  &.secondary {
    flex-direction: row-reverse;
    background: white;
    border: 1px solid darkslategray;

    span {
      color: black;
    }

    img {
      transform: rotate(180deg);
      filter: invert(1);
    }
  }

  span {
    color: white;
    font-size: 16px;
  }

  img {
    width: 20px;
    height: 20px;
  }

}

</style>