import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initPixel } from '@/utils/pixel'
import '@/styles/global.scss'

initPixel()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
