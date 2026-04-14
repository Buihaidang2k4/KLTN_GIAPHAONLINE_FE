import { createApp } from 'vue'
import './style.css'
import App from './app/App.vue'
import { Toaster } from "vue-sonner";
import router from './app/router';
import { VueQueryPlugin } from '@tanstack/vue-query';
import 'vue-sonner/style.css'


const app = createApp(App)

app.use(router);
app.use(VueQueryPlugin);
app.component("Toaster", Toaster);
app.mount('#app')
