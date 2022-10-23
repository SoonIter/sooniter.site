<script setup lang='ts'>
const { frontmatter } = defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})
const date = useFormatDate(frontmatter.date)
const duration = useFormatDuration(frontmatter?.duration ?? '')

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      const linkElement = document.body.querySelector(decodeURIComponent(location.hash))
      linkElement?.scrollIntoView({ block: 'start', behavior: 'smooth' })
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

// img 预览
const showModal = ref(false as false | HTMLImageElement)
onMounted(() => {
  const arr = Array.from(document.querySelectorAll('.prose img')) as unknown as HTMLImageElement[]

  for (const dom of (arr)) {
    useEventListener(dom, 'click', () => {
      if (showModal.value !== dom) {
        dom.style.visibility = 'hidden'
        showModal.value = dom ?? false
      }
    }, { passive: false })
  }
})

function closeModal() {
  if (showModal.value !== false) {
    (showModal.value as HTMLImageElement).style.visibility = ''
    showModal.value = false
  }
}
</script>

<template>
  <main class="prose" m-auto text-left w-full>
    <Teleport to="body">
      <!-- 使用这个 modal 组件，传入 prop -->
      <modal :show="!!showModal" @close="closeModal">
        <img :src="showModal && showModal.src || ''">
      </modal>
    </Teleport>
    <div v-if="frontmatter.display ?? frontmatter.title" class="mb-8">
      <h1 class="mb-2">
        {{ frontmatter.display ?? frontmatter.title }}
      </h1>
      <div v-if="frontmatter.description" class="text-gray-400 !-mt-6 italic">
        {{ frontmatter.description }}
      </div>

      <div flex flex-row justify-between p-0>
        <div v-if="frontmatter.date">
          <span>{{ date }}</span>
          <span v-if="duration">{{ ` · ${duration}` }}</span>
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
