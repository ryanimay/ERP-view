import jwt_encode from 'vue-jwt-decode';
import request from '@/config/api/request.js';

var isRefreshing = false;
var requestQueue = [];

function addSubscriber(callback) {
    requestQueue.push(callback);
}

function onRefreshed() {
    requestQueue.forEach(callback => callback());
    requestQueue = [];
}

export async function checkOrRefreshToken(){
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if(await verifyJWT(accessToken)){
        return true;
    }else if(await verifyJWT(refreshToken)){
        if(!isRefreshing){
            isRefreshing = true;
            try {
                await refresh();
                isRefreshing = false;
                onRefreshed();
                return true;
            } catch (error) {
                isRefreshing = false;
                onRefreshed();
                return false;
            }
        }else {
            // 如果正在刷新中，等待刷新完成
            return new Promise((resolve) => {
                addSubscriber(() => resolve(checkOrRefreshToken()));
            });
        }
    }else{
        return false;
    }
}

async function refresh(){
    try {
        const response = await request.refreshToken();
        if (response && response.data.code === 200) {
            const token = response.headers['authorization'];
            if (token) {
                localStorage.setItem('token', token.replace('Bearer ', ''));
            }
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error; 
    }
}

async function verifyJWT(token) {
    if (token) {
        try {
            const decodedToken = jwt_encode.decode(token);
            if (decodedToken && decodedToken.exp) {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                return decodedToken.exp > currentTimestamp;
            }
        } catch (error) {
            console.log('ErrorToken:' + error);
        }
        return false;
    } else {
        return false;
    }
}