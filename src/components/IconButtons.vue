<script setup lang="ts">
const props = defineProps<{ onlyShowLink?: boolean }>()
</script>

<template>
  <nav text-xl mt-6 flex flex-col gap-4>
    <section gap-4 flex justify-center md:justify-start>
      <Github />
      <TwitterIcon />
      <Bilibili />
      <Juejin />
      <Zhihu />
      <Leetcode />
    </section>
    <section
      v-if="props.onlyShowLink !== undefined && props.onlyShowLink === false" flex gap-4 justify-center
      md:justify-start
    >
      <Home />
      <About />
      <Dark />
      <Language />
    </section>
  </nav>
</template>
