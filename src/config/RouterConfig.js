import { createRouter, createWebHistory } from 'vue-router';

const router = [
    {
        path: '/home',
        name: 'home',
        components: {
            header: () => import('../components/header/HalfHeader.vue'),
            body: () => import('../components/body/HomePage.vue'),
        },
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        components: {
            header: () => import('../components/header/HalfHeader.vue'),
            body: () => import('../components/body/LoginForm.vue'),
        }
    },
    {
        path: '/resetPassword',
        name: 'resetPassword',
        components: {
            header: () => import('../components/header/HalfHeader.vue'),
            body: () => import('../components/body/ResetPasswordPage.vue'),
        }
    },
    {
        path: '/register',
        name: 'register',
        components: {
            header: () => import('../components/header/HalfHeader.vue'),
            body: () => import('../components/body/RegisterPage.vue'),
        }
    },
    {
        path: '/message',
        name: 'messagePage',
        components: {
            header: () => import('../components/header/HalfHeader.vue'),
            body: () => import('../components/body/MessagePage.vue'),
        }
    }
]

const r = createRouter({
    history: createWebHistory(),
    routes: router,
})

r.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(router => router.meta.requiresAuth) === true;
    const isNotAuthenticated = !isAuthenticated();
    if ((requiresAuth && isNotAuthenticated)) {
        next('/login');
    } else {
        next();
    }
});

function isAuthenticated() {
    const user = localStorage.getItem('user');
    return user !== null && user !== undefined;
}

export default {r, router};