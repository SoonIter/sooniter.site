<script setup lang="ts">
defineProps<{
  link: string
  title: string
  description: string
}>()
</script>

<template>
  <div>
    <a :href="link">{{ title }}</a>
    <p>{{ description }}</p>
  </div>
</template>
