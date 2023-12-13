import { createApp } from 'vue'
import App from './App.vue'
import HeaderLogo from './components/header/HeaderLogo.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/login',
        component: Login
      }
    ]
  })

  router.beforeEach((to, from, next) => {
    if (isAuthenticated()) {
      next();
    } else {
      next('/login');
    }
  });

const app = createApp(App)
app.component('HeaderLogo', HeaderLogo);
app.use(router)
app.mount('#app')
