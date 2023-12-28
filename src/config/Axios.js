import axios from "axios";
import routers from './RouterPath.js'
const instance = axios.create({
    baseURL: '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

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

instance.interceptors.request.use(
    (config) => {
        const matchedRoute = findRoute(config.url);
        if (matchedRoute.requiresAuth) {
            //如果是要驗證的api再放token
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                config.headers['X-Refresh-Token'] = refreshToken;
            }
        }
        return config;
    }
)

instance.interceptors.response.use(
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

export default instance;