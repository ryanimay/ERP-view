import msg from '@/config/alterConfig.js'
import instance from '@/config/axios.js';
import path from '@/config/api/apiConfig.js';
import router from '@/config/router/routerConfig'

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
    refreshToken: request(path.api.client.refreshT),
    clientNameList: request(path.api.client.nameList),
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
    updateRoleMenu: request(path.api.role.roleMenu),
    permissionList: request(path.api.permission.list),
    rolePermission: request(path.api.permission.role),
    banPermission: request(path.api.permission.ban),
    getSalaryList: request(path.api.salary.get),
    salaryRoots: request(path.api.salary.roots),
    editSalaryRoots: request(path.api.salary.editRoot),
    performanceList: request(path.api.performance.list),
    performancePendingList: request(path.api.performance.pendingList),
    addPerformance: request(path.api.performance.add),
    rejectPerformance: request(path.api.performance.remove),
    updatePerformance: request(path.api.performance.update),
    acceptPerformance: request(path.api.performance.accept),
    calculatePerformance: request(path.api.performance.calculate),
    leaveList: request(path.api.leave.list),
    leaveTypeList: request(path.api.leave.typeList),
    addLeave: request(path.api.leave.add),
    deleteLeave: request(path.api.leave.delete),
    updateLeave: request(path.api.leave.update),
    leavePendingList: request(path.api.leave.pendingList),
    acceptLeave: request(path.api.leave.accept),
    rejectLeave: request(path.api.leave.reject),
    projectList: request(path.api.project.list),
    addProject: request(path.api.project.add),
    updateProject: request(path.api.project.update),
    startProject: request(path.api.project.start),
    doneProject: request(path.api.project.done),
    projectOrder: request(path.api.project.order),
    procureList: request(path.api.procure.list),
    updateProcure: request(path.api.procure.update),
    addProcure: request(path.api.procure.add),
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
        //返回格式都由後端封裝好，只要不是200都由後端返回i18n錯誤提示
        if(response.data.code != 200){
            msg.error(response.data.data);
        }
    }catch(error){
        handleError(error);
    }
    return response;
}

function handleError(error){
    if(error.type === 'RequestRejectedError'){
        router.push({ name: 'login' });
        msg.error(error.message);
    }else{
        throw error;
    }
}