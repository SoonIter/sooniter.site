<script setup lang="ts">
import type { Ref } from '@vue/reactivity'

const props = defineProps<{
  link: string
  frontmatter?: {
    title?: string
    description?: string
    image?: string
    duration?: string
    lang?: 'zh' | 'en'
    date?: Date
  }
}>()
const link = toRef(props, 'link')
const { title = ref(''), description = ref(''), duration: _duration = ref(''), image: _image = ref(''), lang, date: _date = ref('') } = toRefs(props.frontmatter ?? {})
// date
const date = useFormatDate(_date as Ref<string>)
const duration = useFormatDuration(_duration as Ref<string>)

// image
const image = computed(() => {
  const defaultImgUrl = 'https://demo.stack.jimmycai.com/p/hello-world/cover_hud7e36f7e20e71be184458283bdae4646_55974_1600x0_resize_q75_box.jpg'
  const imgUrl = _image.value ?? ''
  if (imgUrl === '' || imgUrl === 'default')
    return defaultImgUrl

  return /^(https?)|(\/imgs)/.test(imgUrl)
    ? imgUrl
    : `/imgs/${imgUrl}`
})
</script>

<template>
  <RouterLink :to="link">
    <div card w-full flex flex-col p-0>
      <img v-if="true" h-30 object-cover border-box class="image" dark:opacity-60 :alt="title" :src="image">
      <div flex-1 p-4 md:p-6>
        <h2 text-xl md:text-2xl font-bold flex items-center gap-1>
          <English v-if="lang === 'en'" />
          <span v-if="title">{{ title }}</span>
        </h2>
        <h3 v-if="description" text-sm md:text-base text="#747474">
          {{ description }}
        </h3>
        <h4 mt-2 text-sm md:text-lg>
          <span v-if="date">{{ date }}</span>
          <span v-if="_duration && duration">{{ ` · ${duration}` }}</span>
        </h4>
      </div>
    </div>
  </RouterLink>
</template>

<style>
.image {
  border-radius: 16px 16px 0 0;
  object-fit: cover;
  aspect-ratio: auto 800 / 534;
}
</style>
