import { createApp } from 'vue'
import App from '@/App.vue'
import {instance, handleError} from '@/config/Axios.js';
import { createPinia } from 'pinia';
import { r } from '@/config/RouterConfig'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import msg from '@/config/AlterConfig.js'

const app = createApp(App);
app.config.globalProperties.$axios = instance;
app.config.globalProperties.$handleError = handleError;
app.config.globalProperties.$msg = msg;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus);
app.use(r);
app.use(createPinia());

app.mount('#app');