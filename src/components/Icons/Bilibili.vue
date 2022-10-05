<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <a
    class="icon-btn" rel="noreferrer" href="https://space.bilibili.com/12711514" target="_blank"
    :title="t('button.bilibili')"
    hover="text-#479fd1"
  >
    <div i-ri-bilibili-fill />
  </a>
</template>
