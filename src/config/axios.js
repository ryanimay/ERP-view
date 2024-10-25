import axios from "axios";
import api from '@/config/api/apiConfig.js';
import { checkOrRefreshToken } from '@/config/tool/jwtTool';
import router from '@/config/router/routerConfig';
import i18n from '@/config/i18nConfig.js'

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
    for (const router in api.api) {
        const apiRouter = api.api[router];
        for (const r in apiRouter) {
            if (apiRouter[r].path === path) {
                return apiRouter[r];
            }
        }
    }
}

function setUserLang(config){
    const locale = localStorage.getItem("lang") ?? "zh_TW";
    config.headers['User-Lang'] = locale;
}

instance().interceptors.request.use(
    async (config) => {
        //標頭帶上語系
        setUserLang(config);
        const matchedRoute = findRoute(config.url);
        if (matchedRoute.requiresAuth) {
            //refreshToken的請求只管放refreshToken
            if(matchedRoute === api.api.client.refreshT){
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    config.headers['X-Refresh-Token'] = refreshToken;
                }
            }else{
                const validToken = await checkOrRefreshToken();
                if (validToken) {
                    //如果是要驗證的api再放token
                    const token = localStorage.getItem('token');
                    const refreshToken = localStorage.getItem('refreshToken');
                    config.headers['Authorization'] = `Bearer ${token}`;
                    if (refreshToken) {
                        config.headers['X-Refresh-Token'] = refreshToken;
                    }
                }else{
                    //中斷請求，拋出異常
                    return Promise.reject({type: 'RequestRejectedError', message: i18n.global.t('axios.reLogin')});
                }
            }
        }
        return config;
    }
)