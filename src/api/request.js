import msg from '@/config/AlterConfig.js'
import instance from '@/config/Axios.js';
import path from '@/api/RouterPath.js';

//封裝所有網絡請求
export default {
    opValid: request(path.api.client.opValid),
    register: request(path.api.client.register),
    login: request(path.api.client.login),
    resetPassword: request(path.api.client.resetPassword),
    update: request(path.api.client.update),
    updatePassword: request(path.api.client.updatePassword),
    allMenu: request(path.api.menu.all),
    pMenu: request(path.api.menu.pMenu),
}

const axios = instance();

const methodMap = new Map([
    ['get', axios.get],
    ['post', axios.post],
    ['put', axios.put],
    ['delete', axios.delete]
]);

function request(api){
    return function passData(data){
        return call(api, data);
    }
}

function call(api, data){
    let response;
    try{
        response = requestMethod(api, data);
    }catch(error){
        handleError(error);
    }
    return response;
}

function requestMethod(api, data){
    const method = methodMap.get(api.method);
    let response;
    if (method) {
        if(data){
            response = method(api.path, data);
        }else{
            response = method(api.path)
        }
        return response;
    } else {
        throw new Error(`Unsupported method: ${api.method}`);
    }
}

function handleError(error){
    if(error.type === 'RequestRejectedError'){
        msg.error(error.message);
    }else{
        msg.error('Unknown Error');
    }
    console.error('API request failed:', error);
}