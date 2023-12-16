<script setup lang="ts">
import dayjs from 'dayjs'

const getFrontMatter = (i: any) => i.children[0].meta.frontmatter
const isDevelopment = useStorage('development', false)
const list = computed(() => config.routes.filter((i) => {
  const isPost = i.path.startsWith('/posts')
  const isWIP = isDevelopment.value ? false : i.path.includes('WIP') || i.path.includes('wip') // 如果是开发中，就显示所有博文
  return isPost && !isWIP
}).sort((a, b) => {
  const dateA = getFrontMatter(a).date
  const dateB = getFrontMatter(b).date
  return dayjs(dateA).isBefore(dayjs(dateB)) ? 1 : -1 // 默认毫秒
}) as any)
</script>

<template>
  <div flex gap-4 flex-col>
    <ArticleCard
      v-for="item in list" :key="item.path" :link="item.path"
      :frontmatter="item.children && item.children[0] && item.children[0].meta?.frontmatter"
    />
  </div>
</template>
