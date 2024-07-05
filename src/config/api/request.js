import msg from '@/config/alterConfig.js'
import instance from '@/config/axios.js';
import path from '@/config/api/apiConfig.js';

//封裝所有網絡請求
export default {
    opValid: request(path.api.client.opValid),
    register: request(path.api.client.register),
    login: request(path.api.client.login),
    logout: request(path.api.client.logout),
    resetPassword: request(path.api.client.resetPassword),
    update: request(path.api.client.update),
    updatePassword: request(path.api.client.updatePassword),
    clientList: request(path.api.client.list),
    clientStatus: request(path.api.client.clientStatus),
    clientLock: request(path.api.client.clientLock),
    allMenu: request(path.api.menu.all),
    pMenu: request(path.api.menu.pMenu),
    signIn: request(path.api.attend.signIn),
    signOut: request(path.api.attend.signOut),
    departmentList: request(path.api.department.list),
    departmentStaff: request(path.api.department.staff),
    departmentEdit: request(path.api.department.edit),
    removeDepartment: request(path.api.department.remove),
    notificationStatus: request(path.api.notification.status),
    roleList: request(path.api.role.list),
    updateRole: request(path.api.role.update),
    addRole: request(path.api.role.add),
    removeRole: request(path.api.role.remove),
    updateRolePermission: request(path.api.role.rolePermission),
    permissionList: request(path.api.permission.list),
    rolePermission: request(path.api.permission.role),
}

const axios = instance();

function request(api){
    return function passData(data){
        return call(api, data);
    }
}

async function call(api, data){
    let response;
    try{
        if (api.method === 'get' || api.method === 'delete') {
            response = await axios({
                url: api.path,
                method: api.method,
                params: data
            });
        } else {
            response = await axios({
                url: api.path,
                method: api.method,
                data: data
            });
        }
    }catch(error){
        handleError(error);
    }
    return response;
}

function handleError(error){
    if(error.type === 'RequestRejectedError'){
        msg.error(error.message);
    }else{
        throw error;
    }
}