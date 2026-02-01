<template>
  <div class="layout">
    <div class="heading">
      <h1>{{ heading }}</h1>
      <p>{{ subheading}}</p>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

const {heading, subheading} = defineProps<{
  heading?: string,
  subheading?: string,
}>();

</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;

  .heading {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h1, p {
      text-align: center;
    }
  }
}

</style>