import { createRouter, createWebHistory } from 'vue-router';
import { tokenExpired } from '@/config/JwtTool';
const router = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        components: {
            header: () => import('../components/header/HomeHeader.vue'),
            body: () => import('../components/body/HomeBody.vue'),
        },
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        components: {
            header: () => import('../components/header/LoginHeader.vue'),
            body: () => import('../components/body/LoginBody.vue'),
        }
    },
    {
        path: '/forgetPassword',
        name: 'forgetPassword',
        components: {
            header: () => import('../components/header/LoginHeader.vue'),
            body: () => import('../components/body/ResetPasswordBody.vue'),
        }
    },
    {
        path: '/updatePassword',
        name: 'updatePassword',
        components: {
            header: () => import('../components/header/LoginHeader.vue'),
            body: () => import('../components/body/UpdatePasswordBody.vue'),
        },
        meta: { requiresAuth: true }
    },
    {
        path: '/updateEmail',
        name: 'updateEmail',
        components: {
            header: () => import('../components/header/LoginHeader.vue'),
            body: () => import('../components/body/UpdateEmailBody.vue'),
        },
        meta: { requiresAuth: true }
    }
]

const r = createRouter({
    history: createWebHistory(),
    routes: router,
})

r.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(router => router.meta.requiresAuth) === true;
    const userExist = isAuthenticated();
    const tokenExpiredv = tokenExpired(localStorage.getItem('token'));
    //如果是須驗驗證 且 未登入 或 token過期，導向到login頁面
    if (requiresAuth && (!userExist || tokenExpiredv)) {
        next({
            name: 'login',
            query: {
                //如果正常登出user會被刪除，就不用顯示提示字
                message: userExist ? 'Please re-login.' : undefined
            }
        });
    } else {
        if (to.name === 'login'
            && userExist
            && localStorage.getItem('rememberMe')
            && !tokenExpiredv) {
            next({
                name: 'home'
            });
        }
        next();
    }
});

function isAuthenticated() {
    const user = localStorage.getItem('user');
    return user !== null && user !== undefined;
}

export default { r, router };