import axios from "axios";

const instance = axios.create({
    baseURL: '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        const refreshToken = localStorage.getItem('refreshToken');
        if(refreshToken){
            config.headers['X-Refresh-Token'] = refreshToken;
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
        const refreshToken = response.headers['X-Refresh-Token'];
        if(refreshToken){
            localStorage.setItem('refreshToken', refreshToken)
        }
        return response;
    }
);

export default instance;