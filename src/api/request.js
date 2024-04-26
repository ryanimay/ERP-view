import msg from '@/config/AlterConfig.js'
import instance from '@/config/Axios.js';
import path from '@/api/RouterPath.js';

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

const methodMap = new Map([
    ['get', instance.get],
    ['post', instance.post],
    ['put', instance.put],
    ['delete', instance.delete]
]);

function request(api){
    return function passData(data){
        return call(api, data);
    }
}

async function call(api, data){
    let response;
    try{
        response = await requestMethod(api, data);
    }catch(error){
        handleError(error);
    }
    return response;
}

function requestMethod(api, data){
    const method = methodMap.get(api.method);
    if (method) {
        if(date){
            return method(api.path, data);
        }else{
            return method(api.path)
        }
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