<script setup lang='ts'>
const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

// const base = 'https://antfu.me'
// const tweetUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Reading @antfu7\'s ${base}${route.path}\n\nI think...`)}`)

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      const linkElement = document.body.querySelector(decodeURIComponent(location.hash))
      linkElement?.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
      linkElement?.animate([
        {
          color: 'red',
          easing: 'ease-in',
        },
        {
          easing: 'ease-in',
        },
      ], 1000)
    }
  }

  const handleAnchors = (
    event: MouseEvent & { target: HTMLElement },
  ) => {
    const link = event.target.closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  setTimeout(navigate, 500)
})
</script>

<template>
  <main class="prose" m-auto text-left w-full>
    <div v-if="frontmatter.display ?? frontmatter.title" class="mb-8">
      <h1 class="mb-2">
        {{ frontmatter.display ?? frontmatter.title }}
      </h1>
      <div v-if="frontmatter.description" class="text-gray-400 !-mt-6 italic">
        {{ frontmatter.description }}
      </div>

      <div flex flex-row justify-between p-0>
        <div v-if="frontmatter.date">
          <span>{{ formatDate(frontmatter.date) }}</span>
          <span v-if="frontmatter.duration">{{ ` · ${frontmatter.duration}` }}</span>
        </div>
      </div>
    </div>
    <article ref="content">
      <slot />
    </article>
    <!-- <a v-if="frontmatter.duration" :href="tweetUrl" target="_blank" op50>comment on twitter</a> -->
    <div v-if="route.path !== '/'">
      <Back h-full />
    </div>
  </main>
</template>
