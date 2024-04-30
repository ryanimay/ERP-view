import axios from "axios";
import routers from '@/api/RouterPath.js';
import { verifyJWT } from '@/config/JwtTool';
import router from '@/config/router/routerConfig';

let axiosInstance = null;

export default function instance(){
    if (!axiosInstance) {
        axiosInstance = axios.create({
            baseURL: '',
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
            router: router,
        });
    }
    return axiosInstance;
}

function findRoute(path) {
    for (const router in routers.api) {
        const apiRouter = routers.api[router];
        for (const r in apiRouter) {
            if (apiRouter[r].path === path) {
                return apiRouter[r];
            }
        }
    }
}

instance().interceptors.request.use(
    (config) => {
        const matchedRoute = findRoute(config.url);
        //如果是要驗證的api再放token
        if (matchedRoute.requiresAuth) {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            //accessToken和refreshToken都未通過token驗證，才會轉跳登入頁
            if (!verifyJWT(token) && (!refreshToken || !verifyJWT(refreshToken))) {
                instance.defaults.router.push({ name: 'login' });
                return Promise.reject({type: 'RequestRejectedError', message:'登入過期，請重新登入'});
            }
            config.headers['Authorization'] = `Bearer ${token}`;
            if (refreshToken) {
                config.headers['X-Refresh-Token'] = refreshToken;
            }
        }
        return config;
    }
)

instance().interceptors.response.use(
    (response) => {
        const token = response.headers['authorization'];
        if (token) {
            localStorage.setItem('token', token.replace('Bearer ', ''))
        }
        const refreshToken = response.headers['x-refresh-token'];
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
        }
        return response;
    }
);