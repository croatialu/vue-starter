import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

import 'vuetify/dist/vuetify.min.css' // 导入Vuetify的CSS样式
import AppExtra from './components/GlobalProvider'

const vuetify = createVuetify()
const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

app.component('AppExtra', AppExtra)

app.use(router).use(vuetify)
app.mount('#app')
