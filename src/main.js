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
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/LoginForm.vue'),
      }
    },
    {
      path: '/resetPassword',
      name: 'resetPassword',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/ResetPasswordPage.vue'),
      }
    },
    {
      path: '/register',
      name: 'register',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/RegisterPage.vue'),
      }
    },
    {
      path: '/message/:data',
      name: 'messagePage',
      components: {
        header: () => import('./components/header/HalfHeader.vue'),
        body: () => import('./components/body/MessagePage.vue'),
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // const requiresAuth = to.matched.some(router => router.meta.requiresAuth) === true;
  // const isNotAuthenticated = !isAuthenticated();
  // if ((requiresAuth && isNotAuthenticated)) {
  //   next('/login');
  // } else {
    next();
  // }
});

const app = createApp(App);
app.component('HeaderContainer', HeaderContainer);
app.component('BasicBody', BasicBody);
app.use(router);
app.mount('#app');

// function isAuthenticated() {
//   return false;
// }