<script setup lang="ts">
const { y } = useWindowScroll()
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <button
    v-show="y > 200" i-carbon-mac-shift text-gray hover:text-dark hover:dark-text-white hover:shadow-xl w-10
    h-10 transition-all text-sm rd-full fixed bottom-8 right-8
    select-none
    @click="scrollToTop()"
  />
</template>

