import { createRouter, createWebHistory } from 'vue-router';
import { verifyJWT } from '@/config/JwtTool';
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
    },
    {
        path: '/client',
        name: 'client',
        components: {
            header: () => import('../components/header/HomeHeader.vue'),
            body: () => import('../components/body/ClinetBody.vue'),
        },
        meta: { requiresAuth: true }
    }
]

export const r = createRouter({
    history: createWebHistory(),
    routes: router
});

r.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(router => router.meta.requiresAuth) === true;
    const user = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    //accessToken未通過&&refreshToken不存在
    //或是accessToken未通過&&refreshToken未通過
    const notApprovedJwt = !verifyJWT(accessToken) && (!refreshToken || !verifyJWT(refreshToken));
    const userExist = isAuthenticated(user);
    //如果是須驗驗證
    if (requiresAuth) {
        //token未通過驗證 || 未登入，導向到login頁面
        if (notApprovedJwt || !userExist) {
            next({
                name: 'login',
                query: {
                    //如果正常登出user會被刪除，就不用顯示提示字
                    message: userExist ? 'Please re-login.' : undefined
                }
            });
        } else {
            const parseUser = JSON.parse(user);
            const mustUpdatePassword = parseUser.mustUpdatePassword;
            const email = parseUser.email;
            if (to.name !== 'updatePassword' && mustUpdatePassword) { //需要更新密碼
                next({ name: 'updatePassword' });
            } else if (to.name !== 'updateEmail' && to.name !== 'updatePassword' && !email) { //需要更新郵件
                next({ name: 'updateEmail' });
            } else {
                next();
            }
        }
        //勾選記住我，並且登入未過期，直接導向首頁
    } else if (to.name === 'login' && userExist && localStorage.getItem('rememberMe') && !notApprovedJwt) {
        next({ name: 'home' });
    } else {
        next();
    }
});

function isAuthenticated(user) {
    if (user) {
        return true;
    } else {
        return false;
    }
}