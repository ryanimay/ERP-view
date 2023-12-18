import { createApp } from 'vue'
import App from './App.vue'
import store  from './config/Store'
import HeaderContainer from './components/header/HeaderContainer.vue'
import BasicBody from './components/body/BasicBody.vue'
import route from './config/RouterConfig'


const app = createApp(App);
app.component('HeaderContainer', HeaderContainer);
app.component('BasicBody', BasicBody);
app.use(route);
app.use(store);
app.mount('#app');