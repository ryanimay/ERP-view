import { createRouter, createWebHistory } from 'vue-router';
//parentName是用來生成navigation的顯示路徑，以':'開頭就不會顯示可點擊連結
const routerPath = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/HomeBody.vue'),
        },
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/LoginBody.vue'),
        }
    },
    {
        path: '/forgetPassword',
        name: 'forgetPassword',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/ResetPasswordBody.vue'),
        }
    },
    {
        path: '/updatePassword',
        name: 'updatePassword',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/UpdatePasswordBody.vue'),
        },
        meta: { requiresAuth: true }
    },
    {
        path: '/updateEmail',
        name: 'updateEmail',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/UpdateEmailBody.vue'),
        },
        meta: { requiresAuth: true }
    },
    {
        path: '/client',
        name: 'client',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/ClinetBody.vue'),
        },
        meta: { 
            requiresAuth: true ,
            parentName: ':clientManagement'
        }
    },
    {
        path: '/department',
        name: 'department',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/DepartmentBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':clientManagement'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routerPath
});

export default router;