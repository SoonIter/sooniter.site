<script setup lang="ts">
useHead({
  title: 'SoonIter的小站',
  meta: [
    { name: 'author', content: 'SoonIter' },
    { name: 'description', content: 'SoonIter\`s personal site. Share some frontend study information and opinions.' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#000' : '#ffffff'),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:creator', content: '@Soon_Iter' },
    { property: 'og:title', content: 'SoonIter' },
    { property: 'og:image', content: 'https://avatars.githubusercontent.com/u/79413249?v=4' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})
</script>

<template>
  <StarportCarrier>
    <RouterView v-slot="{ Component, route }">
      <Transition :name="isLargeScreen ? 'bounce' : 'none'">
        <component :is="Component" :key="route" />
      </Transition>
    </RouterView>
  </StarportCarrier>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in .4s cubic-bezier(0.075, 0.82, 0.165, 1);
}

@keyframes bounce-in {
  from {
    transform: translateX(500px);
  }

  to {
    transform: translateX(0);
  }
}
</style>
