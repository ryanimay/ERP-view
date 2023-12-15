import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import HeaderContainer from './components/header/HeaderContainer.vue'
import BasicBody from './components/body/BasicBody.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/HomePage.vue'),
      },
    },
    {
      path: '/login',
      name: 'login',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/LoginForm.vue'),
      },
      meta: {
        transitionEnabled: true,
      },
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/ResetPasswordPage.vue'),
      },
      meta: {
        transitionEnabled: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/RegisterPage.vue'),
      },
      meta: {
        transitionEnabled: true,
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

const app = createApp(App);
app.component('HeaderContainer', HeaderContainer);
app.component('BasicBody', BasicBody);
app.use(router);
app.mount('#app');

function isAuthenticated() {
  return false;
}