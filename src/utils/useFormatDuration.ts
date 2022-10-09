import type { Ref } from 'vue'

export const useFormatDuration = (_duration: Ref<string> | string) => {
  const { locale } = useI18n()
  const duration = ref(_duration)
  return computed(() => {
    if (locale.value === 'zh-CN')
      return `预计${duration?.value?.replace('min', '分钟')}`
    else
      return duration.value
  })
}
