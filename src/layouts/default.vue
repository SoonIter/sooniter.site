<script setup lang="ts">
// y < 200 显示header
// 向上滑动隐藏header，对滑动有防抖处理
// 向下滑动显示header
const { y, throttledIsScrollingToTop } = useThrottledIsScrollingToTop()
</script>

<template>
  <div class="h-auto text-gray-700 dark:text-gray-200 flex flex-col items-center">
    <Header v-show="!throttledIsScrollingToTop || y < 200" />
    <div h-50px />
    <RouterView v-slot="{ Component, route }" h-full px-4 py-8>
      <component :is="Component" :key="route" />
    </RouterView>
    <Footer center />
    <ScrollToTop />
  </div>
</template>
