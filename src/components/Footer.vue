<script setup lang="ts">
const props = defineProps<{ center?: boolean }>()
const isCenter = props.center ?? false
</script>

<template>
  <footer text-xl m-6 gap-4 text-center :md="isCenter ? 'text-center' : 'text-left'">
    <p text-bold text-4>
      © 2022 - Present SoonIter <a
        target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        style="color:inherit"
        underline
      >CC BY-NC-SA 4.0</a>
    </p>
    <p text-2 text-gray>
      Built with <a href="https://github.com/antfu/vitesse">Vitesse</a>
    </p>
  </footer>
</template>
