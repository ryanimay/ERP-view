import { defineStore } from 'pinia';
import request from '@/config/api/request.js';

const userStore = defineStore(
    'user',
    {
        state: () => ({
            id: '',
            username: '',
            roleId: '',
            email: '',
            lastLoginTime: '',
            createTime: '',
            createBy: '',
            mustUpdatePassword: '',
            attendStatus: '',
            departmentId: '',
            departmentName: '',
            active: '',
            lock: '',
            isLogin: false,
        }),
        actions: {
            async login(data){
                const response = await request.login(data);
                if (response && response.data.code == 200) {
                    let user = response.data.data;
                    this.id = user.id;
                    this.username = user.username;
                    this.roleId = user.roleId;
                    this.email = user.email;
                    this.lastLoginTime = user.lastLoginTime;
                    this.createTime = user.createTime;
                    this.createBy = user.createBy;
                    this.mustUpdatePassword = user.mustUpdatePassword;
                    this.attendStatus = user.attendStatus;
                    this.departmentId = user.department.id;
                    this.departmentName = user.department.name;
                    this.active = user.active;
                    this.lock = user.lock;

                    this.isLogin = true;
                } 
                return response;
            },
            update(user){
                this.id = user.id;
                this.username = user.username;
                this.roleId = user.roleId;
                this.email = user.email;
                this.lastLoginTime = user.lastLoginTime;
                this.createTime = user.createTime;
                this.createBy = user.createBy;
                this.mustUpdatePassword = user.mustUpdatePassword;
                this.attendStatus = user.attendStatus;
                this.departmentId = user.department.id;
                this.departmentName = user.department.name;
                this.active = user.active;
                this.lock = user.lock;
                this.isLogin = true;
            },
            async logout(){
                const response = await request.logout();
                if (response && response.data.code == 200) {
                    this.$reset();
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    return response;
                }
            },
            updateAttendStatus(status){
                this.attendStatus = status;
            }
        },
        persist: true,
    }
)

export default userStore;