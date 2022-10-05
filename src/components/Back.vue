<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <button btn text-sm @click="router.back()">
    {{ t('button.back') }}
  </button>
</template>
