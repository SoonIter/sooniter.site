import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import type { UserModule } from './types'
import { routes } from './config'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/markdown.css'
import './styles/prose.css'
import 'uno.css'

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
  if (savedPosition)
    return savedPosition
  else
    return { top: 0 }
}
// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
  },
)
