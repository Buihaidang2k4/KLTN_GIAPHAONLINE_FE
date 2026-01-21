import { createApp } from 'vue'
import './style.css'
import App from './app/App.vue'
import { Toaster } from 'vue-sonner'
const app = createApp(App)

app.component('Toaster', Toaster)
app.mount('#app')
