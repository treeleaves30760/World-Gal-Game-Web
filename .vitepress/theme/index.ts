import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import './landing.css'
import Hero from './components/Hero.vue'
import Pillars from './components/Pillars.vue'
import DevLoop from './components/DevLoop.vue'
import Packs from './components/Packs.vue'
import Features from './components/Features.vue'
import Quickstart from './components/Quickstart.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Hero', Hero)
    app.component('Pillars', Pillars)
    app.component('DevLoop', DevLoop)
    app.component('Packs', Packs)
    app.component('Features', Features)
    app.component('Quickstart', Quickstart)
  },
} satisfies Theme
