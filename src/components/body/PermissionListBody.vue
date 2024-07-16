<template>
    <el-main class="homeBodyContainer preScroll" v-loading.lock="loading">
        <el-button type="primary" @click="click" class="marginButtom10">
            <el-icon>
                <EditPen />
            </el-icon>
            {{ $t('permissionListBody.editRolePermission') }}
        </el-button>
        <el-collapse>
            <el-collapse-item v-for="(permission) in permissionList" :key="permission.id" :name="permission.id" class="collapseParents">
                <template #title>
                    <div class="marginLeft20"><b>{{ $t('permission.' + permission.info) }}</b></div>
                </template>
                <el-row class="alignCenter textCenter">
                    <el-col :span="4">
                        <b>{{$t('permissionListBody.permissionId')}}</b>
                    </el-col>
                    <el-col :span="5">
                        <b>{{$t('permissionListBody.permissionName')}}</b>
                    </el-col>
                    <el-col :span="5">
                        <b>{{$t('permissionListBody.permissionInfo')}}</b>
                    </el-col>
                    <el-col :span="6">
                        <b>{{$t('permissionListBody.permissionUrl')}}</b>
                    </el-col>
                    <el-col :span="4">
                        <b>{{$t('permissionListBody.permissionStatus')}}</b>
                    </el-col>
                </el-row>
                <el-row v-for="(node) in permission.children" :key="node.id" class="alignCenter textCenter hoverBgc">
                    <el-col :span="4">
                        {{ node.id }}
                    </el-col>
                    <el-col :span="5">
                        {{ node.authority }}
                    </el-col>
                    <el-col :span="5">
                        {{ node.info }}
                    </el-col>
                    <el-col :span="6">
                        {{ node.url }}
                    </el-col>
                    <el-col :span="4">
                        <el-switch v-model="node.status" inline-prompt size="large" style="margin-left: 10px; --el-switch-on-color: #67c23a; --el-switch-off-color: #f56c6c" @change="changeStatus(node.id, node.status)">
                            <template #active-action>
                                <el-icon><Select></Select></el-icon>
                            </template>
                            <template #inactive-action>
                                <el-icon><CloseBold /></el-icon>
                            </template>
                        </el-switch>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>
        <el-dialog v-model="rolePermissionDialog" width="800" style="height: 780px;" destroy-on-close>
            <rolePermissionBody />
        </el-dialog>
    </el-main>
</template>

<script setup>
import request from '@/config/api/request.js';
import rolePermissionBody from '@/components/body/RolePermissionBody.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';

const permissionList = ref([]);
const rolePermissionDialog = ref(false);
const loading = ref(false);
const { proxy } = getCurrentInstance();
function click(){
    rolePermissionDialog.value = true;
}
onMounted(async () => {
    loading.value = true;
    await getPermissionList();
    loading.value = false;
});
async function getPermissionList() {
    const response = await request.permissionList();
    const data = handleResponse(response);
    if (data) {
        permissionList.value = data;
    }
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
async function changeStatus(id, status){
    loading.value = true;
    const response = await request.banPermission({
        "id": id,
        "status": status
    });
    if (response && response.data.code === 200) {
        proxy.$msg.success(response.data.data);
    } 
    loading.value = false;
}
</script>

<style scoped>
.marginLeft20{
    margin-left: 20px;;
}
.marginButtom10{
    margin-bottom: 10px;;
}
.alignCenter{
    align-items: center;
}
.textCenter div{
    display: flex;
    justify-content: center;
}
.hoverBgc{
    transition: background-color 0.3s;
}
.hoverBgc:hover{
    background-color: #dddddd !important;
}
.preScroll{
    overflow-y: scroll;
}
</style>