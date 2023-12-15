import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import HeaderLogo from './components/header/HeaderLogo.vue'
import HeaderContainer from './components/header/HeaderContainer.vue';
import BasicBody from './components/body/BasicBody.vue';
import HomePage from './components/HomePage.vue';
import HalfHeader from './components/HalfHeader.vue';
import LoginForm from './components/LoginForm.vue';
import ResetPasswordPage from './components/ResetPasswordPage.vue';
import RegisterPage from './components/RegisterPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      components:{
        header: HalfHeader,
        body: HomePage,
      },
    },
    {
      path: '/login',
      name: 'login',
      components:{
        header: HalfHeader,
        body: LoginForm,
      },
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      components:{
        header: HalfHeader,
        body: ResetPasswordPage,
      },
    },
    {
      path: '/register',
      name: 'register',
      components:{
        header: HalfHeader,
        body: RegisterPage,
      },
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login'
    || to.path === '/resetPassword'
    || to.path === '/register'
    || isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
});

const app = createApp(App)
app.component('HeaderContainer', HeaderContainer);
app.component('HeaderLogo', HeaderLogo);
app.component('BasicBody', BasicBody);
app.use(router)
app.mount('#app')

function isAuthenticated() {
  return false;
}
