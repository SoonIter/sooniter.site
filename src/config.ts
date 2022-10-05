import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from '~pages'

const _routes = generatedRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})
export const routes = setupLayouts(_routes)
const config = {
  nickname: 'SoonIter',
  description: 'Hello world! Today I will make you even better.\n我有一个很切实际的幻想，就是我会让世界变得更好。',
  tabs: ['tabs.articles', 'tabs.others'],
  routes,
} as const
export default config
