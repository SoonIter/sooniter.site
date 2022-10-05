<script setup lang="ts">
import dayjs from 'dayjs'

const getFrontMatter = (i: any) => i.children[0].meta.frontmatter
const list: any[] = reactive(config.routes.filter(i => i.path.startsWith('/posts')).sort((a, b) => {
  const dateA = getFrontMatter(a).date
  const dateB = getFrontMatter(b).date
  return dayjs(dateA).isBefore(dayjs(dateB)) ? 1 : -1 // 默认毫秒
}))
</script>

<template>
  <div flex gap-4 flex-col>
    <ArticleCard
      v-for="item in list" :key="item.path" :link="item.path"
      :frontmatter="item.children && item.children[0] && item.children[0].meta?.frontmatter"
    />
  </div>
</template>
