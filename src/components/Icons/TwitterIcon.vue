<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <a
    rel="noreferrer" href="https://github.com/sooniter" target="_blank"
    :title="t('button.twitter')"
    class="hover:text-#4a99e9 icon-btn"
  >
    <div i-carbon-logo-twitter />
  </a>
</template>
