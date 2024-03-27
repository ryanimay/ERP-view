import { createApp } from 'vue'
import App from './App.vue'
import store from './config/Store'
import axios from './config/Axios.js';
import { r, getRouters } from './config/RouterConfig'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import msg from './config/AlterConfig.js'

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$msg = msg;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

(async () => {
    r.addRoute(await getRouters(axios));
})();

app.use(ElementPlus);
app.use(r);
app.use(store);
app.mount('#app');