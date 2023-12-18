import axios from "axios";
import router from './RouterConfig'
const instance = axios.create({
    baseURL: '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(
    (config) => {
        const matchedRoute = router.router.find(route => config.url.includes(route.path));
        if(matchedRoute.meta && matchedRoute.meta.requiresAuth && matchedRoute.meta.requiresAuth === true){
            const token = localStorage.getItem('token');
            if(token){
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            const refreshToken = localStorage.getItem('refreshToken');
            if(refreshToken){
                config.headers['X-Refresh-Token'] = refreshToken;
            }
        }
        return config;
    }
)

instance.interceptors.response.use(
    (response) => {
        const token = response.headers['authorization'];
        if(token){
            localStorage.setItem('token', token.replace('Bearer ', ''))
        }
        console.log(response);
        const refreshToken = response.headers['x-refresh-token'];
        if(refreshToken){
            localStorage.setItem('refreshToken', refreshToken)
        }
        return response;
    }
);

export default instance;