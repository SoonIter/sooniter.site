<script setup lang="ts">
const { y } = useWindowScroll()
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition>
    <button
      v-show="y > 200" i-carbon-mac-shift text-gray hover:text-dark hover:dark-text-white hover:shadow-xl w-10
      h-10 text-sm rd-full fixed bottom-8 right-8 select-none @click="scrollToTop()"
    />
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(100px);
}
</style>
