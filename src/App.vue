<template>
  <div class="site-wrapper">
    <nav>
    </nav>
    <main>
      <RouterView/>
    </main>
    <footer>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

.site-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 100vh;
  width: calc(100% - 64px);
  margin: 0 auto;

  main {
    flex: 1;
  }
}

@media (min-width: 740px) {
  .site-wrapper {
    width: 620px;
  }
}


@media (min-width: 1440px) {
  .site-wrapper {
    width: 1120px;
  }
}


</style>