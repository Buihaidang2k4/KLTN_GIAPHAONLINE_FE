import { createApp } from 'vue'
import './style.css'
import App from './app/App.vue'
import { Toaster } from "vue-sonner";
import router from './app/router';


const app = createApp(App)

app.use(router);
app.component("Toaster", Toaster);
app.mount('#app')
