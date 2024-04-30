import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia';
import router from '@/config/router/routerConfig';
import '@/config/router/interceptor.js';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import msg from '@/config/AlterConfig.js'

const app = createApp(App);
app.config.globalProperties.$msg = msg;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus);
app.use(router);
app.use(createPinia());

app.mount('#app');