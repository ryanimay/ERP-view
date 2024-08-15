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
        meta: { 
            requiresAuth: true,
            headerKey: 'HomeHeader'  
        }
    },
    {
        path: '/login',
        name: 'login',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/prefix/LoginBody.vue'),
        },
        meta: { 
            headerKey: 'LoginHeader' 
        }
    },
    {
        path: '/forgetPassword',
        name: 'forgetPassword',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/prefix/ResetPasswordBody.vue'),
        },
        meta: { 
            headerKey: 'LoginHeader' 
        }
    },
    {
        path: '/updatePassword',
        name: 'updatePassword',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/prefix/UpdatePasswordBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            headerKey: 'LoginHeader' 
        }
    },
    {
        path: '/updateEmail',
        name: 'updateEmail',
        components: {
            header: () => import('@/components/header/LoginHeader.vue'),
            body: () => import('@/components/body/prefix/UpdateEmailBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            headerKey: 'LoginHeader' 
        }
    },
    {
        path: '/client',
        name: 'client',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/client/ClinetBody.vue'),
        },
        meta: { 
            requiresAuth: true ,
            parentName: ':clientManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/department',
        name: 'department',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/permission/DepartmentBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':permissionManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/rolePermission',
        name: 'rolePermission',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/permission/PermissionListBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':permissionManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/roleMenu',
        name: 'roleMenu',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/permission/RoleMenuBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':permissionManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/salaryList',
        name: 'salaryList',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/salary/SalaryListBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':salaryManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/salarySetting',
        name: 'salarySetting',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/salary/SalarySettingBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':salaryManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/personalPerformance',
        name: 'personalPerformance',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/performance/PersonalPerformanceBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':performanceManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/performanceList',
        name: 'performanceList',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/performance/PerformanceListBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':performanceManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/personalLeave',
        name: 'personalLeave',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/leave/PersonalLeaveBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':leaveManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/leaveList',
        name: 'leaveList',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/leave/LeaveListBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':leaveManagement',
            headerKey: 'HomeHeader'
        }
    },
    {
        path: '/projectList',
        name: 'projectList',
        components: {
            header: () => import('@/components/header/HomeHeader.vue'),
            body: () => import('@/components/body/project/ProjectListBody.vue'),
        },
        meta: { 
            requiresAuth: true,
            parentName: ':projectManagement',
            headerKey: 'HomeHeader'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routerPath
});

export default router;