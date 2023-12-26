import { createApp } from 'vue'
import App from './App.vue'
import store from './config/Store'
import HeaderContainer from './components/header/HeaderContainer.vue'
import BasicBody from './components/body/BasicBody.vue'
import router from './config/RouterConfig'
import axios from './config/Axios.js';
import validate from './config/ValidateConfig';
import icons from './config/IconConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap';

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.component('HeaderContainer', HeaderContainer);
app.component('BasicBody', BasicBody);
app.component('VField', validate.Field);
app.component('VForm', validate.Form);
app.component('ErrorMessage', validate.ErrorMessage);
app.component('font-awesome-icon', icons);
app.use(router.r);
app.use(store);
app.mount('#app');