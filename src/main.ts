import { createApp } from 'vue'
import './style.css'
import App from './app/App.vue'
import { Toaster } from "vue-sonner";
import router from './app/router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import 'vue-sonner/style.css'
import { queryClient } from './hooks/queries/queryClient';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router);
app.use(VueQueryPlugin, { queryClient: queryClient });
app.component("Toaster", Toaster);
app.use(pinia);
app.mount('#app')
