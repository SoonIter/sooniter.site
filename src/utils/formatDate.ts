import type { Ref } from '@vue/reactivity'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export function formatDate(d: string | Date) {
  const date = dayjs(d)
  if (date.year() === dayjs().year())
    return date.format('MMM D')
  return date.format('MMM D, YYYY')
}
function formatDateCN(d: string | Date) {
  const date = dayjs(d)
  if (date.year() === dayjs().year())
    return date.locale('zh-cn').format('MMM D日')
  return date.locale('zh-cn').format('MMM D日, YYYY')
}

export const useFormatDate = (_d: string | Date | Ref< string | Date>) => {
  const formattedDate = ref('')
  const d = ref(_d)
  const { locale } = useI18n()
  watchEffect(() => {
    if (locale.value === 'zh-CN')
      formattedDate.value = formatDateCN(d.value)
    else
      formattedDate.value = formatDate(d.value)
  })
  return formattedDate
}
