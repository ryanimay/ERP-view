import { createRouter, createWebHistory } from 'vue-router';
import jwt_encode from 'vue-jwt-decode';
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
    }
]

const r = createRouter({
    history: createWebHistory(),
    routes: router,
})

r.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(router => router.meta.requiresAuth) === true;
    const isNotAuthenticated = !isAuthenticated();
    const tokenExpiredv = tokenExpired(requiresAuth);
    //如果是須驗驗證 且 未登入 或 token過期，導向到login頁面
    if (requiresAuth && (isNotAuthenticated || tokenExpiredv)) {
        next({
            path:'/login',
            query:{
                //如果正常登出isNotAuthenticated會被刪除，就不用顯示提示字
                message: isNotAuthenticated ? undefined : 'Please re-login.'
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

function tokenExpired(requiresAuth) {
    const token = localStorage.getItem('token');
    if(token){
        try {
            const decodedToken = jwt_encode.decode(token);
            if (decodedToken && decodedToken.exp) {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                return decodedToken.exp < currentTimestamp;
            }
        } catch (error) {
            console.log('ErrorToken:' + error);
        }
        return true;
    }else{
        if(requiresAuth == false){//不須驗證的url就放行
            return false;
        }else{
            return true;
        }
    }
}

export default { r, router };