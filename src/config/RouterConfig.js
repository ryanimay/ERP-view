import { createRouter, createWebHistory } from 'vue-router';
import jwt_encode from 'vue-jwt-decode';
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
    const tokenExpiredv = tokenExpired();
    if ((requiresAuth && isNotAuthenticated && tokenExpiredv)) {
        next({
            path:'/login',
            query:{
                message:'Please re-login.'
            }
        });
    } else {
        next();
    }
});

function isAuthenticated() {
    const user = localStorage.getItem('user');
    return user !== null && user !== undefined;
}

function tokenExpired() {
    const token = localStorage.getItem('token');
    console.log(localStorage);
    const decodedToken = jwt_encode.decode(token);
    console.log(decodedToken);
    if (decodedToken && decodedToken.exp) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        console.log(currentTimestamp);
        return decodedToken.exp < currentTimestamp;
    }
    return true;
}

export default { r, router };