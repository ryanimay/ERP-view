import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '@/config/router/routerConfig';
import '@/config/router/interceptor.js';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import msg from '@/config/alterConfig.js'
import i18n from '@/config/i18nConfig.js'
import '@/assets/css/fontStyle.css';
import '@/assets/css/popover.css';
import '@/assets/css/elTable.css';
import '@/config/resizeObserverFix.js';

const app = createApp(App);
app.config.globalProperties.$msg = msg;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.use(i18n);

app.mount('#app');