export const useThrottledIsScrollingToTop = () => {
  const { isScrolling, y, directions } = useScroll(window)
  const { top: toTop } = toRefs(directions)
  const throttledIsScrollingToTop = ref(false)
  let timer: null | number = null
  watchEffect(() => {
    if (isScrolling.value === false) {
      timer !== null && clearTimeout(timer)
      timer = setTimeout(() => {
        throttledIsScrollingToTop.value = false
      }, 750) as unknown as number
    }
    else {
      throttledIsScrollingToTop.value = toTop.value
    }
  })

  return { y, throttledIsScrollingToTop }
}
