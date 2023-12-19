import { createApp } from 'vue'
import App from './App.vue'
import store  from './config/Store'
import HeaderContainer from './components/header/HeaderContainer.vue'
import BasicBody from './components/body/BasicBody.vue'
import router from './config/RouterConfig'
import axios from './config/Axios.js';

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.component('HeaderContainer', HeaderContainer);
app.component('BasicBody', BasicBody);
app.use(router.r);
app.use(store);
app.mount('#app');