import { createApp } from 'vue'
import App from './App.vue'
import store from './config/Store'
import router from './config/RouterConfig'
import axios from './config/Axios.js';
import validate from './config/ValidateConfig';
import icons from './config/IconConfig';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import msg from './config/AlterConfig.js'

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$msg = msg;
app.component('VField', validate.Field);
app.component('VForm', validate.Form);
app.component('ErrorMessage', validate.ErrorMessage);
app.component('font-awesome-icon', icons);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus);
app.use(router.r);
app.use(store);
app.mount('#app');