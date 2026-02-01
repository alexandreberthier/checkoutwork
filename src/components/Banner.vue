<template>
  <div :class="['banner', bannerType]">
    <div class="icon-wrapper">
      <img :src="getImage(bannerIcon)" alt="">
    </div>
    <div class="text">
      <p class="title">{{ title }}</p>
      <p class="desc" v-if="desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import {BannerType} from "@/utils/BannerUtils.ts";
import {computed, type ComputedRef} from "vue";
import {getImage} from "@/utils/ImageUtils.ts";

const {bannerType, title, desc} = defineProps<{
  bannerType: BannerType;
  title: string;
  desc: string;

}>()

const bannerIcon: ComputedRef<string> = computed(() => {
  switch (bannerType) {
    case BannerType.Info:
      return 'ic_info.png'
    case BannerType.Success:
      return 'ic_success.png'
    case BannerType.Warning:
      return 'ic_alert.png'
    case BannerType.Error:
      return 'ic_error.png'
    default:
      return ''
  }
})

const computedFlex: ComputedRef<string> = computed(() => desc ? 'flex-start' : 'center')

</script>

<style scoped>

.banner {
  display: flex;
  align-items: v-bind(computedFlex);
  padding: 8px;
  border-radius: 8px;
  border: 2px solid gray;
  gap: 4px;

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 32px;
      height: 32px;
    }
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      font-weight: bold;
    }

    .desc {
      font-size: 14px;
    }
  }

  &.error {
    border: 2px solid red;
    background-color: lightcoral;
  }

  &.success {
    border: 2px solid green;
    background-color: lightgreen;
  }

  &.warning {
    border: 2px solid orange;
    background-color: lightyellow;
  }

  &.info {
    border: 2px solid blue;
    background-color: lightblue;
  }
}

</style>